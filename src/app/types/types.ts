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
  date: string;
  icon: IconType;
  status?: "approved" | "rejected";
};

export enum PriceType {
  fixed = 1,
}
export interface ProviderProfile {
  id: number;
  displayName: string;
  bio: string;
  skills: string[];
  profilePictureUrl?: string;
  userName: string;
  email: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  mediaUrl?: string;
  categoryName: string;
  price: number;
  priceType: PriceType;
}

export interface CompletedService {
  id: number;
  title: string;
  description: string;
  mediaUrl?: string;
  completedAt: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
