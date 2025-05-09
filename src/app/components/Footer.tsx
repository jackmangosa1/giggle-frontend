"use client";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-8">
      {/* Container */}
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Logo and About */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-semibold tracking-wide">
            Giggle<span className="text-xs align-super">®</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Connecting you with verified professionals for every need.
          </p>
        </div>

        {/* Links */}
        {/* 
        <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-center sm:grid-cols-4 md:text-left">
       
          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-3">Services</h3>
            <ul className="space-y-2 text-gray-400">
              {["Barber", "Plumber", "Electrician", "Cleaning"].map(
                (service, index) => (
                  <li key={index}>
                    <Link
                      href={`/services/${service.toLowerCase()}`}
                      className="hover:text-white transition duration-200"
                    >
                      {service}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

      
          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-3">Company</h3>
            <ul className="space-y-2 text-gray-400">
              {["About Us", "Careers", "Blog", "Contact Us"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      href={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                      className="hover:text-white transition duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-3">Support</h3>
            <ul className="space-y-2 text-gray-400">
              {["Help Center", "FAQ", "Terms of Service", "Privacy Policy"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      href={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                      className="hover:text-white transition duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

      
          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-3">
              Follow Us
            </h3>
            <div className="flex justify-center sm:justify-start space-x-6">
              {[
                {
                  icon: <FaFacebook size={20} />,
                  link: "https://facebook.com",
                },
                { icon: <FaTwitter size={20} />, link: "https://twitter.com" },
                {
                  icon: <FaInstagram size={20} />,
                  link: "https://instagram.com",
                },
                {
                  icon: <FaLinkedin size={20} />,
                  link: "https://linkedin.com",
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.link}
                  target="_blank"
                  aria-label="social"
                  className="text-gray-400 hover:text-white transition duration-200"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div> 
        
        */}

        {/* Bottom Note */}
        <div className="pt-8 text-center text-gray-500 border-t border-gray-700">
          <p>© {new Date().getFullYear()} Giggle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
