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

const getBookingStatusMessage = (status: BookingStatus, bookingId: number): string => {
  switch (status) {
    case BookingStatus.Approved:
      return `Your booking #${bookingId} has been approved`;
    case BookingStatus.Rejected:
      return `Your booking #${bookingId} has been rejected`;
    case BookingStatus.Completed:
      return `Your booking #${bookingId} has been completed`;
    case BookingStatus.Confirmed:
      return `Your booking #${bookingId} has been confirmed`;
    case BookingStatus.Pending:
      return `Your booking #${bookingId} is pending`;
    default:
      return `Your booking #${bookingId} status has been updated`;
  }
};

const getNotificationMessage = (
  type: NotificationType,
  bookingId?: number,
  bookingStatus?: BookingStatus
): string => {
  switch (type) {
    case NotificationType.NewBooking:
      return "You have a new booking for your service";
    case NotificationType.NewReview:
      return "A new review has been added for your service";
    case NotificationType.BookingStatusChange:
      if (bookingId && bookingStatus !== undefined) {
        return getBookingStatusMessage(bookingStatus, bookingId);
      }
      return "A booking status has been updated";
    case NotificationType.PaymentStatusChange:
      return bookingId
        ? `Payment for booking #${bookingId} has been processed successfully`
        : "A payment has been processed successfully";
    case NotificationType.NewMessage:
      return "You have a new message";
    default:
      return "You have a new notification";
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
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
                  getNotificationMessage(notif.type, notif.bookingId, notif.bookingStatus),
                icon: getIconForNotificationType(
                  notif.type,
                  notif.bookingStatus
                ),
              })),
              ...prev,
            ]);
          }
        } else {
          console.error("Failed to fetch saved notifications");
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
          (message: string, bookingId?: number, type?: NotificationType, bookingStatus?: BookingStatus) => {
            if (mounted) {
              const notificationType = type ?? NotificationType.BookingStatusChange;
              const newNotification: Notification = {
                id: Date.now(),
                message:
                  message ||
                  getNotificationMessage(notificationType, bookingId, bookingStatus),
                date: new Date().toISOString(),
                status: "notRead",
                type: notificationType,
                bookingId,
                bookingStatus,
                icon: getIconForNotificationType(notificationType, bookingStatus),
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

  const markAsRead = async (id: number) => {
    // try {
    //   const response = await fetch(`${apiRoutes.markAsRead}/${id}`, {
    //     method: "POST"
    //   });
      
    //   if (response.ok) {
    //     setNotifications((prev) =>
    //       prev.map((notif) =>
    //         notif.id === id ? { ...notif, status: "read" } : notif
    //       )
    //     );
    //   } else {
    //     console.error("Failed to mark notification as read");
    //   }
    // } catch (err) {
    //   console.error("Error marking notification as read:", err);
    // }
  };

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