// src/dashboard/pages/DashboardHome.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import { apiService } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)
      setGreeting(language === "arabic" ? "صباح الخير" : "Good Morning");
    else if (hour < 18)
      setGreeting(language === "arabic" ? "مساء الخير" : "Good Afternoon");
    else setGreeting(language === "arabic" ? "مساء الخير" : "Good Evening");

    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString(
          language === "arabic" ? "ar-SA" : "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          },
        ),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [language]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getDashboardStats();
      if (response.data.success) {
        setDashboardData(response.data.data);

        // Format stats for display
        const statsData = response.data.data.stats;
        const formattedStats = [
          {
            title: language === "arabic" ? "إجمالي الخدمات" : "Total Services",
            value: statsData.services.total.toString(),
            icon: (
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            ),
            change: 8.2,
            color: "lawyer-primary",
          },
          {
            title: language === "arabic" ? "أعضاء الفريق" : "Team Members",
            value: statsData.team_members.total.toString(),
            icon: (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ),
            change: 5.1,
            color: "blue",
          },
          {
            title: language === "arabic" ? "رسائل الاتصال" : "Contact Messages",
            value: statsData.contact_messages.total.toString(),
            icon: (
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            ),
            change:
              statsData.contact_messages.unread > 0
                ? -statsData.contact_messages.unread
                : 2.3,
            color: "purple",
          },
          {
            title: language === "arabic" ? "الشرائح النشطة" : "Active Slides",
            value: statsData.hero_slides.active.toString(),
            icon: (
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ),
            change: 15.3,
            color: "green",
          },
        ];
        setStats(formattedStats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = dashboardData?.quick_actions || [
    {
      name: language === "arabic" ? "تعديل القسم الرئيسي" : "Edit Main Section",
      icon: "🎨",
      path: "/dashboard/hero",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: language === "arabic" ? "إضافة خدمة جديدة" : "Add New Service",
      icon: "➕",
      path: "/dashboard/services",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: language === "arabic" ? "إضافة عضو فريق" : "Add Team Member",
      icon: "👤",
      path: "/dashboard/team",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: language === "arabic" ? "عرض الرسائل" : "View Messages",
      icon: "📧",
      path: "/dashboard/contact",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: language === "arabic" ? "تحديث الإحصائيات" : "Update Stats",
      icon: "📊",
      path: "/dashboard/stats",
      color: "from-orange-500 to-red-500",
    },
    {
      name: language === "arabic" ? "إدارة الإعدادات" : "Manage Settings",
      icon: "⚙️",
      path: "/dashboard/settings",
      color: "from-gray-600 to-gray-800",
    },
  ];

  const recentMessages = dashboardData?.recent_messages || [];
  const popularServices = dashboardData?.popular_services || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleMessageView = (message) => {
    navigate("/dashboard/contact");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lawyer-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === "arabic"
              ? "جاري تحميل لوحة التحكم..."
              : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-lawyer-primary to-lawyer-secondary p-6 md:p-8 text-white shadow-xl"
      >
        <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl md:text-4xl">
                {greeting === "Good Morning" ||
                  (greeting === "صباح الخير" && "🌅")}
                {greeting === "Good Afternoon" ||
                  (greeting === "مساء الخير" && "☀️")}
                {greeting === "Good Evening" && "🌙"}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold">{greeting}!</h1>
            </div>
            <p className="text-white/90 text-sm md:text-base mt-1">
              {language === "arabic"
                ? "مرحباً بعودتك إلى لوحة تحكم QWH Legal. إليك ما يحدث في موقعك اليوم."
                : "Welcome back to your QWH Legal Dashboard. Here's what's happening with your website today."}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2 text-center">
              <p className="text-xs text-white/80">
                {language === "arabic" ? "الوقت الحالي" : "Current Time"}
              </p>
              <p className="text-lg md:text-xl font-semibold">{currentTime}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              onClick={() => navigate(stat.path)}
              className="cursor-pointer"
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                color={stat.color}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {language === "arabic" ? "إجراءات سريعة" : "Quick Actions"}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {language === "arabic"
                ? "انقر على أي بطاقة للتنقل"
                : "Click any card to navigate"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-3xl md:text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {action.icon}
                </div>
                <p className="text-xs md:text-sm font-medium leading-tight">
                  {action.name}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout for Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Messages */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {language === "arabic"
                    ? "الرسائل الأخيرة"
                    : "Recent Messages"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {language === "arabic"
                    ? "أحدث الاستفسارات من العملاء"
                    : "Latest inquiries from clients"}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/contact")}
                className="text-sm text-lawyer-accent hover:text-lawyer-primary font-medium transition-colors"
              >
                {language === "arabic" ? "عرض الكل" : "View All"}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {recentMessages.length > 0 ? (
                recentMessages.slice(0, 4).map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 md:p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => handleMessageView(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!message.is_read && (
                            <div className="h-2 w-2 rounded-full bg-lawyer-accent animate-pulse"></div>
                          )}
                          <p className="text-sm font-semibold text-gray-900">
                            {message.name}
                          </p>
                          {!message.is_read && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                              {language === "arabic" ? "جديد" : "New"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {message.email}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {message.created_at}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {language === "arabic"
                      ? "لا توجد رسائل بعد"
                      : "No messages yet"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Popular Services */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {language === "arabic"
                    ? "الخدمات الشائعة"
                    : "Popular Services"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {language === "arabic"
                    ? "الخدمات الأكثر مشاهدة هذا الشهر"
                    : "Most viewed services this month"}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/services")}
                className="text-sm text-lawyer-accent hover:text-lawyer-primary font-medium transition-colors"
              >
                {language === "arabic" ? "إدارة الخدمات" : "Manage Services"}
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {popularServices.length > 0 ? (
                popularServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/dashboard/services")}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-lawyer-accent/10 flex items-center justify-center">
                        <span className="text-xl">⚖️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {language === "arabic"
                            ? service.title_arabic
                            : service.title_english}
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-lawyer-accent">
                          {service.views}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === "arabic" ? "مشاهدة" : "views"}
                        </p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {language === "arabic"
                      ? "لا توجد خدمات بعد"
                      : "No services yet"}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <p className="text-2xl font-bold text-blue-600">
                    {dashboardData?.stats?.contact_messages?.unread || 0}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === "arabic"
                      ? "رسائل غير مقروءة"
                      : "Unread Messages"}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData?.stats?.services?.active || 0}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === "arabic" ? "خدمات نشطة" : "Active Services"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Tips Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 md:p-6 shadow-lg border border-amber-200"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {language === "arabic" ? "نصيحة احترافية" : "Pro Tip"}
              </h3>
              <p className="text-gray-700 text-sm md:text-base mt-1">
                {language === "arabic"
                  ? "قم بتحديث قسم البطل الخاص بك بلافتة ترويجية جديدة لزيادة التفاعل بنسبة تصل إلى 40%!"
                  : "Update your hero section with the new promotional banner to increase engagement by up to 40%!"}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/hero")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-lawyer-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-lawyer-primary hover:scale-105 shadow-md whitespace-nowrap"
          >
            {language === "arabic" ? "تحديث قسم البطل" : "Update Hero Section"}
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;
