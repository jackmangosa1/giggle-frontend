"use client";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6 md:px-8">
      {/* Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Logo and About */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">
            Giggle<span className="text-xs align-super">®</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Connecting you with verified professionals for every need.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-medium text-gray-200">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/services/barber"
                  className="text-gray-400 hover:text-white"
                >
                  Barber
                </Link>
              </li>
              <li>
                <Link
                  href="/services/plumber"
                  className="text-gray-400 hover:text-white"
                >
                  Plumber
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrician"
                  className="text-gray-400 hover:text-white"
                >
                  Electrician
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cleaning"
                  className="text-gray-400 hover:text-white"
                >
                  Cleaning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-200">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-400 hover:text-white"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-200">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-medium text-gray-200">Follow Us</h3>
            <div className="flex justify-center mt-4 space-x-4 sm:justify-start">
              <Link
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebook size={24} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter size={24} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white"
              >
                <FaLinkedin size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="pt-8 text-sm text-center text-gray-500 border-t border-gray-700 sm:text-left">
          <p>© {new Date().getFullYear()} Giggle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
