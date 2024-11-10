import Sidebar from "../components/Sidebar";
import {
  AiFillHome,
  AiFillMessage,
  AiFillHeart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaRegSquarePlus } from "react-icons/fa6";
import { MdWorkOutline, MdMiscellaneousServices } from "react-icons/md";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const providerMenuItems = [
    { id: "home", icon: <AiFillHome />, label: "Home", link: "/provider" },
    {
      id: "create",
      icon: <FaRegSquarePlus />,
      label: "Create",
      link: "/provider/create",
      subItems: [
        {
          id: "create-service",
          icon: <MdMiscellaneousServices />,
          label: "Service",
          link: "/provider/create/service",
        },
        {
          id: "create-portfolio",
          icon: <MdWorkOutline />,
          label: "Portfolio",
          link: "/provider/create/portfolio",
        },
      ],
    },
    {
      id: "messages",
      icon: <AiFillMessage />,
      label: "Messages",
      link: "/provider/messages",
      notifications: 2,
    },
    {
      id: "notifications",
      icon: <AiFillHeart />,
      label: "Notifications",
      link: "/provider/notifications",
    },
    {
      id: "profile",
      icon: <AiOutlineUser />,
      label: "Profile",
      link: "/provider/profile",
    },
  ];

  return (
    <div>
      <Sidebar menuItems={providerMenuItems} />
      {children}
    </div>
  );
}