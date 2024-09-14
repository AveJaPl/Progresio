"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
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
      })
      .catch((error) => {
        console.error("Error fetching /api/me:", error);
        setAuthenticated(false);
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
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
