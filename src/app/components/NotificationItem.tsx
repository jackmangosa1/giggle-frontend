import React from "react";
import {
  BookingStatus,
  Notification,
  PaymentMethod,
  PaymentStatus,
} from "../types/types";
import { useNotifications } from "../contexts/NotificationContext";
import { useFlutterwave } from "flutterwave-react-v3";
import apiRoutes from "../config/apiRoutes";

type NotificationItemProps = {
  notification: Notification;
};

const userId =
  typeof window !== "undefined"
    ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
    : null;

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { markAsRead } = useNotifications();
  const IconComponent = notification.icon;

  const handleFlutterPayment = useFlutterwave({
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_API_KEY ?? "",
    tx_ref: `booking_${notification.bookingId}_${Date.now()}`,
    amount: notification.amount!,
    currency: "RWF",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: notification.email!,
      phonenumber: notification.phoneNumber!,
      name: notification.customerName!,
    },
    customizations: {
      title: "Service Payment",
      description: `Payment for booking #${notification.bookingId}`,
      logo: "",
    },
    meta: {
      bookingId: notification.bookingId,
      escrow: true,
    },
  });

  const handlePayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          const paymentData = {
            bookingId: notification.bookingId,
            transactionId: response.tx_ref,
            amount: notification.amount,
            customerId: userId,
            paymentDate: new Date().toISOString(),
            paymentMethod: PaymentMethod.Momo,
            paymentStatus: PaymentStatus.Escrow,
          };

          await fetch(apiRoutes.savePayment, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Payment saved successfully") {
                console.log("Payment data saved successfully:", data);
              } else {
                console.log("Payment saving failed:", data);
              }
            })
            .catch((error) => {
              console.error("Error saving payment:", error);
            });
        } else {
          console.log("Payment failed:", response);
        }

        closePaymentModal();
      },
      onClose: () => {
        console.log("Payment modal closed");
      },
    });
  };

  const handleConfirmClick = async (
    newStatus: BookingStatus,
    bookingId?: number
  ) => {
    await fetch(`${apiRoutes.confirmBooking}/${bookingId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    });
  };

  const handleCompleteClick = async (
    newStatus: BookingStatus,
    bookingId?: number
  ) => {
    await fetch(`${apiRoutes.updateBookingStatus}/${bookingId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    });
  };

  const showPayButton =
    notification.type === 2 &&
    notification.bookingStatus === 1 &&
    notification.paymentStatus === PaymentStatus.Pending;

  const showConfirmButton = notification.bookingStatus === 3;
  const showCompleteButton = notification.type === 3;

  return (
    <div
      className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer
        ${notification.status === "notRead" ? "bg-blue-50" : ""}`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100`}>
        <IconComponent
          className={`w-6 h-6 ${
            notification.status === "notRead"
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p
              className={`${
                notification.status === "notRead" ? "font-semibold" : ""
              } text-gray-800`}
            >
              {notification.message}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(notification.date).toLocaleString()}
            </p>
          </div>
          {showPayButton && (
            <button
              onClick={handlePayClick}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Pay Now
            </button>
          )}

          {showConfirmButton && (
            <button
              onClick={() =>
                handleConfirmClick(
                  BookingStatus.Confirmed,
                  notification.bookingId
                )
              }
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Confirm
            </button>
          )}

          {showCompleteButton && (
            <button
              onClick={() =>
                handleCompleteClick(
                  BookingStatus.Completed,
                  notification.bookingId
                )
              }
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

function closePaymentModal() {
  throw new Error("Function not implemented.");
}
