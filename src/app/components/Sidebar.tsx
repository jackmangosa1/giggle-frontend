"use client";
import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/navigation";
import MenuItem from "../components/MenuItem";


interface SubMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  link: string;
}

interface SidebarMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  link: string;
  notifications?: number;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  menuItems: SidebarMenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>("");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleItemClick = (item: SidebarMenuItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    } else {
      setActiveItem(item.id);
      router.push(item.link);
    }
  };

  const handleSubItemClick = (link: string, id: string) => {
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
          <div key={item.id}>
            <MenuItem
              icon={item.icon}
              label={item.label}
              notifications={item.notifications}
              isActive={activeItem === item.id}
              onClick={() => handleItemClick(item)}
            />
            {item.subItems && expandedItem === item.id && (
              <div className="bg-gray-50">
                {item.subItems.map((subItem) => (
                  <MenuItem
                    key={subItem.id}
                    icon={subItem.icon}
                    label={subItem.label}
                    isActive={activeItem === subItem.id}
                    onClick={() => handleSubItemClick(subItem.link, subItem.id)}
                    className="pl-8 md:pl-12"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t">
        <MenuItem icon={<AiOutlineMenu />} label="More" />
      </div>
    </div>
  );
};

export default Sidebar;