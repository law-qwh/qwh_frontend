// src/dashboard/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

const Header = ({ setSidebarOpen }) => {
  const { logout, user } = useAuth();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/dashboard/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Desktop header position - starts after sidebar (left for LTR, right for RTL)
  if (!isMobile) {
    return (
      <header
        className={`fixed top-0 z-20 bg-white shadow-md ${isRTL ? "right-64 left-0" : "left-64 right-0"}`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-800">
            {language === "arabic" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span>{language === "arabic" ? "English" : "العربية"}</span>
            </button>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`hidden sm:block ${isRTL ? "text-left" : "text-right"}`}
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lawyer-primary text-white">
                  <span className="text-sm font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </span>
                </div>
              </button>
              {isProfileOpen && (
                <div
                  className={`absolute mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ${isRTL ? "left-0" : "right-0"}`}
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "admin@qwhlegal.com"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${isRTL ? "flex-row-reverse justify-end" : ""}`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {language === "arabic" ? "تسجيل الخروج" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Mobile header
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
          >
            {language === "arabic" ? "English" : "العربية"}
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-lawyer-primary text-white"
            >
              <span className="text-sm font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </span>
            </button>
            {isProfileOpen && (
              <div
                className={`absolute mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ${isRTL ? "left-0" : "right-0"}`}
              >
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "admin@qwhlegal.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
