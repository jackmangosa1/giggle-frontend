"use client";
import React, { useState } from "react";
import { Select, Slider, Rate } from "antd";
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";

interface ServiceProvider {
  id: string;
  name: string;
  logo: string;
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

const Page: React.FC = () => {
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search summary */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Cleaning Services in New York
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                84 service providers available
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
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
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

              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Minimum Rating
                </h3>
                <Rate value={minRating} onChange={setMinRating} />
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Availability</h3>
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

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-4">
            {/* Service Provider Card */}
            {[1, 2, 3].map((provider) => (
              <div
                key={provider}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                        <img
                          src={`/api/placeholder/96/96`}
                          alt="Service provider logo"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Simply Tidy Cleaning Service
                          </h2>
                          <div className="mt-1 flex items-center">
                            <span className="text-sm font-medium text-green-600">
                              Excellent 4.9
                            </span>
                            <Rate
                              value={4.9}
                              disabled
                              className="text-sm ml-2"
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              (8)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            $180
                          </div>
                          <div className="text-sm text-gray-500">
                            starting price
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <AiOutlineLike className="w-4 h-4 mr-1" />1 hire on
                          platform
                        </div>
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          Serves New York, NY
                        </div>
                        <div className="flex items-center">
                          <AiOutlineClockCircle className="w-4 h-4 mr-1" />
                          Responds in about 19 min
                        </div>
                      </div>

                      <p className="mt-3 text-gray-600 line-clamp-2">
                        We offer the best services at affordable price and we
                        have been in business for over 10 years and we have well
                        trained and professional staff.
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
