import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
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

          // Set up message handlers
          connection.on("ReceiveMessage", (message: Message) => {
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

  const loadChatHistory = async (otherUserId: string) => {
    if (connection) {
      try {
        await connection.invoke("LoadChatHistory", currentUserId, otherUserId);
      } catch (err) {
        setError("Failed to load chat history");
      }
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
    loadChatHistory,
    markAsRead,
    connection,
  };
};
