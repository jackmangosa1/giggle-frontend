"use client";
import React, { useState } from "react";
import Link from "next/link";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="text-lg font-semibold text-gray-800">
          <Link
            href="/"
            className="flex items-center space-x-1 hover:scale-105 transition-transform duration-300"
          >
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-2xl font-bold italic tracking-wide">
              G
            </span>
            <span className="font-extrabold">iggle</span>
            <span className="text-xs align-super">®</span>
          </Link>
        </div>

        <button
          type="button"
          className="sm:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <IoClose className="text-2xl" />
          ) : (
            <RiMenu3Fill className="text-2xl" />
          )}
        </button>

        <nav className="hidden sm:flex items-center space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold text-sm"
          >
            Join as a Pro
          </button>
          <Link href="/signup" className="text-gray-700 hover:text-gray-900">
            Sign up
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-gray-900">
            Log in
          </Link>
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="sm:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-10">
          <div className="flex flex-col p-4 space-y-4">
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold text-sm"
            >
              Join as a Pro
            </button>
            <Link
              href="/signup"
              className="text-gray-700 hover:text-gray-900 px-4 py-2"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 px-4 py-2"
            >
              Log in
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
