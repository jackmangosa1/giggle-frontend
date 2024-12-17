"use client";
import React, { useState } from "react";
import { Carousel } from "antd";
import { MdVerified, MdSearch } from "react-icons/md";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Barber from "../assets/barber.jpg";
import CarRepair from "../assets/carRepair.jpg";
import Massage from "../assets/massage.jpg";
import Cleaning from "../assets/cleaning.jpg";
import Electrician from "../assets/electrician.jpg";
import DressMaker from "../assets/dressMaker.jpg";
import ShowMaker from "../assets/shoeMaker.jpg";
import Painter from "../assets/painter.jpg";
import Plumber from "../assets/plumber.jpg";
import { useRouter } from "next/navigation";

interface CarouselItem {
  id: number;
  image: StaticImageData;
}

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const carouselItems: CarouselItem[] = [
    { id: 1, image: CarRepair },
    { id: 2, image: Electrician },
    { id: 3, image: Plumber },
    { id: 4, image: Barber },
    { id: 5, image: Massage },
    { id: 6, image: Cleaning },
    { id: 7, image: DressMaker },
    { id: 8, image: ShowMaker },
    { id: 9, image: Painter },
  ];

  const stats = [
    { title: "Verified Pros", value: "10,000+" },
    { title: "5-Star Reviews", value: "50,000+" },
    { title: "Services Daily", value: "1,000+" },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search-result?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000_0,#0000_49.9%,#00000008_50%,#0000_100%)_0_0/20px_20px]" />
      </div>

      <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-8 lg:py-20">
        <div className="flex flex-col-reverse gap-12 md:flex-row">
          <div className="flex flex-col space-y-8 md:w-1/2">
            <div className="group flex items-center px-3 py-1.5 space-x-2 text-sm bg-blue-50/80 hover:bg-blue-50 rounded-full w-fit transition-all duration-300 border border-blue-100/50">
              <MdVerified className="flex items-center justify-center w-5 h-5 text-blue-500 rounded-full transform group-hover:scale-110 transition-transform duration-300" />
              <span className="text-blue-800 font-medium">
                Trusted by 2M+ customers
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
                Book Expert Services,
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Right from Your Phone
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with verified professionals. Book, chat, pay and enjoy
                hassle-free service delivery at your doorstep.
              </p>
            </div>

            <div className="relative group">
              <div
                className={`absolute inset-0 bg-blue-100 rounded-lg opacity-0 transition-opacity duration-300 -z-10 ${
                  isInputFocused ? "opacity-50" : "group-hover:opacity-30"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onKeyDown={handleKeyPress}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="What service do you need?"
                className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-2 px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <MdSearch className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 text-center transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-100 cursor-pointer"
                >
                  <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-600">
                    {stat.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative max-w-xl mx-auto">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl" />

              <Carousel
                autoplay
                effect="fade"
                dots={false}
                className="w-full overflow-hidden"
              >
                {carouselItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-[400px] flex items-center justify-center"
                  >
                    <div className="relative h-full w-11/12 transform hover:scale-105 transition-all duration-500 group">
                      <Image
                        src={item.image}
                        alt="service image"
                        className="object-cover w-full h-full rounded-[20%] shadow-lg group-hover:shadow-xl transition-shadow duration-500"
                        layout="fill"
                        priority
                        quality={90}
                      />
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-[20%] group-hover:border-blue-500/30 transform rotate-3 transition-colors duration-500" />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
