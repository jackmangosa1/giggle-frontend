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
    <header className="relative z-20">
      {/* Header Container */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="text-lg font-semibold text-gray-800">
          <Link href="/" className="flex items-center space-x-1 group">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-2xl font-bold italic tracking-wide">
              G
            </span>
            <span className="font-extrabold">iggle</span>
            <span className="text-xs align-super">®</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-6">
          <button
            type="button"
            className="px-5 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors duration-200 shadow-md"
          >
            Join as a Pro
          </button>
          <Link
            href="/signup"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            Log in
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="sm:hidden p-2 text-gray-700 rounded-md focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <IoClose className="text-2xl transition-transform duration-200" />
          ) : (
            <RiMenu3Fill className="text-2xl transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="sm:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-10">
          <div className="flex flex-col p-6 space-y-4">
            <button
              type="button"
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md font-semibold text-sm hover:bg-indigo-600 transition-colors duration-200"
            >
              Join as a Pro
            </button>
            <Link
              href="/signup"
              className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
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
