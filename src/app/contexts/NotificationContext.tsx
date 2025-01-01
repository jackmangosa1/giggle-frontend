"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
  FiCheckCircle,
  FiMessageCircle,
  FiAlertCircle,
  FiDollarSign,
  FiStar,
  FiClock,
  FiXCircle,
  FiThumbsUp,
  FiFlag,
} from "react-icons/fi";
import { IconType } from "react-icons";
import apiRoutes from "../config/apiRoutes";
import { BookingStatus, Notification, NotificationType } from "../types/types";

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  unreadCount: number;
  connectionStatus: "connected" | "disconnected" | "connecting";
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
  unreadCount: 0,
  connectionStatus: "disconnected",
});

const getBookingStatusIcon = (status: BookingStatus): IconType => {
  switch (status) {
    case BookingStatus.Pending:
      return FiClock;
    case BookingStatus.Approved:
      return FiThumbsUp;
    case BookingStatus.Rejected:
      return FiXCircle;
    case BookingStatus.Completed:
      return FiCheckCircle;
    case BookingStatus.Confirmed:
      return FiFlag;
    default:
      return FiClock;
  }
};

const getIconForNotificationType = (
  type: NotificationType,
  bookingStatus?: BookingStatus
): IconType => {
  if (
    type === NotificationType.BookingStatusChange &&
    bookingStatus !== undefined
  ) {
    return getBookingStatusIcon(bookingStatus);
  }

  switch (type) {
    case NotificationType.NewMessage:
      return FiMessageCircle;
    case NotificationType.PaymentStatusChange:
      return FiDollarSign;
    case NotificationType.NewBooking:
      return FiAlertCircle;
    case NotificationType.NewReview:
      return FiStar;
    default:
      return FiAlertCircle;
  }
};

const getBookingStatusMessage = (
  status: BookingStatus,
  serviceName: string = "your service"
): string => {
  switch (status) {
    case BookingStatus.Pending:
      return `Your booking for ${serviceName} is pending approval.`;
    case BookingStatus.Approved:
      return `Your booking for ${serviceName} has been approved.`;
    case BookingStatus.Rejected:
      return `Your booking for ${serviceName} has been rejected.`;
    case BookingStatus.Completed:
      return `Your booking for ${serviceName} has been marked as completed.`;
    case BookingStatus.Confirmed:
      return `Your booking for ${serviceName} has been confirmed.`;
    default:
      return `Your booking for ${serviceName} status has been updated.`;
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");

  useEffect(() => {
    let mounted = true;

    const fetchSavedNotifications = async () => {
      try {
        const response = await fetch(apiRoutes.getNotifications);
        if (response.ok) {
          const savedNotifications: Notification[] = await response.json();
          if (mounted) {
            setNotifications((prev) => [
              ...savedNotifications.map((notif) => ({
                ...notif,
                message:
                  notif.message ||
                  (notif.bookingStatus !== undefined
                    ? getBookingStatusMessage(notif.bookingStatus)
                    : "You have a new notification"),
                icon: getIconForNotificationType(
                  notif.type,
                  notif.bookingStatus
                ),
              })),
              ...prev,
            ]);
          }
        } else {
          console.error("Failed to fetch saved notifications.");
        }
      } catch (err) {
        console.error("Error fetching saved notifications:", err);
      }
    };

    const startConnection = async () => {
      try {
        setConnectionStatus("connecting");

        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl(apiRoutes.notificationHub, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect()
          .build();

        newConnection.onclose(() => {
          if (mounted) {
            setConnectionStatus("disconnected");
          }
        });

        newConnection.onreconnecting(() => {
          if (mounted) {
            setConnectionStatus("connecting");
          }
        });

        newConnection.onreconnected(() => {
          if (mounted) {
            setConnectionStatus("connected");
          }
        });

        newConnection.on(
          "ReceiveNotification",
          (message: string, bookingStatus?: BookingStatus) => {
            if (mounted) {
              const newNotification: Notification = {
                id: Date.now(),
                message,
                date: new Date().toISOString(),
                status: "notRead",
                type: NotificationType.BookingStatusChange,
                bookingStatus,
                icon: getIconForNotificationType(
                  NotificationType.BookingStatusChange,
                  bookingStatus
                ),
              };
              setNotifications((prev) => [newNotification, ...prev]);
            }
          }
        );

        await newConnection.start();
        if (mounted) {
          setConnection(newConnection);
          setConnectionStatus("connected");
        }
      } catch (err) {
        console.error("SignalR Connection Error:", err);
        if (mounted) {
          setConnectionStatus("disconnected");
          setTimeout(startConnection, 5000);
        }
      }
    };

    fetchSavedNotifications();
    startConnection();

    return () => {
      mounted = false;
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const markAsRead = async (id: number) => {};

  const unreadCount = notifications.filter(
    (n) => n.status === "notRead"
  ).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, unreadCount, connectionStatus }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
