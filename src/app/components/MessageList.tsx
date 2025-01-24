"use client";
import React, { useState, useEffect } from "react";
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
import Image from "next/image";
import CleaningImage from "../assets/cleaning.jpg";
import { useChat } from "../hooks/useChat";
import MessageStatus from "./MessageStatus";
import ChatDetail from "./ChatDetail";
import { Message } from "../types/types";

interface MessageListProps {
  messages: Message[];
  currentUserId: string | null;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const formatMessageTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now.getTime() - messageDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return "Yesterday";
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-full mx-auto h-screen bg-gray-50">
      {selectedMessage ? (
        <ChatDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          currentUserId={currentUserId}
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
                message.senderId
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
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
                      alt={message.senderId}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-900">
                        {message.senderId}
                      </h2>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(message.sentAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate pr-8">
                        {message.content}
                      </p>
                      <div className="flex items-center space-x-2">
                        {message.senderId === currentUserId && (
                          <MessageStatus isRead={message.isRead} />
                        )}
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
