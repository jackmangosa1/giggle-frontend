"use client";
import React, { useState, useEffect } from "react";
import { FaRegUserCircle, FaStar, FaCheck, FaSearchPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import {
  Modal,
  Button,
  DatePicker,
  TimePicker,
  Rate,
  Input,
  Dropdown,
  Menu,
} from "antd";
import apiRoutes from "@/app/config/apiRoutes";
import { CompletedService, Service } from "@/app/types/types";
import { useParams } from "next/navigation";

interface Review {
  id: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

const ServiceProviderProfile: React.FC = () => {
  const { id } = useParams();
  const [providerData, setProviderData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"services" | "portfolio">(
    "services"
  );
  const [completedServices, setCompletedServices] = useState<
    CompletedService[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  // New state for portfolio and reviews
  const [selectedPortfolioService, setSelectedPortfolioService] =
    useState<CompletedService | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  // When opening the modal for editing
  const handleEditClick = (review: Review) => {
    setExistingReview(review);
    setNewReview({
      rating: review.rating,
      comment: review.comment,
    });
    setIsReviewModalOpen(true);
  };

  // When closing the modal
  const handleModalClose = () => {
    setIsReviewModalOpen(false);
    setNewReview({ rating: 0, comment: "" });
    setExistingReview(null);
  };

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
          completedServices: data.completedServices || [],
        });
        setCompletedServices(data.completedServices);
      } catch (error) {
        console.error("Failed to fetch provider data:", error);
      }
    };

    fetchProviderData();
  }, [id, providerData]);

  // Existing service modal handlers
  const showServiceModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // Portfolio modal handlers
  const showPortfolioModal = (service: CompletedService) => {
    setSelectedPortfolioService(service);
    setIsPortfolioModalOpen(true);
  };

  const closePortfolioModal = () => {
    setIsPortfolioModalOpen(false);
    setSelectedPortfolioService(null);
  };
  const handleAddReview = async () => {
    if (!selectedPortfolioService || !newReview.rating) {
      Modal.error({
        title: "Review Error",
        content: "Please provide a rating.",
      });
      return;
    }

    try {
      const response = await fetch(apiRoutes.createReview, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
          userId: userId,
          completedServiceId: selectedPortfolioService.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      // Refresh the data
      const updatedResponse = await fetch(
        `${apiRoutes.getPublicProviderProfile}/${id}`
      );
      const updatedData = await updatedResponse.json();
      setCompletedServices(updatedData.completedServices);

      setIsReviewModalOpen(false);
      setNewReview({ rating: 0, comment: "" });

      Modal.success({
        title: "Review Added",
        content: "Your review has been successfully added.",
      });
    } catch (error) {
      console.error("Failed to add review:", error);
      Modal.error({
        title: "Review Error",
        content: "Failed to add your review. Please try again.",
      });
    }
  };

  const handleEditReview = async (id: number) => {
    if (!selectedPortfolioService || !newReview.rating) {
      Modal.error({
        title: "Review Error",
        content: "Please provide a rating.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiRoutes.updateReview}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const updatedResponse = await fetch(
        `${apiRoutes.getPublicProviderProfile}/${id}`
      );
      const updatedData = await updatedResponse.json();
      setCompletedServices(updatedData.completedServices);

      setIsReviewModalOpen(false);
      setNewReview({ rating: 0, comment: "" });

      Modal.success({
        title: "Review Updated",
        content: "Your review has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update review:", error);
      Modal.error({
        title: "Review Error",
        content: "Failed to update your review. Please try again.",
      });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const reviewToDelete = selectedPortfolioService?.reviews.find(
      (review) => review.id === reviewId
    );

    if (!reviewToDelete) {
      console.error("Review not found");
      return;
    }

    Modal.confirm({
      title: "Delete Review",
      content: "Are you sure you want to delete this review?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        // Optimistic update: remove review immediately
        setSelectedPortfolioService((prevState) => {
          if (prevState === null) return null; // Handle case where prevState might be null

          return {
            ...prevState,
            reviews: prevState.reviews.filter(
              (review) => review.id !== reviewId
            ),
          };
        });

        try {
          const response = await fetch(
            `${apiRoutes.deleteReview}/${reviewId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete review");
          }

          Modal.success({
            title: "Review Deleted",
            content: "Your review has been successfully deleted.",
          });
        } catch (error) {
          console.error("Failed to delete review:", error);
          Modal.error({
            title: "Review Error",
            content: "Failed to delete your review. Please try again.",
          });

          // Rollback optimistic update if the request fails
          setSelectedPortfolioService((prevState) => {
            if (prevState === null) return null; // Handle case where prevState might be null

            return {
              ...prevState,
              reviews: [...prevState.reviews, reviewToDelete], // Add back the review
            };
          });
        }
      },
    });
  };

  // Existing booking handlers
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
        {/* Provider Info */}
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

        {/* Bio and Skills */}
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

        {/* Tabs */}
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

        {/* Content */}
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

          {activeTab === "portfolio" && (
            <div className="mt-6 grid gap-6">
              {completedServices && completedServices.length > 0 ? (
                completedServices.map((service) => (
                  <div
                    key={service.id}
                    className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                    onClick={() => showPortfolioModal(service)}
                  >
                    <div className="relative group overflow-hidden">
                      <Image
                        src={service.mediaUrl ?? ""}
                        alt={service.description}
                        width={500}
                        height={160}
                        className="w-full h-40 object-cover transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaSearchPlus className="text-white text-4xl" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No completed services available.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Service Modal */}
        <Modal
          open={isModalOpen}
          onCancel={closeServiceModal}
          footer={[
            <Button key="request" type="primary" onClick={openDateTimeModal}>
              Request Service
            </Button>,
          ]}
        >
          {selectedService && (
            <div className="space-y-4 mt-8">
              <Image
                src={selectedService.mediaUrl ?? ""}
                alt={selectedService.name}
                width={600}
                height={240}
                className="w-full h-60 object-cover rounded-lg"
              />
              <p className="text-base text-gray-700">{selectedService.name}</p>
              <p className="text-base text-gray-700">
                {selectedService.description}
              </p>
              <p className="text-xl font-semibold text-gray-900">
                Price: ${selectedService.price}
              </p>
            </div>
          )}
        </Modal>

        {/* Portfolio Modal */}
        <Modal
          open={isPortfolioModalOpen}
          onCancel={closePortfolioModal}
          footer={null}
        >
          {selectedPortfolioService && (
            <div className="space-y-4 mt-8">
              <div className="relative">
                <Image
                  src={selectedPortfolioService.mediaUrl ?? ""}
                  alt={selectedPortfolioService.description}
                  width={600}
                  height={240}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">
                  {selectedPortfolioService.description}
                </p>
                {userId === selectedPortfolioService.userId && (
                  <Button
                    type="primary"
                    onClick={() => setIsReviewModalOpen(true)}
                  >
                    Add Review
                  </Button>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                <div className="space-y-4">
                  {selectedPortfolioService.reviews?.map((review: Review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaRegUserCircle
                            className="text-gray-400"
                            size={24}
                          />
                          <span className="font-medium">{review.userName}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {userId === review.userId && (
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item
                                  key="edit"
                                  onClick={(e) => {
                                    e.domEvent.stopPropagation();
                                    setExistingReview(review);
                                    setNewReview({
                                      rating: review.rating,
                                      comment: review.comment,
                                    });
                                    setIsReviewModalOpen(true);
                                  }}
                                >
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  key="delete"
                                  danger
                                  onClick={(e) => {
                                    e.domEvent.stopPropagation();
                                    handleDeleteReview(review.id);
                                  }}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <Button
                              type="text"
                              icon={<BsThreeDotsVertical />}
                            />
                          </Dropdown>
                        )}
                      </div>
                      <div className="ml-8">
                        <Rate disabled defaultValue={review.rating} />
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedPortfolioService.reviews ||
                    selectedPortfolioService.reviews.length === 0) && (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Review Modal */}
        {/* Review Modal */}
        <Modal
          title={existingReview ? "Edit Review" : "Add Review"}
          open={isReviewModalOpen}
          onCancel={() => {
            setIsReviewModalOpen(false);
            setExistingReview(null); // Clear existing review when closing the modal
            setNewReview({ rating: 0, comment: "" });
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setIsReviewModalOpen(false);
                setExistingReview(null); // Clear existing review when closing the modal
                setNewReview({ rating: 0, comment: "" });
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={
                existingReview
                  ? () => handleEditReview(existingReview.id)
                  : handleAddReview
              }
              disabled={!newReview.rating}
            >
              {existingReview ? "Update Review" : "Submit Review"}
            </Button>,
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <Rate
                value={newReview.rating}
                onChange={(value) =>
                  setNewReview({ ...newReview, rating: value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <Input.TextArea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                rows={4}
                placeholder="Share your experience..."
              />
            </div>
          </div>
        </Modal>

        {/* Booking DateTime Modal */}
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
