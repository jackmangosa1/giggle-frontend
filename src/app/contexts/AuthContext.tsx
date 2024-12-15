"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/provider/signup",
    "/reset-password",
    "/forgot-password",
    "/search-result",
    "/profile",
  ];

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
      if (pathname === "/login") {
        router.push("/");
      }
    } else {
      setIsAuthenticated(false);
      if (!publicRoutes.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [router, pathname]);

  const logout = () => {
    setIsAuthenticated(false);

    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;

    storage.removeItem("token");
    storage.removeItem("userId");
    storage.removeItem("username");

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
