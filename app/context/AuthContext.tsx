"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { postData } from "../utils/sendRequest";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    const { status } = await postData("/api/me", {});
    setAuthenticated(status === 200);
    setLoading(false);
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    const { status } = await postData("/api/logout", {});
    setAuthenticated(status !== 200);
    if (status === 200) {
      Cookies.remove("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
