"use client";
import React, { useState } from "react";
import {
  AiFillHome,
  AiFillMessage,
  AiFillHeart,
  AiOutlineUser,
  AiOutlineMenu,
} from "react-icons/ai";
import { IconType } from "react-icons";
import { useRouter } from "next/navigation";

interface MenuItemProps {
  icon: IconType;
  label: string;
  notifications?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  notifications = 0,
  isActive = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
  >
    <div className="relative">
      {notifications > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">{notifications}</span>
        </div>
      )}
      <Icon
        className={`w-6 h-6 ${isActive ? "text-blue-500" : "text-gray-700"}`}
      />
    </div>
    <span
      className={`hidden md:block text-sm ${
        isActive ? "font-semibold" : "font-medium"
      } text-gray-900`}
    >
      {label}
    </span>
  </button>
);

interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  link: string;
  notifications?: number;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>("home");

  const menuItems: MenuItem[] = [
    { id: "home", icon: AiFillHome, label: "Home", link: "/" },
    {
      id: "messages",
      icon: AiFillMessage,
      label: "Messages",
      link: "/messages",
      notifications: 1,
    },
    {
      id: "notifications",
      icon: AiFillHeart,
      label: "Notifications",
      link: "/notifications",
    },
    {
      id: "profile",
      icon: AiOutlineUser,
      label: "Profile",
      link: "/user-profile",
    },
  ];

  const handleItemClick = (id: string, link: string) => {
    setActiveItem(id);
    router.push(link);
  };

  return (
    <div className="fixed left-0 h-full w-16 md:w-64 flex flex-col bg-white border-r shadow-sm">
      <div
        className="p-4 md:p-6 border-b cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="hidden md:flex items-center">
          <span className="text-blue-600 text-2xl font-bold italic">G</span>
          <span className="font-semibold">iggle</span>
          <span className="text-xs align-super">®</span>
        </div>
        <div className="md:hidden flex justify-center">
          <span className="text-blue-600 text-2xl font-bold italic">G</span>
        </div>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            notifications={item.notifications}
            isActive={activeItem === item.id}
            onClick={() => handleItemClick(item.id, item.link)}
          />
        ))}
      </nav>

      <div className="border-t">
        <MenuItem icon={AiOutlineMenu} label="More" />
      </div>
    </div>
  );
};

export default Sidebar;
