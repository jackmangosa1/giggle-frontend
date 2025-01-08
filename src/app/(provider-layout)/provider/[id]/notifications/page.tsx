"use client";
import React from "react";
import { useNotifications } from "@/app/contexts/NotificationContext";
import NotificationItem from "@/app/components/NotificationItem";

export default function NotificationsPage() {
  const { notifications } = useNotifications();

  return (
    <div className="w-full max-w-4xl mx-auto flex-1 ml-16 md:ml-96">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div>
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
