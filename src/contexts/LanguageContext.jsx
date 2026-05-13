// src/contexts/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Change default from "english" to "arabic"
  const [language, setLanguage] = useState(() => {
    const defaultLang = localStorage.getItem("language") || "arabic"; // Changed to "arabic"
    return defaultLang;
  });

  const isRTL = language === "arabic";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language === "arabic" ? "ar" : "en";
  }, [language, isRTL]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "arabic" : "english"));
  };

  const value = {
    language,
    isRTL,
    toggleLanguage,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
