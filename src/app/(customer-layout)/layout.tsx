"use client";
import Sidebar from "@/app/components/Sidebar";
import {
  AiFillHome,
  AiFillMessage,
  AiFillHeart,
  AiOutlineUser,
} from "react-icons/ai";
import { useNotifications } from "../contexts/NotificationContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  const { unreadCount } = useNotifications();

  const customerMenuItems = [
    { id: "home", icon: <AiFillHome />, label: "Home", link: "/" },
    {
      id: "messages",
      icon: <AiFillMessage />,
      label: "Messages",
      link: `/customer/${userId}/messages`,
      notifications: unreadCount,
    },
    {
      id: "notifications",
      icon: <AiFillHeart />,
      label: "Notifications",
      link: `/customer/${userId}/notifications`,
    },
    {
      id: "profile",
      icon: <AiOutlineUser />,
      label: "Profile",
      link: `/customer/${userId}/profile`,
    },
  ];

  return (
    <div>
      <Sidebar menuItems={customerMenuItems} />
      {children}
    </div>
  );
}
