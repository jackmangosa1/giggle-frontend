interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  notifications?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
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
      <div
        className={`text-xl ${isActive ? "text-blue-500" : "text-gray-700"}`}
      >
        {icon}
      </div>
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

export default MenuItem;
