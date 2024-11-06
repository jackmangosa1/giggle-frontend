"use client";
import React, { useState } from "react";
import { FaRegUserCircle, FaStar, FaCheck } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import { Modal, Button, DatePicker, TimePicker, Rate, Input } from "antd";
import CleaningImage from "../assets/cleaning.jpg";
import { StaticImageData } from "next/image";
import { FaSearchPlus } from "react-icons/fa";

// Updated Service interface with a price field
interface Service {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
  price: string; // Added price as a string for easy formatting
}

type PortfolioItem = {
  id: number;
  title: string;
  image: StaticImageData;
};

const ServiceProviderProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"services" | "portfolio">(
    "services"
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // Modal state for review
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null); // Track selected portfolio item
  const [review, setReview] = useState(""); // Review comment state
  const [rating, setRating] = useState(0); // Rating state

  const services: Service[] = [
    {
      id: 1,
      title: "House Cleaning",
      image: CleaningImage,
      description:
        "Our detailed house cleaning service includes deep cleaning of all living spaces, including kitchens, bathrooms, bedrooms, and common areas. We focus on every detail, from scrubbing floors to dusting shelves, ensuring your home is spotless and fresh.",
      price: "$120", // Added price
    },
    {
      id: 2,
      title: "Office Cleaning",
      image: CleaningImage,
      description:
        "Our professional office cleaning service is designed to keep your workspace clean and organized. We offer regular cleaning schedules to suit your needs, including dusting, vacuuming, sanitizing surfaces, and ensuring restrooms are spotless.",
      price: "$150", // Added price
    },
    {
      id: 3,
      title: "Carpet Cleaning",
      image: CleaningImage,
      description:
        "Our comprehensive carpet cleaning service uses advanced cleaning techniques to remove dirt, stains, and allergens, bringing your carpets back to life.",
      price: "$80", // Added price
    },
    {
      id: 4,
      title: "Window Cleaning",
      image: CleaningImage,
      description:
        "Our spotless window cleaning service will leave your windows gleaming and streak-free. We use professional tools and eco-friendly cleaning products to clean both the interior and exterior of your windows.",
      price: "$50", // Added price
    },
  ];

  const portfolio: PortfolioItem[] = [
    { id: 1, title: "Job 1", image: CleaningImage },
    { id: 2, title: "Job 2", image: CleaningImage },
    { id: 3, title: "Job 3", image: CleaningImage },
  ];

  const skills: string[] = [
    "Office Cleaning",
    "Car Cleaning",
    "House Cleaning",
  ];

  const showServiceModal = (service: Service): void => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = (): void => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const openDateTimeModal = (): void => {
    setIsDateTimeModalOpen(true);
  };

  const closeDateTimeModal = (): void => {
    setIsDateTimeModalOpen(false);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: any) => {
    setSelectedTime(time);
  };

  const handleConfirmRequest = (): void => {
    closeDateTimeModal(); // Close Date/Time modal
    closeServiceModal(); // Close Service modal
  };

  const openReviewModal = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReview(""); // Reset the review state
    setRating(0); // Reset the rating state
  };

  const handleReviewSubmit = () => {
    // Handle review submission (could save to a database or state)
    console.log("Review Submitted: ", {
      review,
      rating,
      item: selectedPortfolio,
    });
    closeReviewModal(); // Close the modal after submission
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <Image
              src={CleaningImage}
              alt="Service Provider"
              className="rounded-full w-16 h-16 sm:w-24 sm:h-24 object-cover"
            />
            <FaCheck className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full p-1" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl sm:text-2xl font-bold">NATASHA CLEANING</h2>
            <div className="flex items-center text-gray-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="mr-1 text-yellow-500" />
              ))}
              <span className="ml-2">(10)</span>
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

      {/* Profile Details */}
      <div className="bg-white p-4 sm:p-6">
        <p className="text-gray-700">
          We offer the best services at affordable prices with over 10 years of
          experience. Our professional staff ensures top-notch service for your
          home and office needs.
        </p>
        <div className="mt-4 sm:mt-6">
          <h3 className="text-lg sm:text-xl font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-4">
            {skills.map((skill, index) => (
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

      {/* Tab Navigation */}
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

      {/* Review Modal */}
      {selectedPortfolio && (
        <Modal
          visible={isReviewModalOpen}
          onCancel={closeReviewModal}
          footer={null}
          width={500}
        >
          <div>
            <h3 className="text-xl font-semibold">
              Review {selectedPortfolio.title}
            </h3>
            <div className="mt-4">
              <Rate onChange={setRating} value={rating} />
            </div>
            <div className="mt-4">
              <Input.TextArea
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
              />
            </div>
            <Button
              type="primary"
              className="w-full mt-4"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </Button>
          </div>
        </Modal>
      )}

      {/* Tab Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {activeTab === "services" &&
          services.map((service) => (
            <div
              key={service.id}
              className="relative group cursor-pointer"
              onClick={() => showServiceModal(service)}
            >
              {/* Image */}
              <div className="relative group overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-lg transition-all duration-300"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40"></div>
                {/* Icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaSearchPlus className="text-white text-4xl" />
                </div>
              </div>
            </div>
          ))}
        {activeTab === "portfolio" &&
          portfolio.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer"
              onClick={() => openReviewModal(item)} 
            >
              {/* Portfolio Image */}
              <div className="relative group overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg transition-all duration-300"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40"></div>
                {/* Icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaSearchPlus className="text-white text-4xl" />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Service Modal */}
      {selectedService && (
        <Modal
          title={selectedService.title}
          open={isModalOpen}
          onCancel={closeServiceModal}
          footer={[
            <Button key="request" type="primary" onClick={openDateTimeModal}>
              Request Service
            </Button>,
          ]}
        >
          <div className="space-y-4">
            <Image
              src={selectedService.image}
              alt={selectedService.title}
              className="w-full h-60 object-cover rounded-lg"
            />
            <p className="text-base text-gray-700">
              {selectedService.description}
            </p>
            <p className="text-xl font-semibold text-gray-900">
              Price: {selectedService.price}
            </p>
          </div>
        </Modal>
      )}

      {/* Date/Time Modal */}
      <Modal
        visible={isDateTimeModalOpen}
        onCancel={closeDateTimeModal}
        footer={null}
        title="Select Date and Time"
      >
        <div className="space-y-4">
          <DatePicker
            format="YYYY-MM-DD"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: "100%" }}
          />
          <TimePicker
            value={selectedTime}
            onChange={handleTimeChange}
            format="HH:mm"
            style={{ width: "100%" }}
          />
          <Button
            type="primary"
            className="w-full"
            onClick={handleConfirmRequest}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceProviderProfile;
