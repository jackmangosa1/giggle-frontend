import Sidebar from "../components/Sidebar";
import {
  AiFillHome,
  AiFillMessage,
  AiFillHeart,
  AiOutlineUser,
} from "react-icons/ai";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const customerMenuItems = [
    { id: "home", icon: <AiFillHome />, label: "Home", link: "/" },
    {
      id: "messages",
      icon: <AiFillMessage />,
      label: "Messages",
      link: "/messages",
      notifications: 2,
    },
    {
      id: "notifications",
      icon: <AiFillHeart />,
      label: "Notifications",
      link: "/notifications",
    },
    {
      id: "profile",
      icon: <AiOutlineUser />,
      label: "Profile",
      link: "/user-profile",
    },
  ];

  return (
    <div>
      <Sidebar menuItems={customerMenuItems} />
      {children}
    </div>
  );
}
