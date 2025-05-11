"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/app/hooks/useChat";
import ChatDetail from "@/app/components/ChatDetail";

const ChatPage = () => {
  const params = useParams();
  const receiverId = params.customerId as string;
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  const { messages, sendMessage, fetchChatHistory } = useChat(userId);

  useEffect(() => {
    if (userId && receiverId) {
      // Load chat history when the page loads
      // You can add this functionality to your useChat hook if needed
    }
  }, [userId, receiverId]);

  return (
    <ChatDetail
      receiverId={receiverId}
      currentUserId={userId}
      messages={messages}
      sendMessage={sendMessage}
    />
  );
};

export default ChatPage;
