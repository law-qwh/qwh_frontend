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
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "english";
  });

  const isRTL = language === "arabic";

  useEffect(() => {
    // Update HTML attributes for RTL/LTR
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", isRTL ? "ar" : "en");

    // Update body class for font
    if (isRTL) {
      document.body.classList.add("arabic");
      document.body.classList.remove("english");
    } else {
      document.body.classList.add("english");
      document.body.classList.remove("arabic");
    }

    // Save to localStorage
    localStorage.setItem("language", language);
  }, [language, isRTL]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "arabic" : "english"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
