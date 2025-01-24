"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatDetail from "@/app/components/ChatDetail";
import { useChat } from "@/app/hooks/useChat";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const currentUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  const { messages, loading, error } = useChat(currentUserId);
  const receiverId = params.providerId as string;

  // Find the initial message for the user we want to chat with
  const initialMessage = messages.find(
    (msg) => msg.senderId === params.userId
  ) || {
    id: 0,
    senderId: params.userId as string,
    content: "",
    sentAt: new Date().toISOString(),
    isRead: false,
    receiverId: receiverId,
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <ChatDetail
        message={initialMessage}
        onClose={() => router.push("/messages")}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default Page;
