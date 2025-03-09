import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiSend } from "react-icons/fi";
import Image from "next/image";
import CleaningImage from "../assets/cleaning.jpg";
import { Message } from "../types/types";
import MessageStatus from "./MessageStatus";
import apiRoutes from "../config/apiRoutes";

interface ChatDetailProps {
  receiverId: string;
  currentUserId: string | null;
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;
}

const ChatDetail: React.FC<ChatDetailProps> = ({
  receiverId,
  currentUserId,
  messages,
  sendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [receiverData, setReceiverData] = useState<{
    fullName: string;
    profilePictureUrl: string;
  }>({
    fullName: "",
    profilePictureUrl: "",
  });

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const response = await fetch(
          `${apiRoutes.getReceiverData}/${receiverId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
        const data = await response.json();
        console.log(data);
        setReceiverData({
          fullName: data.name,
          profilePictureUrl: data.profilePictureUrl || CleaningImage,
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    if (receiverId) {
      fetchReceiverData();
    }
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUserId) {
      await sendMessage(receiverId, newMessage.trim());
      setNewMessage("");
    }
  };

  const formatMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm px-4 py-2 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center flex-1">
          <Image
            src={receiverData.profilePictureUrl}
            alt={receiverId}
            className="w-10 h-10 rounded-full object-cover"
            width={40} // Optional: Specify width for better control
            height={40} // Optional: Specify height for better control
          />
          <div className="ml-3">
            <h2 className="font-semibold">
              {receiverData.fullName || receiverId}
            </h2>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={`${msg.id}-${index}`}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">
                    {formatMessageTime(msg.sentAt)}
                  </span>
                  {msg.senderId === currentUserId && (
                    <MessageStatus isRead={msg.isRead} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
