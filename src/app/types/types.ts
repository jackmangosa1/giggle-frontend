import { IconType } from "react-icons";

export enum BookingStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Completed = 3,
  Confirmed = 4,
}

export enum NotificationType {
  BookingStatusChange = 2,
  NewMessage = 3,
  PaymentStatusChange = 4,
  NewBooking = 5,
  NewReview = 6,
}

export interface Notification {
  id: number;
  message: string;
  date: string;
  status: "read" | "notRead";
  type: NotificationType;
  bookingStatus?: BookingStatus;
  icon: IconType;
}

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
