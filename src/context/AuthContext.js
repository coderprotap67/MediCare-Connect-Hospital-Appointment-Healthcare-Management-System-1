"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchJwtToken = async (email) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.post(`${baseUrl}/api/auth/jwt`, { email });
      if (res.data?.token) {
        localStorage.setItem("medicare_token", res.data.token);
      }
    } catch (err) {
      console.error("JWT Token generation error:", err);
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("medicare_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser?.email) {
        fetchJwtToken(parsedUser.email);
      }
    }
    setLoading(false);
  }, []);
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("medicare_user", JSON.stringify(userData));
    if (userData?.email) {
      fetchJwtToken(userData.email);
    }
  };
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("medicare_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("medicare_user");
    localStorage.removeItem("medicare_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, loginUser, logoutUser, loading }}
    >
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

export default AuthProvider;