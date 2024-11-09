import { IconType } from "react-icons";

export enum NotificationType {
  BookingStatusChange = "BookingStatusChange",
  NewMessage = "NewMessage",
  ServiceCompleted = "ServiceCompleted",
  RefundCompleted = "RefundCompleted",
  NewBooking = "NewBooking",
  NewPayment = "NewPayment",
  NewReview = "NewReview",
}

export type Notification = {
  id: number;
  type: NotificationType;
  message: string;
  date: string; // ISO date string
  icon: IconType; // Icon component from react-icons
  status?: "approved" | "rejected"; // Specific to BookingStatusChange
};
