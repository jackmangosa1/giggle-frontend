import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import {
  FiCamera,
  FiChevronLeft,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
} from "react-icons/fi";
import MessageStatus from "./MessageStatus";
import Image from "next/image";
import CleaningImage from "../assets/cleaning.jpg";
import { Message } from "../types/types";

const ChatDetail = ({
  message,
  onClose,
  currentUserId,
}: {
  message: Message;
  onClose: () => void;
  currentUserId: string | null;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const { messages, sendMessage, loadChatHistory, markAsRead, connection } =
    useChat(currentUserId);

  // Wait for connection to be established before loading chat history
  useEffect(() => {
    if (connection && connection.state === "Connected") {
      loadChatHistory(message.senderId);
      markAsRead(message.senderId);
    }
  }, [message.senderId, loadChatHistory, markAsRead, connection]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && connection && connection.state === "Connected") {
      try {
        await sendMessage(message.senderId, newMessage.trim());
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
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
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center flex-1">
          <Image
            src={CleaningImage}
            alt={message.senderId}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h2 className="font-semibold">{message.senderId}</h2>
            <p className="text-xs text-gray-500">
              {connection?.state === "Connected" ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiCamera className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiMoreVertical className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
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
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiPaperclip className="h-6 w-6 text-gray-700" />
        </button>
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
          className={`p-2 rounded-full ${
            connection?.state === "Connected"
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400"
          } text-white`}
          disabled={connection?.state !== "Connected"}
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
