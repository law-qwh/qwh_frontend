// src/dashboard/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect } from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { language, isRTL } = useLanguage();
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuGroups = [
    {
      title: language === "arabic" ? "الرئيسية" : "Main",
      icon: "📋",
      items: [
        {
          path: "/dashboard",
          name: language === "arabic" ? "لوحة التحكم" : "Dashboard",
          icon: "📊",
        },
      ],
    },
    {
      title: language === "arabic" ? "إدارة المحتوى" : "Content Management",
      icon: "✏️",
      items: [
        {
          path: "/dashboard/hero",
          name: language === "arabic" ? "القسم الرئيسي" : "Main Section",
          icon: "🎨",
        },
        {
          path: "/dashboard/services",
          name: language === "arabic" ? "الخدمات القانونية" : "Legal Services",
          icon: "⚖️",
        },
        // {
        //   path: "/dashboard/featured-services",
        //   name: language === "arabic" ? "الخدمات المميزة" : "Featured Services",
        //   icon: "⭐",
        // },
        {
          path: "/dashboard/stats",
          name: language === "arabic" ? "الأرقام المؤثرة" : "Impact Numbers",
          icon: "📈",
        },
        {
          path: "/dashboard/about",
          name: language === "arabic" ? "صفحة من نحن" : "About Page",
          icon: "📄",
        },
        {
          path: "/dashboard/team",
          name: language === "arabic" ? "إدارة الفريق" : "Team Management",
          icon: "👥",
        },
      ],
    },
    {
      title: language === "arabic" ? "التواصل" : "Communication",
      icon: "💬",
      items: [
        {
          path: "/dashboard/contact",
          name: language === "arabic" ? "رسائل الاتصال" : "Contact Messages",
          icon: "✉️",
        },
      ],
    },
    {
      title: language === "arabic" ? "الإعدادات" : "Settings",
      icon: "⚙️",
      items: [
        {
          path: "/dashboard/settings",
          name: language === "arabic" ? "الإعدادات" : "Settings",
          icon: "⚙️",
        },
      ],
    },
  ];

  const toggleGroup = (groupTitle) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <div
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <img
              src="/src/assets/logo.svg"
              alt="QWH Legal"
              className="h-6 w-6"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.parentElement) {
                  e.target.parentElement.innerHTML = "⚖️";
                }
              }}
            />
          </div>
          <span className="text-xl font-bold text-white">
            QWH{" "}
            <span className="text-lawyer-accent">
              {language === "arabic" ? "قوة" : "Legal"}
            </span>
          </span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 hide-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <button
              onClick={() => toggleGroup(group.title)}
              className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white"
            >
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className="text-sm">{group.icon}</span>
                <span>{group.title}</span>
              </div>
              <svg
                className={`h-4 w-4 transform transition-transform duration-200 ${!collapsedGroups[group.title] ? (isRTL ? "-rotate-90" : "rotate-90") : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isRTL ? "M9 5l7 7-7 7" : "M5 9l7 7 7-7"}
                />
              </svg>
            </button>
            <div
              className={`space-y-1 overflow-hidden transition-all duration-300 ${collapsedGroups[group.title] ? "max-h-0" : "max-h-96"}`}
            >
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-all duration-200 ${isActive ? "bg-lawyer-accent shadow-md" : "hover:bg-white/10"} ${isRTL ? "flex-row-reverse" : ""}`
                  }
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {item.name}
                  </span>
                  {/* {item.path === "/dashboard/contact" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs">
                      3
                    </span>
                  )} */}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="text-center text-xs text-white/50">
          <p>© 2024 QWH Legal</p>
          <p className="mt-1">
            {language === "arabic"
              ? "جميع الحقوق محفوظة"
              : "All Rights Reserved"}
          </p>
        </div>
      </div>
    </>
  );

  // DESKTOP: Sidebar always visible on the correct side
  if (!isMobile) {
    return (
      <aside
        style={{
          position: "fixed",
          top: 0,
          [isRTL ? "right" : "left"]: 0,
          height: "100%",
          width: "16rem",
          zIndex: 30,
        }}
        className="bg-gradient-to-b from-lawyer-primary to-lawyer-secondary shadow-xl"
      >
        <SidebarContent />
      </aside>
    );
  }

  // MOBILE: Sidebar slides in/out from the correct side
  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      <aside
        className={`fixed top-0 h-full w-64 bg-gradient-to-b from-lawyer-primary to-lawyer-secondary shadow-xl transition-transform duration-300 ease-in-out z-30 ${isRTL ? "right-0" : "left-0"} ${sidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
