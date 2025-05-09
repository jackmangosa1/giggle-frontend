"use client";
import apiRoutes from "@/app/config/apiRoutes";
import { message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    const newErrors: Errors = {};

    switch (name) {
      case "username":
        if (value.length < 3) {
          newErrors.username = "Username must be at least 3 characters long";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;

      case "password":
        if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        } else if (value.length > 72) {
          newErrors.password = "Password must not exceed 72 characters";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
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
      setErrors((prev) => {
        const updatedErrors = { ...prev, ...fieldErrors };
        if (!fieldErrors[name as keyof Errors]) {
          delete updatedErrors[name as keyof Errors];
        }
        return updatedErrors;
      });
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

    let formErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      const fieldErrors = validateField(
        key,
        formData[key as keyof typeof formData]
      );
      formErrors = { ...formErrors, ...fieldErrors };
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    try {
      setLoading(true);
      message.loading({ content: "Creating account...", key: "signup" });

      const response = await fetch(apiRoutes.signupProvider, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data === "string"
            ? data
            : data?.error || "Email already in use or failed to sign up";

        setErrors({ email: errorMessage });
        setTouched((prev) => ({ ...prev, email: true }));
      } else {
        message.success({
          content: "Account created successfully! Please log in.",
          key: "signup",
        });
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        router.push("/login");
      }
    } catch (error) {
      setErrors({ email: "An unexpected error occurred" });
      message.error({ content: "An unexpected error occurred", key: "signup" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username && touched.username
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.username && touched.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
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

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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
                errors.password && touched.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
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
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            By clicking Create Account, you agree to the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none  transition-colors"
          >
            Create Account
          </button>
          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
