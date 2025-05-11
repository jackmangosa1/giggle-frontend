"use client";
import React, { useEffect, useState } from "react";
import MessageList from "@/app/components/ProviderMessageList";
import apiRoutes from "@/app/config/apiRoutes";
import { Empty, Spin, Alert, Button } from "antd";

const Page = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  const currentUserId = userId;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(apiRoutes.getUserChat);
        if (response.status === 404) {
          setIsEmpty(true);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length === 0) {
          setIsEmpty(true);
        } else if (data?.message?.includes("No conversations")) {
          setIsEmpty(true);
        } else {
          setConversations(data);
        }
      } catch (err: any) {
        if (err.message.includes("No conversations")) {
          setIsEmpty(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading conversations..." />
      </div>
    );
  }

  if (isEmpty || conversations.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ height: 60 }}
          description={
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Messages Yet
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                When you start conversations with customers, they will appear
                here.
              </p>
            </div>
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
        <Button type="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessageList conversations={conversations} />
    </div>
  );
};

export default Page;
