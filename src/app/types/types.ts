import { IconType } from "react-icons";
// export interface Message {
//   id: string;
//   senderId: string;
//   text: string;
//   date: string;
//   isRead: boolean;
//   isSent: boolean;
//   isDelivered: boolean;
// }
export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}


export enum BookingStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Completed = 3,
  Confirmed = 4,
}

export enum NotificationType {
  NewBooking = 0,
  NewReview = 1,
  BookingStatusChange = 2,
  PaymentStatusChange = 3,
  NewMessage = 4,
}

export enum PaymentStatus {
  Pending = 0,
  Escrow = 1,
  Released = 2,
  Refunded = 3,
}
export enum PaymentMethod {
  Momo = 0,
  Card = 1,
  BankTransfer = 2,
}

export interface Notification {
  id: number;
  message: string;
  date: string;
  status: "read" | "notRead";
  type: NotificationType;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  bookingId?: number;
  customerName?: string;
  email?: string;
  phoneNumber?: string;
  amount?: number;
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
  userId: string;
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
