"use client";
import React from "react";
import {
  FaSearch,
  FaCalendarCheck,
  FaCheckCircle,
  FaLock,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-10 px-4 sm:px-6 md:px-8 lg:py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          How It Works
        </h2>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
        {/* Step 1: Browse Providers */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaSearch className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Find Your Provider
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Browse through categories to find the best provider for your
            service.
          </p>
        </div>

        {/* Step 2: Book the Service */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaCalendarCheck className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Book the Service
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Find the best provider for your service and confirm your booking
            request.
          </p>
        </div>

        {/* Step 3: Booking Approved */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaCheckCircle className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Booking Approval
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            The provider reviews your request and approves it.
          </p>
        </div>

        {/* Step 4: Payment in Escrow */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaLock className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Pay into Escrow
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Make a secure payment, which is held safely in escrow.
          </p>
        </div>

        {/* Step 5: Service Completion */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaCalendarCheck className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Service Completed
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            The provider completes the service as per the booking.
          </p>
        </div>

        {/* Step 6: Confirm Release of Payment */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaMoneyBillWave className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Release Payment
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Confirm completion, and payment is released to the provider.
          </p>
        </div>

        {/* Step 7: Leave a Review */}
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <FaStar className="text-4xl text-blue-600" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-900">
            Review the Pro
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Rate and review your experience to help others choose the best.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
