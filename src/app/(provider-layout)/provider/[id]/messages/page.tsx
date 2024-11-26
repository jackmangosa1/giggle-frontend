import React from "react";
import MessageList from "../../../../components/MessageList";

const Page: React.FC = () => {
  const messages = [
    {
      id: "1",
      sender: "John Doe",
      text: "Hello, how are you?",
      date: "2024-11-09 10:00 AM",
      isRead: false,
      isSent: true,
      isDelivered: true,
    },
    {
      id: "2",
      sender: "Jane Smith",
      text: "Just checking in on you!",
      date: "2024-11-08 8:30 PM",
      isRead: true,
      isSent: true,
      isDelivered: true,
    },
    {
      id: "3",
      sender: "Admin",
      text: "Your account has been updated.",
      date: "2024-11-07 2:00 PM",
      isRead: true,
      isSent: false,
      isDelivered: true,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Messages</h1>
      <MessageList messages={messages} />
    </div>
  );
};

export default Page;
