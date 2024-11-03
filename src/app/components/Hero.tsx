"use client";
import React, { useState } from "react";
import { Carousel } from "antd";
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
import type { StaticImageData } from "next/image";
import { MdVerified } from "react-icons/md";

interface CarouselItem {
  id: number;
  image: StaticImageData;
}

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
      </div>

      <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-8 lg:py-20">
        <div className="flex flex-col-reverse gap-12 md:flex-row">
          {/* Left Column - Text Content */}
          <div className="flex flex-col space-y-8 md:w-1/2">
            <div className="flex items-center px-3 py-1 space-x-2 text-sm bg-blue-50 rounded-full w-fit">
              <MdVerified className="flex items-center justify-center w-5 h-5  text-blue-500 rounded-full" />
              <span className="text-blue-800">Trusted by 2M+ customers</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
              Book Expert Services,
              <span className="block mt-2 text-blue-600">
                Right from Your Phone
              </span>
            </h1>

            <p className="text-lg text-gray-600">
              Connect with verified professionals. Book, chat, pay and enjoy
              hassle-free service delivery at your doorstep.
            </p>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need?"
                className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { title: "Verified Pros", value: "10,000+" },
                { title: "5-Star Reviews", value: "50,000+" },
                { title: "Services Daily", value: "1,000+" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Carousel */}
          <div className="w-full md:w-1/2">
            <div className="relative max-w-xl mx-auto">
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
                    <div className="relative h-full w-11/12 transform hover:scale-105 transition-transform duration-500">
                      <Image
                        src={item.image}
                        alt="service image"
                        className="object-cover w-full h-full rounded-[20%] shadow-lg hover:shadow-2xl"
                        layout="fill"
                        priority
                        quality={90}
                      />
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-[20%] opacity-20 transform rotate-3"></div>
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
