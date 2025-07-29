// app/(auth-layout)/reset-password/ResetPasswordPage.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import apiRoutes from "../../config/apiRoutes";

interface Errors {
  password?: string;
  confirmPassword?: string;
}

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const validateField = (name: string, value: string) => {
    const newErrors: Errors = {};

    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "Password is required";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }
    }

    if (name === "confirmPassword") {
      if (!value.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
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

    const passwordErrors = validateField("password", formData.password);
    const confirmPasswordErrors = validateField("confirmPassword", formData.confirmPassword);

    const fieldErrors = {
      ...passwordErrors,
      ...confirmPasswordErrors,
    };

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setTouched({ password: true, confirmPassword: true });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(apiRoutes.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          email: email as string,
          token: token as string,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setErrors({
          password: errorData.message || "Error resetting password",
        });
      }
    } catch (error) {
      setErrors({ password: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg p-6">
        {!isSubmitted ? (
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold text-center mb-4">Reset your password</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password && touched.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none transition-colors"
              >
                {loading ? "Sending..." : "Send"}
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
            <a href="/login" className="text-blue-500 hover:underline">
              Return to login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
