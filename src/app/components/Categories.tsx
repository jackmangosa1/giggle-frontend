"use client";
import React from "react";
import {
  FaCut,
  FaCar,
  FaSpa,
  FaBroom,
  FaBolt,
  FaTshirt,
  FaHammer,
  FaPaintBrush,
  FaWrench,
} from "react-icons/fa";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Barber",
      icon: <FaCut className="text-blue-600 text-3xl" />,
    },
    {
      id: 2,
      name: "Car Repair",
      icon: <FaCar className="text-blue-600 text-3xl" />,
    },
    {
      id: 3,
      name: "Massage",
      icon: <FaSpa className="text-blue-600 text-3xl" />,
    },
    {
      id: 4,
      name: "Cleaning",
      icon: <FaBroom className="text-blue-600 text-3xl" />,
    },
    {
      id: 5,
      name: "Electrician",
      icon: <FaBolt className="text-blue-600 text-3xl" />,
    },
    {
      id: 6,
      name: "Dressmaker",
      icon: <FaTshirt className="text-blue-600 text-3xl" />,
    },
    {
      id: 7,
      name: "Shoe Repair",
      icon: <FaHammer className="text-blue-600 text-3xl" />,
    },
    {
      id: 8,
      name: "Painter",
      icon: <FaPaintBrush className="text-blue-600 text-3xl" />,
    },
    {
      id: 9,
      name: "Plumber",
      icon: <FaWrench className="text-blue-600 text-3xl" />,
    },
  ];

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-8 lg:py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Popular Categories
        </h2>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Discover our most requested services and book with ease.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4 bg-blue-100 rounded-full mb-3">
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
