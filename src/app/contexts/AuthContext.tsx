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

  // Define routes that do not require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/provider/signup",
    "/reset-password",
    "/forgot-password",
    "/search-result",
    "/profile",
  ]; // Add more public routes here

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
      if (pathname === "/login") {
        // Redirect logged-in users away from the login page
        router.push("/");
      }
    } else {
      setIsAuthenticated(false);
      if (!publicRoutes.includes(pathname)) {
        // Redirect unauthenticated users trying to access protected routes
        router.push("/login");
      }
    }
  }, [router, pathname]);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("userId");
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
