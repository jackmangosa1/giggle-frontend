"use client";
import React, { useState, useEffect } from "react";
import { FaRegUserCircle, FaStar, FaCheck, FaSearchPlus } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import { Modal, Button, DatePicker, TimePicker, Rate, Input } from "antd";
import apiRoutes from "@/app/config/apiRoutes";
import { Service } from "@/app/types/types";
import { useParams } from "next/navigation";

const ServiceProviderProfile: React.FC = () => {
  const { id } = useParams();
  const [providerData, setProviderData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"services" | "portfolio">(
    "services"
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await fetch(
          `${apiRoutes.getPublicProviderProfile}/${id}`
        );
        const data = await response.json();
        setProviderData({
          ...data,
          skills: data.skills || [],
          services: data.services || [],
        });
      } catch (error) {
        console.error("Failed to fetch provider data:", error);
      }
    };

    fetchProviderData();
  }, []);

  const showServiceModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const openDateTimeModal = () => {
    setIsModalOpen(false);
    setIsDateTimeModalOpen(true);
  };

  const closeDateTimeModal = () => {
    setIsDateTimeModalOpen(false);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: any) => {
    setSelectedTime(time);
  };

  const handleConfirmRequest = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Modal.error({
        title: "Booking Error",
        content: "Please select a service, date, and time.",
      });
      return;
    }

    try {
      const bookingData = {
        customerId: userId,
        serviceId: selectedService.id,
        date: selectedDate.format("YYYY-MM-DD"), 
        time: selectedTime.format("HH:mm"), 
      };

      const response = await fetch(apiRoutes.createBooking, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if required
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      Modal.success({
        title: "Booking Confirmed",
        content: `Your booking for ${selectedService.name} has been submitted.`,
      });

      closeDateTimeModal();
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      console.error("Booking error:", error);
      Modal.error({
        title: "Booking Failed",
        content: "Unable to complete your booking. Please try again.",
      });
    }
  };

  if (!providerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
        <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Image
                src={providerData.profilePictureUrl}
                alt="Service Provider"
                width={96}
                height={96}
                className="rounded-full w-16 h-16 sm:w-24 sm:h-24 object-cover"
              />
              <FaCheck className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full p-1" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                {providerData.displayName}
              </h2>
              <div className="flex items-center text-gray-500">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="mr-1 text-yellow-500" />
                ))}
                <span className="ml-2">(5)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <button className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg transform transition-transform hover:scale-105">
              <BiMessageSquareDetail className="mr-2" size={20} />
              Chat
            </button>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6">
          <p className="text-gray-700">{providerData.bio}</p>
          <div className="mt-4 sm:mt-6">
            <h3 className="text-lg sm:text-xl font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-4">
              {providerData.skills.map((skill: string, index: number) => (
                <div
                  key={index}
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-blue-50 text-blue-600 font-medium text-sm sm:text-base"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white">
          <div className="flex">
            <button
              className={`flex-1 py-3 sm:py-4 text-center text-base sm:text-lg font-semibold ${
                activeTab === "services"
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "border-b-4 border-transparent text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("services")}
            >
              Services
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 text-center text-base sm:text-lg font-semibold ${
                activeTab === "portfolio"
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "border-b-4 border-transparent text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {activeTab === "services" &&
            providerData.services.map((service: Service) => (
              <div
                key={service.id}
                className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                onClick={() => showServiceModal(service)}
              >
                <div className="relative group overflow-hidden">
                  <Image
                    src={service.mediaUrl ?? ""}
                    alt={service.name}
                    width={300}
                    height={160}
                    className="w-full h-40 object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaSearchPlus className="text-white text-4xl" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Modal
          title={selectedService?.name}
          open={isModalOpen}
          onCancel={closeServiceModal}
          footer={[
            <Button key="request" type="primary" onClick={openDateTimeModal}>
              Request Service
            </Button>,
          ]}
        >
          {selectedService && (
            <div className="space-y-4">
              <Image
                src={selectedService.mediaUrl ?? ""}
                alt={selectedService.name}
                width={600}
                height={240}
                className="w-full h-60 object-cover rounded-lg"
              />
              <p className="text-base text-gray-700">
                {selectedService.description}
              </p>
              <p className="text-xl font-semibold text-gray-900">
                Price: ${selectedService.price}
              </p>
            </div>
          )}
        </Modal>

        <Modal
          open={isDateTimeModalOpen}
          onCancel={closeDateTimeModal}
          footer={null}
          title="Schedule Service"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <DatePicker
                className="w-full"
                format="YYYY-MM-DD"
                value={selectedDate}
                onChange={handleDateChange}
                disabledDate={(current) => {
                  return (
                    current &&
                    current.valueOf() < Date.now() - 24 * 60 * 60 * 1000
                  );
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <TimePicker
                className="w-full"
                format="HH:mm"
                value={selectedTime}
                onChange={handleTimeChange}
                minuteStep={30}
                hideDisabledOptions
                disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 23]}
              />
            </div>

            <Button
              type="primary"
              className="w-full"
              onClick={handleConfirmRequest}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Booking
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
