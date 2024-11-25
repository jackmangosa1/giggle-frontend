"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username") || sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    setUsername(null);
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
              <span className="text-gray-700 font-medium">
                Hello, {username}
              </span>
              <button
                type="button"
                className="px-5 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors duration-200 shadow-md"
                onClick={handleLogout}
              >
                Log out
              </button>
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
                <span className="text-gray-700 font-medium">
                  Hello, {username}
                </span>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors duration-200"
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
