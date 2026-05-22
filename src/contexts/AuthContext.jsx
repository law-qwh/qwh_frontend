// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api, { apiService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await apiService.getUser();
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // src/contexts/AuthContext.jsx

  const login = async (credentials, language = "english") => {
    try {
      // Make sure credentials has email and password fields
      const response = await api.post("/api/login", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error("Login error:", error.response?.data);
      // Define error messages based on language parameter
      const errorMessages = {
        english: "These credentials do not match our records.",
        arabic: "بيانات الاعتماد هذه لا تتطابق مع سجلاتنا.",
      };
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.errors ||
          errorMessages[language] ||
          errorMessages.english,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
