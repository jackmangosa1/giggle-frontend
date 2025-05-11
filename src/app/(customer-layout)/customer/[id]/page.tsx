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
  Avatar,
  Empty,
} from "antd";
import apiRoutes from "@/app/config/apiRoutes";
import {
  AvailabilityStatus,
  CompletedService,
  Service,
} from "@/app/types/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useProviderStatus } from "@/app/hooks/useProviderStatus";
import { IoMdClose } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

interface Review {
  id: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

const ServiceProviderProfile: React.FC = () => {
  const router = useRouter();
  const { status: providerStatus } = useProviderStatus();
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
  const [selectedPortfolioService, setSelectedPortfolioService] =
    useState<CompletedService | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    if (completedServices && completedServices.length > 0) {
      let totalStars = 0;
      let reviewCount = 0;

      completedServices.forEach((service) => {
        if (service.reviews && service.reviews.length > 0) {
          service.reviews.forEach((review) => {
            totalStars += review.rating;
            reviewCount++;
          });
        }
      });

      setTotalReviews(reviewCount);
      setAverageRating(
        reviewCount > 0 ? parseFloat((totalStars / reviewCount).toFixed(1)) : 0
      );
    }
  }, [completedServices]);

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

  const showServiceModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

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
        setSelectedPortfolioService((prevState) => {
          if (prevState === null) return null;

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

          setSelectedPortfolioService((prevState) => {
            if (prevState === null) return null;

            return {
              ...prevState,
              reviews: [...prevState.reviews, reviewToDelete],
            };
          });
        }
      },
    });
  };

  const openDateTimeModal = () => {
    if (
      providerStatus === AvailabilityStatus.Offline ||
      providerStatus === AvailabilityStatus.Busy ||
      providerStatus === AvailabilityStatus.Away
    ) {
      setIsAvailabilityModalOpen(true);
    } else {
      setIsModalOpen(false);
      setIsDateTimeModalOpen(true);
    }
  };

  const closeDateTimeModal = () => {
    setIsDateTimeModalOpen(false);
  };

  const closeAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
  };

  const proceedWithBookingAnyway = () => {
    setIsAvailabilityModalOpen(false);
    setIsModalOpen(false);
    setIsDateTimeModalOpen(true);
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
        providerStatusAtBooking: providerStatus,
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

  const getStatusDetails = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.Available:
        return {
          color: "green",
          text: "Available",
          description: "Provider is ready to take new services",
        };
      case AvailabilityStatus.Busy:
        return {
          color: "yellow",
          text: "Busy",
          description: "Provider is currently working on services",
        };
      case AvailabilityStatus.Offline:
        return {
          color: "default",
          text: "Offline",
          description: "Provider is not accepting services",
        };
      case AvailabilityStatus.Away:
        return {
          color: "blue",
          text: "Away",
          description: "Provider will respond later",
        };
    }
  };

  const statusDetails = getStatusDetails(providerStatus);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
        <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="relative flex flex-col gap-2">
              {providerData.profilePictureUrl ? (
                <div className="relative mt-5">
                  <Avatar
                    size={96}
                    src={providerData.profilePictureUrl}
                    className="border-2 border-gray-200"
                  />
                </div>
              ) : (
                <Avatar size={96} className="border-2 border-gray-200" />
              )}

              <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
                <div
                  className={`flex items-center px-3 py-1 rounded-full mb-2 ${
                    statusDetails.color === "green"
                      ? "bg-green-100 text-green-800"
                      : statusDetails.color === "yellow"
                      ? "bg-yellow-100 text-yellow-800"
                      : statusDetails.color === "blue"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      statusDetails.color === "green"
                        ? "bg-green-500"
                        : statusDetails.color === "yellow"
                        ? "bg-yellow-500"
                        : statusDetails.color === "blue"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="font-medium">{statusDetails.text}</span>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {providerData.displayName}
              </h2>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`${
                        star <= Math.round(averageRating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      size={18}
                    />
                  ))}
                </div>
                <div className="ml-2 text-gray-600 font-medium">
                  {averageRating > 0 ? (
                    <span>
                      {averageRating} ({totalReviews}{" "}
                      {totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  ) : (
                    <span>No reviews yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <button
              className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg transform transition-transform hover:scale-105"
              onClick={() =>
                router.push(
                  `/customer/${userId}/messages/chat/${providerData.id}`
                )
              }
            >
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
        <div className="bg-white rounded-lg shadow-sm p-4">
          {activeTab === "services" && (
            <>
              {providerData.services && providerData.services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {providerData.services.map((service: Service) => (
                    <div
                      key={service.id}
                      className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                      onClick={() => showServiceModal(service)}
                    >
                      <div className="relative group overflow-hidden">
                        {service.mediaUrl ? (
                          <Image
                            src={service.mediaUrl}
                            alt={service.name}
                            width={300}
                            height={160}
                            className="w-full h-40 object-cover transition-all duration-300"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaSearchPlus className="text-white text-4xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-gray-500">
                        No services available at the moment
                      </span>
                    }
                  />
                </div>
              )}
            </>
          )}

          {activeTab === "portfolio" && (
            <>
              {completedServices && completedServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {completedServices.map((service) => (
                    <div
                      key={service.id}
                      className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                      onClick={() => showPortfolioModal(service)}
                    >
                      <div className="relative group overflow-hidden">
                        {service.mediaUrl ? (
                          <Image
                            src={service.mediaUrl}
                            alt={service.description}
                            width={300}
                            height={160}
                            className="w-full h-40 object-cover transition-all duration-300"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 transition-all duration-300 group-hover:opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaSearchPlus className="text-white text-4xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-gray-500">
                        No completed services in portfolio yet
                      </span>
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Service Modal */}
        <Modal
          open={isModalOpen}
          onCancel={closeServiceModal}
          footer={null}
          width={700}
          className="service-modal"
          bodyStyle={{ padding: 0 }}
          closeIcon={null}
        >
          {selectedService && (
            <div>
              <div className="relative">
                <Image
                  src={selectedService.mediaUrl ?? "/api/placeholder/600/240"}
                  alt={selectedService.name}
                  width={700}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-0 right-0 p-2">
                  <Button
                    type="text"
                    icon={<IoMdClose />}
                    onClick={closeServiceModal}
                    className="bg-white/80 hover:bg-white text-gray-700 rounded-full"
                  />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedService.name}
                </h2>

                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedService.price}
                    </p>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={openDateTimeModal}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8"
                  >
                    Request Service
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Availability Warning Modal */}
        <Modal
          title={null}
          open={isAvailabilityModalOpen}
          onCancel={closeAvailabilityModal}
          className="rounded-lg overflow-hidden"
          bodyStyle={{ padding: "24px" }}
          footer={[
            <Button
              key="cancel"
              onClick={closeAvailabilityModal}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Button>,
            <Button
              key="proceed"
              type="primary"
              onClick={proceedWithBookingAnyway}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              Continue Anyway
            </Button>,
          ]}
        >
          <div className="py-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  statusDetails.color === "yellow"
                    ? "bg-yellow-500"
                    : statusDetails.color === "blue"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              ></div>
              Provider is currently {statusDetails.text}
            </h3>
            <p className="text-gray-600 mb-3">
              {statusDetails.description}. Your booking request may take longer
              to be processed.
            </p>
            <p className="text-gray-700 font-medium">
              Do you want to continue with your booking request anyway?
            </p>
          </div>
        </Modal>

        {/* Portfolio Modal */}
        <Modal
          open={isPortfolioModalOpen}
          onCancel={closePortfolioModal}
          footer={null}
          width={700}
          className="portfolio-modal"
          bodyStyle={{ padding: 0 }}
          closeIcon={null}
        >
          {selectedPortfolioService && (
            <div>
              <div className="relative">
                <Image
                  src={
                    selectedPortfolioService.mediaUrl ??
                    "/api/placeholder/600/300"
                  }
                  alt={selectedPortfolioService.description}
                  width={700}
                  height={350}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-0 right-0 p-2">
                  <Button
                    type="text"
                    icon={<IoMdClose />}
                    onClick={closePortfolioModal}
                    className="bg-white/80 hover:bg-white text-gray-700 rounded-full"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Project Details</h3>
                  {userId === selectedPortfolioService.userId && (
                    <Button
                      type="primary"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add Review
                    </Button>
                  )}
                </div>
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPortfolioService.description}
                  </p>
                </div>

                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Reviews</h3>
                  </div>

                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {selectedPortfolioService.reviews?.map((review: Review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-4 mb-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar
                              icon={<AiOutlineUser />}
                              className="bg-blue-100 text-blue-600"
                            />
                            <div>
                              <span className="font-medium block">
                                {review.userName}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
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
                                    <MdOutlineEdit className="mr-2" /> Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    key="delete"
                                    danger
                                    onClick={(e) => {
                                      e.domEvent.stopPropagation();
                                      handleDeleteReview(review.id);
                                    }}
                                  >
                                    <MdDeleteOutline className="mr-2" /> Delete
                                  </Menu.Item>
                                </Menu>
                              }
                              trigger={["click"]}
                            >
                              <Button
                                type="text"
                                icon={<BsThreeDotsVertical />}
                                className="text-gray-400 hover:text-gray-600"
                              />
                            </Dropdown>
                          )}
                        </div>
                        <div className="ml-10">
                          <Rate disabled defaultValue={review.rating} />
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                    {(!selectedPortfolioService.reviews ||
                      selectedPortfolioService.reviews.length === 0) && (
                      <div className="text-center py-6">
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <span className="text-gray-500">
                              No reviews yet
                            </span>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Review Modal */}
        <Modal
          title={existingReview ? "Edit Review" : "Add Review"}
          open={isReviewModalOpen}
          onCancel={() => {
            setIsReviewModalOpen(false);
            setExistingReview(null);
            setNewReview({ rating: 0, comment: "" });
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setIsReviewModalOpen(false);
                setExistingReview(null);
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
