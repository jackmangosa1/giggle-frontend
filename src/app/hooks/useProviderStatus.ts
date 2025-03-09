import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import { AvailabilityStatus } from "@/app/types/types";
import { message } from "antd";
import { useEffect, useState } from "react";
import apiRoutes from "../config/apiRoutes";

// Hook for managing provider status with SignalR
export const useProviderStatus = () => {
  const [status, setStatus] = useState<AvailabilityStatus>(
    AvailabilityStatus.Offline
  );
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const userId: string | null =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  useEffect(() => {
    // Initialize SignalR connection
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiRoutes.providerStatusHub) // Use full URL
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Set up connection state change handler
    newConnection.onclose(() => {
      setIsConnected(false);
    });

    newConnection.onreconnecting(() => {
      setIsConnected(false);
    });

    newConnection.onreconnected(() => {
      setIsConnected(true);

      // Re-fetch status after reconnection
      if (userId) {
        newConnection.invoke("GetStatus", userId).catch((err) => {
          console.error("Error getting status after reconnection:", err);
        });
      }
    });

    // Set up event handlers before starting connection
    newConnection.on(
      "ReceiveCurrentStatus",
      (currentStatus: AvailabilityStatus) => {
        setStatus(currentStatus);
      }
    );

    newConnection.on(
      "ReceiveStatusUpdate",
      (providerId: string, updatedStatus: AvailabilityStatus) => {
        // Only update our status if the update is for our user

        setStatus(updatedStatus);
        message.success("Status updated successfully");
      }
    );

    // Start the connection
    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setIsConnected(true);
        setHubConnection(newConnection);

        // Get initial status once connected
        if (userId) {
          newConnection.invoke("GetStatus", userId).catch((err) => {
            console.error("Error getting initial status:", err);
            message.error("Failed to retrieve current status");
          });
        }
      })
      .catch((err: Error) => {
        console.error("SignalR Connection Error:", err);
        setIsConnected(false);
      });

    // Clean up connection on unmount
    return () => {
      if (newConnection) {
        newConnection
          .stop()
          .catch((err: Error) =>
            console.error("Error stopping connection:", err)
          );
      }
    };
  }, [userId]);

  // Function to update provider status
  const updateStatus = async (newStatus: AvailabilityStatus): Promise<void> => {
    try {
      if (!hubConnection) {
        throw new Error("SignalR connection not established");
      }

      if (hubConnection.state !== HubConnectionState.Connected) {
        throw new Error("SignalR connection is not in Connected state");
      }

      if (!userId) {
        throw new Error("User ID missing");
      }

      // Invoke update status method
      await hubConnection.invoke("UpdateStatus", userId, newStatus);

      // We don't set status here - we wait for the ReceiveStatusUpdate event
    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update status: Connection issue");
      throw error;
    }
  };

  return { status, updateStatus, isConnected };
};
