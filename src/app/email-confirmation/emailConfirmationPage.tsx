"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const EmailConfirmationPage = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const message = searchParams.get("message");
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div
            className={`text-6xl ${
              animate ? (success ? "animate-bounce" : "animate-shake") : ""
            }`}
          >
            {success ? (
              <FiCheckCircle className="text-green-500" />
            ) : (
              <FiXCircle className="text-red-500" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {success ? "Email Confirmed!" : "Confirmation Failed"}
        </h2>

        <p className="text-gray-600 mb-6">
          {success
            ? "Your email has been successfully verified. You can now access your account."
            : message ||
              "We couldn't verify your email address. Please try again or contact support."}
        </p>

        <div className="space-y-3">
          {success && (
            <>
              <Link href="/login" className="block">
                <Button
                  type="primary"
                  size="large"
                  block
                  className="bg-blue-600 hover:bg-blue-700 h-12"
                >
                  Log in to your account
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button type="link" block>
                  Return to homepage
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
