import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { getImageUrl } from "../utils/imageHelper";
import background_Image from "../assets/bg-image.jpeg";
import {
  Scale,
  Building,
  FileText,
  Briefcase,
  Lock,
  Users,
  Home as HomeIcon,
  Lightbulb,
  DollarSign,
  Handshake,
  BarChart,
  Globe,
  Calendar,
  BadgeCheck,
  Target,
  Star,
  Trophy,
  TrendingUp,
  Award,
  Rocket,
  Zap,
} from "lucide-react";

// Get stats icon component
const getStatIconComponent = (iconName) => {
  const iconMap = {
    calendar: Calendar,
    users: Users,
    scale: Scale,
    "badge-check": BadgeCheck,
    target: Target,
    star: Star,
    trophy: Trophy,
    briefcase: Briefcase,
    globe: Globe,
    "bar-chart": BarChart,
    "trending-up": TrendingUp,
    lightbulb: Lightbulb,
    handshake: Handshake,
    award: Award,
    rocket: Rocket,
    zap: Zap,
  };
  const IconComponent = iconMap[iconName];
  return IconComponent || BarChart;
};

// Get service icon component
const getIconComponent = (iconName) => {
  const iconMap = {
    scale: Scale,
    building: Building,
    "file-text": FileText,
    briefcase: Briefcase,
    lock: Lock,
    users: Users,
    home: HomeIcon,
    lightbulb: Lightbulb,
    "dollar-sign": DollarSign,
    handshake: Handshake,
    "bar-chart": BarChart,
    globe: Globe,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent || Scale;
};

const Home = () => {
  const { language } = useLanguage();
  const [showCalculator, setShowCalculator] = useState(null); // 'service' or 'tax'

  // Tax Calculator State
  const [saleValue, setSaleValue] = useState("");
  const [vatRate, setVatRate] = useState("15");
  const [isInclusive, setIsInclusive] = useState(false);

  // End of Service Calculator State
  const [basicSalary, setBasicSalary] = useState("");
  const [yearsOfService, setYearsOfService] = useState("");
  const [contractType, setContractType] = useState("limited");

  // Data states
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredServicesData, setFeaturedServicesData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [mainServicesData, setMainServicesData] = useState([]);

  // Create refs for different sections
  const [mainServicesRef, mainServicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [calculatorRef, calculatorInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [additionalServicesRef, additionalServicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const statsVariant = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.2 },
    }),
  };

  // Tax Calculator Functions
  const calculateVAT = () => {
    const value = parseFloat(saleValue) || 0;
    const rate = parseFloat(vatRate) || 0;

    if (isInclusive) {
      const exclusiveVAT = value / (1 + rate / 100);
      const vatAmount = value - exclusiveVAT;
      return {
        saleValue: value,
        vatAmount: vatAmount,
        totalValue: value,
        exclusiveVAT: exclusiveVAT,
      };
    } else {
      const vatAmount = value * (rate / 100);
      return {
        saleValue: value,
        vatAmount: vatAmount,
        totalValue: value + vatAmount,
        exclusiveVAT: value,
      };
    }
  };

  // End of Service Calculator Functions - Saudi Labor Law Accurate
  const calculateEndOfService = () => {
    const salary = parseFloat(basicSalary) || 0;
    const years = parseFloat(yearsOfService) || 0;

    if (years < 1) return 0;

    let total = 0;

    if (contractType === "limited") {
      // Limited Contract (Fixed-term contract)
      if (years < 2) {
        // Less than 2 years: No EOS benefit
        total = 0;
      } else if (years < 5) {
        // 2 to 5 years: Half month salary per year
        total = (salary / 2) * years;
      } else {
        // 5+ years: Full month salary per year
        total = salary * years;
      }
    } else {
      // Unlimited Contract (Open-ended contract)
      if (years < 2) {
        // Less than 2 years: No EOS benefit for resignation
        total = 0;
      } else if (years < 5) {
        // 2 to 5 years: One-third of 21 days salary per year
        // Standard calculation: (21 days / 3) = 7 days salary per year
        const dailyRate = salary / 30;
        total = dailyRate * 7 * years;
      } else {
        // 5+ years: Full 21 days salary per year for first 5 years, then 30 days after
        const dailyRate = salary / 30;
        if (years <= 5) {
          total = dailyRate * 21 * years;
        } else {
          const first5Years = dailyRate * 21 * 5;
          const remainingYears = years - 5;
          const remainingAmount = dailyRate * 30 * remainingYears;
          total = first5Years + remainingAmount;
        }
      }
    }

    return total;
  };

  const taxResult = calculateVAT();
  const eosResult = calculateEndOfService();

  const handleModalCloseWithReset = () => {
    setShowCalculator(null);
    setSaleValue("");
    setVatRate("15");
    setIsInclusive(false);
    setBasicSalary("");
    setYearsOfService("");
    setContractType("limited");
  };

  // Fetch data from API
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await apiService.getHeroSlide();
        console.log(response.data.data.image_url);
        if (response.data.success && response.data.data) {
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiService.getServices();
        if (response.data.success && response.data.data) {
          const allServices = response.data.data;
          // Filter active services
          const activeServices = allServices.filter(
            (service) => service.is_active === 1 || service.is_active === true,
          );

          // Get featured services (is_featured = true) - limit to 6 for homepage
          const featured = activeServices
            .filter(
              (service) =>
                service.is_featured === 1 || service.is_featured === true,
            )
            .slice(0, 6);
          setFeaturedServicesData(featured);

          // Get main services (first 3 active services that are featured, or just first 3 active)
          const mainServices = activeServices.slice(0, 3);
          setMainServicesData(mainServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getActiveStats();
        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Get service title based on language
  const getServiceTitle = (service) => {
    return language === "english"
      ? service.title_english
      : service.title_arabic;
  };

  // Get service description based on language
  const getServiceDescription = (service) => {
    return language === "english"
      ? service.description_english
      : service.description_arabic;
  };

  // Get stat label based on language
  const getStatLabel = (stat) => {
    return language === "english" ? stat.label_english : stat.label_arabic;
  };

  return (
    <div className="pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-lawyer-primary to-lawyer-secondary text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: heroData
              ? `url(${getImageUrl(heroData.image_url)})`
              : `url(${background_Image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        ></motion.div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            {!heroData ? (
              <div className="space-y-4">
                <div className="h-16 bg-gray-300 rounded animate-pulse w-3/4"></div>
                <div className="h-10 bg-gray-300 rounded animate-pulse w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-full"></div>
              </div>
            ) : (
              <>
                <motion.h1
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={heroTextVariants}
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                >
                  {language === "english"
                    ? heroData.title_english
                    : heroData.title_arabic}
                </motion.h1>
                <motion.p
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={heroTextVariants}
                  className="text-2xl md:text-3xl mb-4 text-lawyer-accent font-semibold"
                >
                  {language === "english"
                    ? heroData.subtitle_english
                    : heroData.subtitle_arabic}
                </motion.p>
                <motion.p
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={heroTextVariants}
                  className="text-lg md:text-xl mb-10 text-gray-200"
                >
                  {language === "english"
                    ? heroData.description_english
                    : heroData.description_arabic}
                </motion.p>
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={heroTextVariants}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    to="/contact"
                    className="inline-block bg-lawyer-accent hover:bg-lawyer-gold text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    {language === "english" ? "Contact Us" : "اتصل بنا"}
                  </Link>
                  <Link
                    to="/services"
                    className="inline-block border-2 border-white hover:bg-white hover:text-lawyer-primary text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 text-center"
                  >
                    {language === "english" ? "Our Services" : "خدماتنا"}
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>
      {/* Main Services Section */}
      <section className="py-20 bg-white" ref={mainServicesRef}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mainServicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lawyer-primary">
              {language === "english"
                ? "Our Legal Services"
                : "خدماتنا القانونية"}
            </h2>
            <p className="text-gray-600 text-lg mt-4">
              {language === "english"
                ? "Comprehensive legal solutions tailored to your needs"
                : "حلول قانونية شاملة مصممة خصيصاً لاحتياجاتك"}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={mainServicesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {mainServicesData.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                >
                  <div className="h-2 bg-lawyer-accent group-hover:h-3 transition-all duration-300"></div>
                  <div className="p-8">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="w-16 h-16 bg-lawyer-accent rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:rounded-xl group-hover:scale-110"
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-lawyer-primary group-hover:text-lawyer-accent transition-colors duration-300">
                      {getServiceTitle(service)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {getServiceDescription(service).substring(0, 200)}...
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Calculator Cards Section */}
      <section
        className="py-20 bg-white/50 backdrop-blur-sm"
        ref={calculatorRef}
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={calculatorInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lawyer-primary">
              {language === "english" ? "Quick Calculators" : "حاسبات سريعة"}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {language === "english"
                ? "Get instant estimates for legal services and tax calculations"
                : "احصل على تقديرات فورية للخدمات القانونية وحسابات الضرائب"}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={calculatorInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              onClick={() => setShowCalculator("service")}
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer group border-2 border-transparent hover:border-lawyer-accent"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-lawyer-accent rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-lawyer-primary group-hover:text-lawyer-accent transition-colors duration-300">
                  {language === "english"
                    ? "End of Service Calculator"
                    : "حاسبة نهاية الخدمة"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "english"
                    ? "Calculate your end of service benefits based on Saudi Labor Law"
                    : "احسب مستحقات نهاية الخدمة وفقاً لنظام العمل السعودي"}
                </p>
                <div className="inline-flex items-center gap-2 text-lawyer-accent font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>
                    {language === "english" ? "Calculate Now" : "احسب الآن"}
                  </span>
                  <svg
                    className="w-5 h-5"
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
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setShowCalculator("tax")}
              className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer group border-2 border-transparent hover:border-lawyer-accent"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-lawyer-accent rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-lawyer-primary group-hover:text-lawyer-accent transition-colors duration-300">
                  {language === "english" ? "Tax Calculator" : "حاسبة الضرائب"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "english"
                    ? "Calculate VAT, Zakat, and other tax obligations"
                    : "احسب ضريبة القيمة المضافة والزكاة والالتزامات الضريبية الأخرى"}
                </p>
                <div className="inline-flex items-center gap-2 text-lawyer-accent font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>
                    {language === "english" ? "Calculate Now" : "احسب الآن"}
                  </span>
                  <svg
                    className="w-5 h-5"
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-gray-50" ref={additionalServicesRef}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={additionalServicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lawyer-primary">
              {language === "english"
                ? "Featured Legal Services"
                : "خدمات قانونية مميزة"}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {language === "english"
                ? "Discover our most requested legal services"
                : "اكتشف خدماتنا القانونية الأكثر طلباً"}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={additionalServicesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredServicesData.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-md transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="w-14 h-14 bg-lawyer-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-lawyer-accent transition-all duration-300"
                  >
                    <IconComponent className="w-7 h-7 text-lawyer-accent group-hover:text-white transition-all duration-300" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-lawyer-primary group-hover:text-lawyer-accent transition-colors duration-300">
                    {getServiceTitle(service)}
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {getServiceDescription(service).substring(0, 150)}
                    {getServiceDescription(service).length > 150 ? "..." : ""}
                  </p>
                  <div className="h-1 w-0 bg-lawyer-accent group-hover:w-full transition-all duration-500"></div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Rest of the featured services section remains the same */}
        </div>
      </section>

      {/* Statistics Section */}
      {/* Statistics Section */}
      <section className="py-20 bg-lawyer-primary text-white" ref={statsRef}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "english"
                ? "Our Impact in Numbers"
                : "تأثيرنا بالأرقام"}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {language === "english"
                ? "Measuring our commitment to excellence through results"
                : "قياس التزامنا بالتميز من خلال النتائج"}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {statsData.slice(0, 4).map((stat, index) => {
              const StatIcon = getStatIconComponent(stat.icon);
              return (
                <motion.div
                  key={stat.id}
                  variants={statsVariant}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm"
                >
                  <div className="mb-3">
                    <StatIcon className="w-12 h-12 text-lawyer-accent mx-auto" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-200 text-sm md:text-base">
                    {getStatLabel(stat)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-lawyer-accent to-lawyer-gold"
        ref={ctaRef}
      >
        <div className="container-custom text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {language === "english"
              ? "Need Legal Assistance?"
              : "هل تحتاج إلى مساعدة قانونية؟"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-lg mb-8 opacity-90 max-w-2xl mx-auto"
          >
            {language === "english"
              ? "Contact us today for a confidential consultation."
              : "اتصل بنا اليوم للحصول على استشارة سرية."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/contact"
              className="inline-block bg-white text-lawyer-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              {language === "english"
                ? "Schedule Consultation"
                : "احجز استشارة"}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Tax Calculator Modal - Keep as is */}
      {showCalculator === "tax" && (
        // ... your existing tax calculator modal code ...
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleModalCloseWithReset}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-2xl font-bold text-lawyer-primary">
                  {language === "english"
                    ? "VAT Calculator"
                    : "حاسبة ضريبة القيمة المضافة"}
                </h3>
                <button
                  onClick={handleModalCloseWithReset}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english" ? "Sale Value" : "قيمة البيع"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={saleValue}
                      onChange={(e) => setSaleValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent"
                      placeholder={
                        language === "english"
                          ? "Enter sale value"
                          : "أدخل قيمة البيع"
                      }
                    />
                    <span
                      className={`absolute ${language === "english" ? "right-4" : "left-12"} top-1/2 transform -translate-y-1/2 text-gray-500`}
                    >
                      SAR
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english"
                      ? "VAT Rate (%)"
                      : "نسبة الضريبة (%)"}
                  </label>
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent"
                    placeholder="Enter VAT rate"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    {language === "english"
                      ? "Is Sale Inclusive of VAT?"
                      : "هل السعر شامل الضريبة؟"}
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isInclusive}
                        onChange={() => setIsInclusive(false)}
                        className="w-4 h-4 text-lawyer-accent"
                      />
                      <span className="m-2">
                        {language === "english" ? "No" : "لا"}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isInclusive}
                        onChange={() => setIsInclusive(true)}
                        className="w-4 h-4 text-lawyer-accent"
                      />
                      <span className="m-2">
                        {language === "english" ? "Yes" : "نعم"}
                      </span>
                    </label>
                  </div>
                </div>
                {(saleValue || vatRate) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex justify-between py-2 border-b">
                      <span>
                        {language === "english" ? "Sale Value" : "قيمة البيع"}
                      </span>
                      <span className="font-semibold">
                        SAR {taxResult.saleValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>
                        {language === "english"
                          ? "Exclusive of VAT"
                          : "قبل الضريبة"}
                      </span>
                      <span>
                        SAR{" "}
                        {taxResult.exclusiveVAT.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>
                        {language === "english" ? "VAT Amount" : "قيمة الضريبة"}
                      </span>
                      <span className="font-semibold text-lawyer-accent">
                        SAR{" "}
                        {taxResult.vatAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="font-bold">
                        {language === "english"
                          ? "Total Value"
                          : "القيمة الإجمالية"}
                      </span>
                      <span className="font-bold text-lawyer-primary">
                        SAR{" "}
                        {taxResult.totalValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* End of Service Calculator Modal - Keep as is */}
      {showCalculator === "service" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleModalCloseWithReset}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-2xl font-bold text-lawyer-primary">
                  {language === "english"
                    ? "End of Service Calculator"
                    : "حاسبة نهاية الخدمة"}
                </h3>
                <button
                  onClick={handleModalCloseWithReset}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english" ? "Basic Salary" : "الراتب الأساسي"}
                  </label>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent"
                    placeholder={
                      language === "english"
                        ? "Enter basic salary"
                        : "أدخل الراتب الأساسي"
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english"
                      ? "Years of Service"
                      : "سنوات الخدمة"}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={yearsOfService}
                    onChange={(e) => setYearsOfService(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder={
                      language === "english"
                        ? "Enter years of service"
                        : "أدخل سنوات الخدمة"
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    {language === "english" ? "Contract Type" : "نوع العقد"}
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={contractType === "limited"}
                        onChange={() => setContractType("limited")}
                        className="w-4 h-4 text-lawyer-accent"
                      />
                      <span className="m-2">
                        {language === "english"
                          ? "Limited Contract"
                          : "عقد محدد المدة"}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={contractType === "unlimited"}
                        onChange={() => setContractType("unlimited")}
                        className="w-4 h-4 text-lawyer-accent"
                      />
                      <span className="m-2">
                        {language === "english"
                          ? "Unlimited Contract"
                          : "عقد غير محدد المدة"}
                      </span>
                    </label>
                  </div>
                </div>
                {basicSalary > 0 && yearsOfService > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex justify-between py-2 border-b">
                      <span>
                        {language === "english"
                          ? "Total Benefit"
                          : "إجمالي المكافأة"}
                      </span>
                      <span className="text-2xl font-bold text-lawyer-primary">
                        SAR{" "}
                        {eosResult.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 pt-3 border-t">
                      {language === "english"
                        ? "* This is an estimate based on Saudi Labor Law. Actual calculation may vary."
                        : "* هذا تقدير بناءً على نظام العمل السعودي. قد يختلف الحساب الفعلي."}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
