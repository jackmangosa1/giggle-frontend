"use client";
import React from "react";
import MessageList from "@/app/components/MessageList";
import { useChat } from "../../../../hooks/useChat";

const Page: React.FC = () => {
 
  const userId =
  typeof window !== "undefined"
    ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
    : null;

  const { messages, loading, error } = useChat(userId);

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
    <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Messages</h1>
      <MessageList 
        messages={messages} 
        currentUserId={userId} 
      />
    </div>
  );
};

export default Page;