import React, { useState, useRef, useEffect } from "react";
import { AvailabilityStatus } from "@/app/types/types";

interface StatusConfig {
  name: string;
  color: string;
  icon: React.ReactNode;
  hoverColor: string;
  bgColor: string;
  textColor: string;
}

interface StatusConfigMap {
  [key: number]: StatusConfig;
}

interface AvailabilityStatusSelectorProps {
  status: AvailabilityStatus;
  onStatusChange: (status: AvailabilityStatus) => void;
}

const AvailabilityStatusSelector: React.FC<AvailabilityStatusSelectorProps> = ({
  status,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const statusConfig: StatusConfigMap = {
    [AvailabilityStatus.Available]: {
      name: "Available",
      color: "bg-emerald-500",
      icon: (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      ),
      hoverColor: "hover:bg-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    [AvailabilityStatus.Busy]: {
      name: "Busy",
      color: "bg-amber-500",
      icon: (
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      ),
      hoverColor: "hover:bg-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    [AvailabilityStatus.Away]: {
      name: "Away",
      color: "bg-sky-500",
      icon: (
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
      ),
      hoverColor: "hover:bg-sky-600",
      bgColor: "bg-sky-50",
      textColor: "text-sky-700",
    },
    [AvailabilityStatus.Offline]: {
      name: "Offline",
      color: "bg-slate-400",
      icon: (
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-400"></span>
        </span>
      ),
      hoverColor: "hover:bg-slate-500",
      bgColor: "bg-slate-50",
      textColor: "text-slate-600",
    },
  };

  const currentStatus = statusConfig[status];

  const toggleDropdown = (): void => setIsOpen(!isOpen);

  const handleStatusSelect = (newStatus: AvailabilityStatus): void => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Status</h2>

      <div className="relative" ref={dropdownRef}>
        {/* Current status display */}
        <div
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all"
        >
          <div className="flex items-center space-x-3">
            {currentStatus.icon}
            <span className="font-medium text-gray-700">
              {currentStatus.name}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        {/* Status options dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {Object.entries(statusConfig).map(([valueStr, config]) => {
              const value = parseInt(valueStr);
              return (
                <div
                  key={valueStr}
                  onClick={() =>
                    handleStatusSelect(value as AvailabilityStatus)
                  }
                  className={`flex items-center space-x-3 p-3 cursor-pointer ${
                    value === status ? config.bgColor : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  {config.icon}
                  <span
                    className={
                      value === status ? config.textColor : "text-gray-700"
                    }
                  >
                    {config.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status indicators as cards */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {Object.entries(statusConfig).map(([valueStr, config]) => {
          const value = parseInt(valueStr);
          const isSelected = value === status;

          return (
            <button
              key={valueStr}
              onClick={() => handleStatusSelect(value as AvailabilityStatus)}
              className={`relative flex items-center px-4 py-3 rounded-xl transition-all ${
                isSelected
                  ? `${config.color} text-white ring-2 ring-offset-2 ${config.color}`
                  : `${config.bgColor} ${config.textColor} hover:shadow-md`
              }`}
            >
              <div className="flex items-center space-x-3">
                {isSelected ? (
                  <span className="relative flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                ) : (
                  config.icon
                )}
                <span
                  className={`font-medium ${isSelected ? "text-white" : ""}`}
                >
                  {config.name}
                </span>
              </div>

              {isSelected && (
                <span className="absolute right-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityStatusSelector;
