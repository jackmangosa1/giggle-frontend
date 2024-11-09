import React from "react";
import { Notification } from "../types/types";

type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const IconComponent = notification.icon;

  const iconColor =
    notification.type === "BookingStatusChange" &&
    notification.status === "rejected"
      ? "text-red-500"
      : "text-blue-500";

  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition">
      <div
        className={`flex-shrink-0 p-2 rounded-full ${iconColor} bg-gray-100`}
      >
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-gray-800 font-medium">{notification.message}</p>
        <p className="text-gray-500 text-sm">
          {new Date(notification.date).toLocaleString()}
        </p>
      </div>
      {notification.type === "BookingStatusChange" &&
        notification.status === "approved" && (
          <button className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition">
            Pay
          </button>
        )}
    </div>
  );
};

export default NotificationItem;
