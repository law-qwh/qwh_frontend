// src/dashboard/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Palette,
  Scale,
  TrendingUp,
  FileText,
  Users,
  Mail,
  Settings,
  Home,
  Edit3,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
      icon: Home,
      items: [
        {
          path: "/dashboard",
          name: language === "arabic" ? "لوحة التحكم" : "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: language === "arabic" ? "إدارة المحتوى" : "Content Management",
      icon: Edit3,
      items: [
        {
          path: "/dashboard/hero",
          name: language === "arabic" ? "القسم الرئيسي" : "Main Section",
          icon: Palette,
        },
        {
          path: "/dashboard/services",
          name: language === "arabic" ? "الخدمات القانونية" : "Legal Services",
          icon: Scale,
        },
        {
          path: "/dashboard/stats",
          name: language === "arabic" ? "الأرقام المؤثرة" : "Impact Numbers",
          icon: TrendingUp,
        },
        {
          path: "/dashboard/about",
          name: language === "arabic" ? "صفحة من نحن" : "About Page",
          icon: FileText,
        },
        {
          path: "/dashboard/team",
          name: language === "arabic" ? "إدارة الفريق" : "Team Management",
          icon: Users,
        },
      ],
    },
    {
      title: language === "arabic" ? "التواصل" : "Communication",
      icon: MessageCircle,
      items: [
        {
          path: "/dashboard/contact",
          name: language === "arabic" ? "رسائل الاتصال" : "Contact Messages",
          icon: Mail,
        },
      ],
    },
    {
      title: language === "arabic" ? "الإعدادات" : "Settings",
      icon: Settings,
      items: [
        {
          path: "/dashboard/settings",
          name: language === "arabic" ? "الإعدادات" : "Settings",
          icon: Settings,
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
        {menuGroups.map((group) => {
          const GroupIcon = group.icon;
          const isCollapsed = collapsedGroups[group.title];

          return (
            <div key={group.title} className="mb-6">
              <button
                onClick={() => toggleGroup(group.title)}
                className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200"
              >
                <div
                  className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {/* FIX: Render the icon component directly, not inside span */}
                  <GroupIcon className="h-4 w-4" />
                  <span>{group.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isCollapsed ? "" : "rotate-90"
                    } ${isRTL ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              <div
                className={`space-y-1 overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "max-h-0" : "max-h-96"
                }`}
              >
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/dashboard"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-all duration-200 ${
                          isActive
                            ? "bg-lawyer-accent shadow-md"
                            : "hover:bg-white/10"
                        } ${isRTL ? "flex-row-reverse" : ""}`
                      }
                      onClick={() => {
                        if (isMobile) setSidebarOpen(false);
                      }}
                    >
                      {/* FIX: Render the icon component directly */}
                      <ItemIcon className="h-5 w-5" />
                      <span
                        className={`flex-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
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
        className={`fixed top-0 h-full w-64 bg-gradient-to-b from-lawyer-primary to-lawyer-secondary shadow-xl transition-transform duration-300 ease-in-out z-30 ${
          isRTL ? "right-0" : "left-0"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
