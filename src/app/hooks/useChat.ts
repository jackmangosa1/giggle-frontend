import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import apiRoutes from "../config/apiRoutes";

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export const useChat = (currentUserId: string | null) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiRoutes.chatHub)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          setLoading(false);

          connection.on("ReceiveMessage", (message: Message) => {
            console.log("Received message with sentAt:", message.sentAt);
            setMessages((prev) => [...prev, message]);
          });

          connection.on("ReceiveChatHistory", (history: Message[]) => {
            setMessages(history);
          });

          connection.on("MessagesMarkedAsRead", (senderId: string) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === senderId ? { ...msg, isRead: true } : msg
              )
            );
          });
        })
        .catch((err) => {
          setError("Failed to connect to chat hub");
          setLoading(false);
        });
    }
  }, [connection]);

  const sendMessage = async (receiverId: string, content: string) => {
    if (connection) {
      try {
        console.log("Sending message with:", {
          currentUserId,
          receiverId,
          content,
        });
        await connection.invoke(
          "SendMessage",
          currentUserId,
          receiverId,
          content
        );
      } catch (err) {
        setError("Failed to send message");
      }
    }
  };

  // const loadChatHistory = async (otherUserId: string) => {
  //   try {
  //     const response = await fetch(
  //       `${apiRoutes.getChatHistory}?userId1=${currentUserId}&userId2=${otherUserId}`
  //     );
  //     if (!response.ok) throw new Error("Failed to load chat history");

  //     const data = await response.json();
  //     setMessages(data);
  //   } catch (err) {
  //     setError("Failed to load chat history");
  //   }
  // };

  const fetchChatHistory = async (userId1: string, userId2: string) => {
    try {
      setLoading(true);
      console.log(`Fetching chat history for user: ${userId1} with ${userId2}`);

      const response = await fetch(
        `${apiRoutes.getChatHistory}?userId1=${userId1}&userId2=${userId2}`
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.statusText}`);
      }

      const history = await response.json();
      console.log("Fetched messages:", history);
      setMessages(history);
    } catch (err) {
      console.error(err);
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (senderId: string) => {
    if (connection) {
      try {
        await connection.invoke("MarkAsRead", senderId, currentUserId);
      } catch (err) {
        setError("Failed to mark messages as read");
      }
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    //loadChatHistory,
    fetchChatHistory,
    markAsRead,
  };
};
