"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/app/hooks/useChat";
import ChatDetail from "@/app/components/ChatDetail";

const ChatPage = () => {
  const params = useParams();
  const receiverId = params.providerId as string;
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  const { messages, sendMessage, fetchChatHistory } = useChat(userId);

  useEffect(() => {
    if (userId && receiverId) {
      // fetchChatHistory(userId, "4609a63b-c6e7-49ec-bd06-ad296a2ef926");
    }
  }, [userId, receiverId]);

  console.log(receiverId, userId);

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
