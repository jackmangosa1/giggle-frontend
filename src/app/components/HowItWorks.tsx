"use client";
import React from "react";
import {
  FaSearch,
  FaCalendarCheck,
  FaCheckCircle,
  FaLock,
  FaMoneyBillWave,
  FaStar,
  FaTools,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const HowItWorks = () => {
  const router = useRouter();
  const steps = [
    {
      id: 1,
      title: "Find Your Provider",
      description:
        "Browse through categories to find the best provider for your service.",
      icon: <FaSearch className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Book the Service",
      description:
        "Find the best provider for your service and confirm your booking request.",
      icon: <FaCalendarCheck className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Booking Approval",
      description: "The provider reviews your request and approves it.",
      icon: <FaCheckCircle className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "Pay into Escrow",
      description: "Make a secure payment, which is held safely in escrow.",
      icon: <FaLock className="w-6 h-6" />,
    },
    {
      id: 5,
      title: "Service Completed",
      description: "The provider completes the service as per the booking.",
      icon: <FaTools className="w-6 h-6" />,
    },
    {
      id: 6,
      title: "Release Payment",
      description:
        "Confirm completion, and payment is released to the provider.",
      icon: <FaMoneyBillWave className="w-6 h-6" />,
    },
    {
      id: 7,
      title: "Review the Pro",
      description:
        "Rate and review your experience to help others choose the best.",
      icon: <FaStar className="w-6 h-6" />,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 md:px-8 lg:py-24">
      <div className="max-w-6xl mx-auto text-center">
        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium inline-block mb-4">
          Simple Process
        </span>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          How It Works
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Get your service done in just a few simple steps
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

            <div className="p-6">
              <div className="flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all duration-300 group-hover:scale-110">
                  <div className="text-blue-600">{step.icon}</div>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>

                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
          onClick={() => router.push("/login")}
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
