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

    // ✅ Add/remove class on body
    if (language === "arabic") {
      document.body.classList.add("arabic");
      document.body.classList.remove("english");
    } else {
      document.body.classList.add("english");
      document.body.classList.remove("arabic");
    }
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
  console.log(value);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
