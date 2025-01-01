import React from "react";
import { Notification } from "../types/types";
import { useNotifications } from "../contexts/NotificationContext";

type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { markAsRead } = useNotifications();
  const IconComponent = notification.icon;

  const handleClick = () => {
    if (notification.status === 'notRead') {
      markAsRead(notification.id);
    }
  };

  return (
    <div
      className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer
        ${notification.status === 'notRead' ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100`}>
        <IconComponent className={`w-6 h-6 ${notification.status === 'notRead' ? 'text-blue-500' : 'text-gray-500'}`} />
      </div>
      <div className="ml-4 flex-1">
        <p className={`${notification.status === 'notRead' ? 'font-semibold' : ''} text-gray-800`}>
          {notification.message}
        </p>
        <p className="text-gray-500 text-sm">
          {new Date(notification.date).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;