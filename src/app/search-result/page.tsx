"use client";
import React, { useState, useEffect } from "react";
import { Select, Slider, Rate } from "antd";
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiMapPin, FiChevronLeft } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import apiRoutes from "../config/apiRoutes";

// Define the Provider interface to match the ProviderDto with additional hardcoded fields
interface Provider {
  providerId: number;
  displayName: string;
  profilePictureUrl?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  location: string;
  responseTime: string;
  startingPrice: number;
  hiresCount: number;
}

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtering and sorting states
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(4);

  // Fetch providers based on search query
  useEffect(() => {
    const fetchProviders = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${apiRoutes.getProviders}?searchTerm=${encodeURIComponent(
            searchQuery
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add any necessary authentication headers
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const data: any[] = await response.json();

        // Map API data to Provider interface with hardcoded additional fields
        const mappedProviders: Provider[] = data.map((provider, index) => ({
          ...provider,
          rating: Math.min(5, Math.max(4.5, 4.7 + Math.random() * 0.3)), // Randomize rating between 4.5-5
          reviewCount: Math.floor(Math.random() * 20) + 5, // Random review count between 5-25
          location: `New York, NY`, // Hardcoded location
          responseTime: `${Math.floor(Math.random() * 30) + 15} min`, // Random response time between 15-45 min
          startingPrice: Math.floor(Math.random() * 150) + 100, // Random starting price between 100-250
          hiresCount: Math.floor(Math.random() * 10) + 1, // Random hires count between 1-10
          profilePictureUrl: provider.profilePictureUrl || undefined,
        }));

        setProviders(mappedProviders);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [searchQuery]);

  // Filtering and sorting logic
  const filteredProviders = providers
    .filter(
      (provider) =>
        // Price range filter
        provider.startingPrice >= priceRange[0] &&
        provider.startingPrice <= priceRange[1] &&
        // Rating filter
        provider.rating >= minRating
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.startingPrice - b.startingPrice;
        case "price_high":
          return b.startingPrice - a.startingPrice;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex justify-center gap-5">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow transition-shadow"
              >
                <FiChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredProviders.length} service providers found
                </p>
              </div>
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
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center text-gray-500">
            No service providers found for "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
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
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Online Now</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">
                        Available Today
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Provider Cards */}
            <div className="lg:col-span-3 space-y-4">
              {filteredProviders.map((provider) => (
                <div
                  onClick={() =>
                    router.push(`provider/profile/${provider.providerId}`)
                  }
                  key={provider.providerId}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 md:p-6 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 relative overflow-hidden">
                        <Image
                          src={
                            provider.profilePictureUrl || "/default-profile.png"
                          }
                          alt={`${provider.displayName} logo`}
                          className="object-cover"
                          fill
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-md md:text-lg font-semibold text-gray-900">
                            {provider.displayName}
                          </h2>
                          <div className="mt-1 flex items-center">
                            <span className="text-sm font-medium text-green-600">
                              Excellent {provider.rating.toFixed(1)}
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
                        {provider.bio}
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
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
