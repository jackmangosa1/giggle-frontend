"use client";
import React, { useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiChevronLeft,
  FiCamera,
  FiCheck,
  FiSend,
  FiMoreVertical,
  FiPaperclip,
} from "react-icons/fi";
import { StaticImageData } from "next/image";
import Image from "next/image";
import CleaningImage from "../assets/cleaning.jpg";

const MessageStatus = ({
  isDelivered,
  isRead,
}: {
  isDelivered: boolean;
  isRead: boolean;
}) => {
  if (!isDelivered) {
    return <FiCheck className="h-4 w-4 text-gray-400" />;
  }

  return (
    <div className="relative flex">
      <FiCheck
        className={`h-4 w-4 ${isRead ? "text-blue-500" : "text-gray-400"}`}
      />
      <FiCheck
        className={`h-4 w-4 -ml-2 ${
          isRead ? "text-blue-500" : "text-gray-400"
        }`}
      />
    </div>
  );
};

interface Message {
  id: string;
  sender: string;
  text: string;
  date: string;
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const ChatDetail = ({
  message,
  onClose,
}: {
  message: Message;
  onClose: () => void;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { ...message, isSent: false }, // Received message
    {
      id: "2",
      sender: "You",
      text: "Hello! How can I help you today?",
      date: new Date().toISOString(),
      isRead: true,
      isSent: true,
      isDelivered: true,
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: Date.now().toString(),
          sender: "You",
          text: newMessage,
          date: new Date().toISOString(),
          isRead: false,
          isSent: true,
          isDelivered: true,
        },
      ]);
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
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center flex-1">
          <Image
            src={CleaningImage}
            alt={message.sender}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h2 className="font-semibold">{message.sender}</h2>
            <p className="text-xs text-gray-500">Online</p>
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
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.isSent
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">
                    {formatMessageTime(msg.date)}
                  </span>
                  {msg.isSent && (
                    <MessageStatus
                      isDelivered={msg.isDelivered}
                      isRead={msg.isRead}
                    />
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
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-full mx-auto h-screen bg-gray-50">
      {selectedMessage ? (
        <ChatDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <FiChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Messages
                  </h1>
                  <p className="text-sm text-gray-500">
                    {messages.length} messages
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-gray-900 p-2 rounded-full">
                  <FiCamera className="h-6 w-6" />
                </button>
                <button className="text-gray-700 hover:text-gray-900 p-2 rounded-full">
                  <FiEdit2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="divide-y">
            {messages
              .filter((message) =>
                message.sender.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((message) => (
                <div
                  key={message.id}
                  className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMessage(message)}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={CleaningImage}
                      alt={message.sender}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-900">
                        {message.sender}
                      </h2>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(new Date(message.date))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate pr-8">
                        {message.text}
                      </p>
                      <div className="flex items-center space-x-2">
                        <MessageStatus
                          isDelivered={message.isDelivered}
                          isRead={message.isRead}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* New Message Button */}
          <button className="fixed right-4 bottom-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
            <FiEdit2 className="h-5 w-5 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default MessageList;
