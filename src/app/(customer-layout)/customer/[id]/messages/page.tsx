"use client";
import React, { useEffect, useState } from "react";
import apiRoutes from "@/app/config/apiRoutes";
import CustomerMessageList from "@/app/components/CustomerMessageList";

const Page = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  const currentUserId = userId;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(apiRoutes.getProviderchat);
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        setConversations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Messages</h1>
      <CustomerMessageList conversations={conversations} />
    </div>
  );
};

export default Page;
