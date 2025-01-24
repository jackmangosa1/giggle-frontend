import { FiCheck } from "react-icons/fi";

const MessageStatus = ({ isRead }: { isRead: boolean }) => {
    return (
      <div className="relative flex">
        <FiCheck
          className={`h-4 w-4 ${isRead ? "text-blue-500" : "text-gray-400"}`}
        />
        <FiCheck
          className={`h-4 w-4 -ml-2 ${
            isRead ? "text-blue-500" : "text-gray-400"
          }`}
        />
      </div>
    );
  };

  export default MessageStatus;