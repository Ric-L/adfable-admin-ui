"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "@/lib/api";
import { logOut, selectIsAuthenticated, setCredentials } from "@/hooks/react-redux/features/authSlice";

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true); // Start with true for initial check

  // Check for existing authentication on mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        // Check if token exists in localStorage/sessionStorage
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

        if (token) {
          // If token exists, verify it and set credentials
          // You might want to add a token verification API call here
          const userData = localStorage.getItem("userData");
          const user = userData ? JSON.parse(userData) : null;

          if (user) {
            dispatch(
              setCredentials({
                user,
                token,
                sessionId: user.id || 0,
              })
            );
          }
        }
      } catch (error) {
        console.error("Error checking existing auth:", error);
        // Clear invalid auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, [dispatch]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await adminLogin({ username: username, password });

      if (!response.success || !response.result) {
        throw new Error("Login failed");
      }

      const result = response.result;
      const user = {
        id: result.id || 0,
        email: result.email || username,
        name: result.username || "Admin",
        role_id: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store in localStorage for persistence
      localStorage.setItem("authToken", result.token || "");
      localStorage.setItem("userData", JSON.stringify(user));

      dispatch(
        setCredentials({
          user,
          token: result.token || "",
          sessionId: result.id || 0,
        })
      );
    } catch (error) {
      // Clear storage on failed login
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear storage on logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("authToken");

    setLoading(false);
    dispatch(logOut());
  };

  return <AuthContext.Provider value={{ login, logout, isAuthenticated, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
