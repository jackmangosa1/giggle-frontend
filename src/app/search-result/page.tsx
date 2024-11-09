"use client";
import React, { useState } from "react";
import { Select, Slider, Rate } from "antd";
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import ProfileImage from "../assets/dressMaker.jpg";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ServiceProvider {
  id: string;
  name: string;
  logo: StaticImageData;
  rating: number;
  reviewCount: number;
  location: string;
  responseTime: string;
  description: string;
  startingPrice: number;
  isOnline: boolean;
  hiresCount: number;
  badges?: string[];
}

const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Simply Tidy Cleaning Service",
    logo: ProfileImage,
    rating: 4.9,
    reviewCount: 8,
    location: "New York, NY",
    responseTime: "19 min",
    description:
      "We offer the best services at affordable prices. We have been in business for over 10 years with well-trained and professional staff.",
    startingPrice: 180,
    isOnline: true,
    hiresCount: 1,
    badges: ["Top Rated", "Fast Responder"],
  },
  {
    id: "2",
    name: "Sparkle Pro Cleaners",
    logo: ProfileImage,
    rating: 4.8,
    reviewCount: 15,
    location: "Brooklyn, NY",
    responseTime: "30 min",
    description:
      "Professional cleaning services for homes and businesses. Satisfaction guaranteed!",
    startingPrice: 150,
    isOnline: false,
    hiresCount: 5,
    badges: ["Trusted Service"],
  },
  {
    id: "3",
    name: "Eco-Friendly Maid Service",
    logo: ProfileImage,
    rating: 4.7,
    reviewCount: 12,
    location: "Manhattan, NY",
    responseTime: "45 min",
    description:
      "Eco-friendly products and services for a healthy, clean home.",
    startingPrice: 200,
    isOnline: true,
    hiresCount: 3,
  },
];

const Page: React.FC = () => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Cleaning Services in New York
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {mockServiceProviders.length} service providers available
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                style={{ width: "12rem" }}
                options={[
                  { value: "recommended", label: "Recommended" },
                  { value: "price_low", label: "Lowest Price" },
                  { value: "price_high", label: "Highest Price" },
                  { value: "rating", label: "Top Rated" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Visible on Mobile in Row Format */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6 lg:block flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-4">
                  Price Range
                </h3>
                <Slider
                  range
                  min={0}
                  max={500}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as number[])}
                  tooltip={{ formatter: (value) => `$${value}` }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    ${priceRange[0]}
                  </span>
                  <span className="text-sm text-gray-500">
                    ${priceRange[1]}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-4">
                  Minimum Rating
                </h3>
                <Rate value={minRating} onChange={setMinRating} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-4">
                  Availability
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-gray-700">Online Now</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-gray-700">Available Today</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {mockServiceProviders.map((provider) => (
              <div
                onClick={() => router.push("/profile")}
                key={provider.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 relative overflow-hidden">
                      <Image
                        src={provider.logo}
                        alt={`${provider.name} logo`}
                        className="object-cover"
                        fill
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-md md:text-lg font-semibold text-gray-900">
                          {provider.name}
                        </h2>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm font-medium text-green-600">
                            Excellent {provider.rating}
                          </span>
                          <Rate
                            value={provider.rating}
                            disabled
                            className="text-sm ml-2"
                          />
                          <span className="ml-2 text-sm text-gray-500">
                            ({provider.reviewCount})
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${provider.startingPrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          starting price
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <AiOutlineLike className="w-4 h-4 mr-1" />
                        {provider.hiresCount} hire
                        {provider.hiresCount > 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        Serves {provider.location}
                      </div>
                      <div className="flex items-center">
                        <AiOutlineClockCircle className="w-4 h-4 mr-1" />
                        Responds in about {provider.responseTime}
                      </div>
                    </div>

                    <p className="mt-3 text-gray-600 line-clamp-2">
                      {provider.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        ...See more
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
