"use client";
import { useState } from "react";
import apiRoutes from "../../config/apiRoutes";

interface Errors {
  email?: string;
}

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, SetIsSending] = useState(false);

  const validateField = (name: string, value: string) => {
    const newErrors: Errors = {};

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, value);
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateField("email", formData.email);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setTouched({ email: true });
      return;
    }

    try {
      SetIsSending(true);
      const response = await fetch(apiRoutes.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          clientUri: "http://localhost:3000/reset-password",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setErrors({ email: errorData.message || "An error occurred" });
      }
    } catch (error) {
      setErrors({ email: "An error occurred. Please try again later." });
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg p-6">
        {!isSubmitted ? (
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold text-center mb-4">
              Reset your password
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none transition-colors"
              >
                {isSending ? "Sending..." : "Send"}
              </button>

              <div className="text-sm text-center text-gray-600">
                Remember your password?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Back to login
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              If an account exists for {formData.email}, you will receive
              password reset instructions.
            </p>
            <a href="/login" className="text-blue-500 hover:underline">
              Return to login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
