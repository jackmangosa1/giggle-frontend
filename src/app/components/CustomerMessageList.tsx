"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { List, Avatar, Input, Badge } from "antd";
import { FiSearch } from "react-icons/fi";
import type { Conversation } from "../types/types";

interface MessageListProps {
  conversations: Conversation[];
}

const CustomerMessageList: React.FC<MessageListProps> = ({ conversations }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

  const handleOpenChat = (senderId: string) => {
    router.push(`messages/chat/${senderId}`);
  };

  return (
    <div className="max-w-full mx-auto h-screen bg-gray-50 p-4">
      {/* Search Bar */}
      <Input
        prefix={<FiSearch className="text-gray-400" />}
        placeholder="Search messages"
        className="mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Chat List */}
      <List
        itemLayout="horizontal"
        dataSource={conversations.filter((conv) =>
          conv.senderName?.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={(conv) => (
          <List.Item
            className="cursor-pointer hover:bg-gray-100 transition"
            onClick={() => handleOpenChat(conv.messages[0].receiverId)}
          >
            <List.Item.Meta
              avatar={
                conv.senderProfilePicture ? (
                  <Avatar src={conv.senderProfilePicture} />
                ) : (
                  <Avatar className="bg-blue-500">
                    {conv.senderName?.charAt(0).toUpperCase()}
                  </Avatar>
                )
              }
              title={
                <div className="flex justify-between">
                  <span className="font-semibold">{conv.senderName}</span>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(conv.lastMessageAt)}
                  </span>
                </div>
              }
              description={
                <div className="flex justify-between">
                  <span className="truncate text-gray-600">
                    {conv.lastMessage}
                  </span>
                  {conv.hasUnreadMessages && <Badge color="blue" />}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CustomerMessageList;
