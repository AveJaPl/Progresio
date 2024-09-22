"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  useEffect(() => {
    setLoading(true);
    fetch("/api/me", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        console.log("Response from /api/me:", res);
        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching /api/me:", error);
        setAuthenticated(false);
        setLoading(false);
      });
  }, []); // Prawidłowe zamknięcie useEffect

  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    setAuthenticated(false);
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);