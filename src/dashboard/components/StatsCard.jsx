// src/dashboard/components/StatsCard.jsx
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

const StatsCard = ({
  title,
  value,
  icon,
  change,
  color = "lawyer-primary",
}) => {
  const { language, isRTL } = useLanguage();

  const colorClasses = {
    "lawyer-primary": "from-lawyer-primary to-lawyer-secondary",
    "lawyer-accent": "from-lawyer-accent to-lawyer-gold",
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div
        className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
          {change && (
            <p
              className={`mt-2 text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}%{" "}
              {language === "arabic" ? "من الشهر الماضي" : "from last month"}
            </p>
          )}
        </div>
        <div
          className={`rounded-2xl bg-gradient-to-br ${colorClasses[color]} p-4 text-white shadow-lg transition-all duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-lawyer-accent to-lawyer-gold transition-all duration-300 group-hover:w-full"></div>
    </motion.div>
  );
};

export default StatsCard;
