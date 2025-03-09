"use client";
import React, { useState, useEffect } from "react";
import { Select, Slider, Rate } from "antd";
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiMapPin, FiChevronLeft } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import apiRoutes from "../config/apiRoutes";

interface Provider {
  providerId: string;
  displayName: string;
  profilePictureUrl?: string;
  bio?: string;
  averageRating: number;
  averagePrice: number;
}

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});

  const [sortBy, setSortBy] = useState("price_low");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);

  const toggleBio = (providerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedBios((prev) => ({
      ...prev,
      [providerId]: !prev[providerId],
    }));
  };

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
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const data: Provider[] = await response.json();
        setProviders(data);
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

  const filteredProviders = providers
    .filter((provider) => {
      const meetsMinRating = provider.averageRating >= minRating;
      const meetsMaxPrice =
        provider.averagePrice >= priceRange[0] &&
        provider.averagePrice <= priceRange[1];
      return meetsMinRating && meetsMaxPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.averagePrice - b.averagePrice;
        case "price_high":
          return b.averagePrice - a.averagePrice;
        case "rating":
          return b.averageRating - a.averageRating;
        default:
          return a.averagePrice - b.averagePrice;
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
                    max={10000}
                    step={100}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value as number[])}
                    tooltip={{
                      formatter: (value) => `${value?.toLocaleString()}`,
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {priceRange[0].toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2 sm:mb-4">
                    Minimum Rating
                  </h3>
                  <Rate value={minRating} onChange={setMinRating} />
                </div>
              </div>
            </div>

            {/* Service Provider Cards */}
            <div className="lg:col-span-3 space-y-4">
              {filteredProviders.map((provider) => {
                const isBioLong = provider.bio && provider.bio.length > 100;
                const isExpanded = expandedBios[provider.providerId];

                return (
                  <div
                    key={provider.providerId}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 md:p-6 cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 relative overflow-hidden"
                          onClick={() =>
                            router.push(`customer/${provider.providerId}`)
                          }
                        >
                          <Image
                            src={
                              provider.profilePictureUrl ||
                              "/default-profile.png"
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
                            <h2
                              className="text-md md:text-lg font-semibold text-gray-900"
                              onClick={() =>
                                router.push(`customer/${provider.providerId}`)
                              }
                            >
                              {provider.displayName}
                            </h2>
                            <div className="mt-1 flex items-center">
                              <Rate
                                value={provider.averageRating}
                                disabled
                                className="text-sm"
                              />
                              <span className="ml-2 text-sm text-gray-500">
                                ({provider.averageRating})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {provider.averagePrice.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              average price
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <p
                            className={`mt-3 text-gray-600 ${
                              isExpanded ? "" : "line-clamp-2"
                            }`}
                          >
                            {provider.bio}
                          </p>

                          <div className="mt-4 flex items-center justify-end">
                            {isBioLong && (
                              <button
                                onClick={(e) =>
                                  toggleBio(provider.providerId, e)
                                }
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium absolute bottom-0 left-0"
                              >
                                {isExpanded ? "Show less" : "...See more"}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                router.push(`customer/${provider.providerId}`)
                              }
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
