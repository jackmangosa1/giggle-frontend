import React from "react";
import { NotificationType, Notification } from "../../../types/types";
import {
  FiCheckCircle,
  FiMessageCircle,
  FiAlertCircle,
  FiDollarSign,
  FiStar,
} from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import NotificationItem from "../../../components/NotificationItem";

const notifications: Notification[] = [
  {
    id: 1,
    type: NotificationType.BookingStatusChange,
    message: "Your booking has been approved",
    date: new Date().toISOString(),
    icon: FiCheckCircle,
    status: "approved",
  },
  {
    id: 2,
    type: NotificationType.NewMessage,
    message: "You have a new message from John Doe",
    date: new Date().toISOString(),
    icon: FiMessageCircle,
  },
  {
    id: 3,
    type: NotificationType.ServiceCompleted,
    message: "The service has been successfully completed",
    date: new Date().toISOString(),
    icon: FiCheckCircle,
  },
  {
    id: 4,
    type: NotificationType.RefundCompleted,
    message: "Your refund has been processed",
    date: new Date().toISOString(),
    icon: FiDollarSign,
  },
  {
    id: 5,
    type: NotificationType.NewBooking,
    message: "New booking received from Jane Doe",
    date: new Date().toISOString(),
    icon: FiAlertCircle,
  },
  {
    id: 6,
    type: NotificationType.NewPayment,
    message: "Payment received for your service",
    date: new Date().toISOString(),
    icon: FiDollarSign,
  },
  {
    id: 7,
    type: NotificationType.NewReview,
    message: "You have received a new review",
    date: new Date().toISOString(),
    icon: FiStar,
  },
  {
    id: 8,
    type: NotificationType.BookingStatusChange,
    message: "Your booking has been rejected",
    date: new Date().toISOString(),
    icon: RxCross2,
    status: "rejected",
  },
  {
    id: 9,
    type: NotificationType.NewMessage,
    message: "You have a new message from John Doe",
    date: new Date().toISOString(),
    icon: FiMessageCircle,
  },
  {
    id: 10,
    type: NotificationType.ServiceCompleted,
    message: "The service has been successfully completed",
    date: new Date().toISOString(),
    icon: FiCheckCircle,
  },
  {
    id: 11,
    type: NotificationType.RefundCompleted,
    message: "Your refund has been processed",
    date: new Date().toISOString(),
    icon: FiDollarSign,
  },
  {
    id: 12,
    type: NotificationType.NewBooking,
    message: "New booking received from Jane Doe",
    date: new Date().toISOString(),
    icon: FiAlertCircle,
  },
  {
    id: 13,
    type: NotificationType.NewPayment,
    message: "Payment received for your service",
    date: new Date().toISOString(),
    icon: FiDollarSign,
  },
  {
    id: 14,
    type: NotificationType.NewReview,
    message: "You have received a new review",
    date: new Date().toISOString(),
    icon: FiStar,
  },
];

const Page: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex-1 ml-16 md:ml-96">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default Page;
