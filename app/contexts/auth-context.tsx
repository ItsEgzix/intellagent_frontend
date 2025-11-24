"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getProfile,
  login as loginAPI,
  logout as logoutAPI,
  type User,
} from "@/util/api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const userData = await getProfile(tokenToVerify);
      setUser(userData);
      setToken(tokenToVerify);
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { access_token, user: userData } = await loginAPI({
        email,
        password,
      });

      // Store token and user
      localStorage.setItem("admin_token", access_token);
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Call logout endpoint
        await logoutAPI(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem("admin_token");
    if (!currentToken) return;

    try {
      const userData = await getProfile(currentToken);
      setUser(userData);
      localStorage.setItem("admin_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshUser,
        isLoading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
