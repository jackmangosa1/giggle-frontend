"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUser, FaEnvelope, FaBell, FaHome } from "react-icons/fa";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username") || sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    setUsername(null);
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="relative z-20">
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-lg font-semibold text-gray-800">
          <Link href="/" className="flex items-center space-x-1 group">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-2xl font-bold italic tracking-wide">
              G
            </span>
            <span className="font-extrabold">iggle</span>
            <span className="text-xs align-super">®</span>
          </Link>
        </div>

        <nav className="hidden sm:flex items-center space-x-6">
          {username ? (
            <>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Hello, {username}</span>
                  <IoMdArrowDropdown
                    className={`ml-1 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <Link
                      href={`/`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaHome className="mr-3 text-gray-500" />
                      Home
                    </Link>
                    <Link
                      href={`/customer/${userId}/profile`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="mr-3 text-gray-500" />
                      Profile
                    </Link>
                    <Link
                      href={`/customer/${userId}/messages`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaEnvelope className="mr-3 text-gray-500" />
                      Messages
                    </Link>
                    <Link
                      href={`/customer/${userId}/notifications`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaBell className="mr-3 text-gray-500" />
                      Notifications
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-5 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors duration-200 shadow-md"
                onClick={() => router.push("/provider/signup")}
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
            </>
          )}
        </nav>

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
            {username ? (
              <>
                <span className="text-gray-700 font-medium pb-1 border-b border-gray-200">
                  Hello, {username}
                </span>
                <Link
                  href={`/`}
                  className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="mr-3 text-gray-500" />
                  Home
                </Link>
                <Link
                  href={`/customer/${userId}/profile`}
                  className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-3 text-gray-500" />
                  Profile
                </Link>
                <Link
                  href={`/customer/${userId}/messages`}
                  className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaEnvelope className="mr-3 text-gray-500" />
                  Messages
                </Link>
                <Link
                  href={`/customer/${userId}/notifications`}
                  className="flex items-center text-gray-700 hover:text-gray-900 font-medium px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaBell className="mr-3 text-gray-500" />
                  Notifications
                </Link>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors duration-200 mt-2"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md font-semibold text-sm hover:bg-indigo-600 transition-colors duration-200"
                  onClick={() => router.push("/provider/signup")}
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
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
