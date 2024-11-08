"use client";
import React, { useState } from "react";
import { FaRegUserCircle, FaStar, FaCheck, FaSearchPlus } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import { Modal, Button, DatePicker, TimePicker, Rate, Input } from "antd";
import CleaningImage from "../assets/cleaning.jpg";
import { StaticImageData } from "next/image";
import Sidebar from "../components/Sidebar";
// Interfaces
interface Service {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
  price: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
  reviews: Review[];
}

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
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const services: Service[] = [
    {
      id: 1,
      title: "House Cleaning",
      image: CleaningImage,
      description:
        "Our detailed house cleaning service includes deep cleaning of all living spaces, including kitchens, bathrooms, bedrooms, and common areas. We focus on every detail, from scrubbing floors to dusting shelves, ensuring your home is spotless and fresh.",
      price: "$120",
    },
    {
      id: 2,
      title: "Office Cleaning",
      image: CleaningImage,
      description:
        "Professional office cleaning service designed to maintain a pristine workspace. Regular schedules available with comprehensive cleaning of all areas.",
      price: "$150",
    },
    {
      id: 3,
      title: "Carpet Cleaning",
      image: CleaningImage,
      description:
        "Deep carpet cleaning service using advanced equipment and eco-friendly products to remove stains and refresh your carpets.",
      price: "$80",
    },
    {
      id: 4,
      title: "Window Cleaning",
      image: CleaningImage,
      description:
        "Professional window cleaning service for crystal clear results. We clean both interior and exterior windows with attention to detail.",
      price: "$50",
    },
  ];

  const portfolio: PortfolioItem[] = [
    {
      id: 1,
      title: "Luxury Home Deep Clean",
      image: CleaningImage,
      description:
        "Complete deep cleaning of a 5000 sq ft luxury home. This project included detailed cleaning of all rooms, windows, and carpets.",
      reviews: [
        {
          id: 1,
          userName: "John Smith",
          rating: 5,
          comment:
            "Exceptional attention to detail. My home has never been cleaner!",
          date: "2024-03-15",
        },
        {
          id: 2,
          userName: "Sarah Johnson",
          rating: 4,
          comment: "Very thorough cleaning service. Would recommend!",
          date: "2024-03-10",
        },
      ],
    },
    {
      id: 2,
      title: "Corporate Office Maintenance",
      image: CleaningImage,
      description:
        "Weekly cleaning service for a corporate office space of 10,000 sq ft.",
      reviews: [
        {
          id: 3,
          userName: "Michael Brown",
          rating: 5,
          comment:
            "Consistent quality and reliability. Our office always looks impeccable.",
          date: "2024-03-12",
        },
      ],
    },
    {
      id: 3,
      title: "Post-Construction Cleanup",
      image: CleaningImage,
      description: "Detailed cleaning after major home renovation project.",
      reviews: [
        {
          id: 4,
          userName: "Emma Wilson",
          rating: 5,
          comment:
            "Amazing transformation! They handled all the post-construction mess perfectly.",
          date: "2024-03-08",
        },
      ],
    },
  ];

  const skills = [
    "Office Cleaning",
    "Car Cleaning",
    "House Cleaning",
    "Window Cleaning",
    "Carpet Cleaning",
  ];

  const showServiceModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const showPortfolioModal = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
  };

  const handlePortfolioModalClose = () => {
    setSelectedPortfolio(null);
    setNewReview({ rating: 0, comment: "" });
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

  const handleConfirmRequest = () => {
    closeDateTimeModal();
    console.log("Booking confirmed:", {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
    });
  };

  const handleReviewSubmit = () => {
    if (selectedPortfolio && newReview.rating > 0 && newReview.comment.trim()) {
      const newReviewObj: Review = {
        id: Date.now(),
        userName: "Current User",
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
      };

      console.log("New review submitted:", newReviewObj);

      setNewReview({ rating: 0, comment: "" });
      handlePortfolioModalClose();
    }
  };

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
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
              <h2 className="text-xl sm:text-2xl font-bold">
                NATASHA CLEANING
              </h2>
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

        <div className="bg-white p-4 sm:p-6">
          <p className="text-gray-700">
            We offer the best services at affordable prices with over 10 years
            of experience. Our professional staff ensures top-notch service for
            your home and office needs.
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
            services.map((service) => (
              <div
                key={service.id}
                className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                onClick={() => showServiceModal(service)}
              >
                <div className="relative group overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="w-full h-40 object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40" />
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
                className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                onClick={() => showPortfolioModal(item)}
              >
                <div className="relative group overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
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
          title={selectedService?.title}
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
          )}
        </Modal>

        <Modal
          open={selectedPortfolio !== null}
          onCancel={handlePortfolioModalClose}
          footer={null}
          width={800}
          title={selectedPortfolio?.title}
        >
          {selectedPortfolio && (
            <div className="space-y-6">
              <div className="relative h-96 w-full">
                <Image
                  src={selectedPortfolio.image}
                  alt={selectedPortfolio.title}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>

              <div className="text-gray-700">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p>{selectedPortfolio.description}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Reviews ({selectedPortfolio.reviews.length})
                </h3>
                {selectedPortfolio.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaRegUserCircle className="text-gray-400 text-xl" />
                        <span className="font-medium">{review.userName}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Rate disabled defaultValue={review.rating} />
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <Rate
                      value={newReview.rating}
                      onChange={(rating) =>
                        setNewReview((prev) => ({ ...prev, rating }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <Input.TextArea
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Share your experience with this service..."
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="primary"
                    onClick={handleReviewSubmit}
                    disabled={
                      newReview.rating === 0 || !newReview.comment.trim()
                    }
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
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
