// src/pages/Services.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import api from "../services/api";
import { getImageUrl } from "../utils/imageHelper";
import { apiService } from "../services/api";
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
  Award,
  Target,
  Eye,
  CheckCircle,
  TrendingUp,
  Rocket,
  Zap,
  Calendar,
  Trophy,
  Star,
} from "lucide-react";

const Services = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroData, setHeroData] = useState(null);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/services");

      if (response.data.success && response.data.data) {
        const allServices = response.data.data;
        const activeServices = allServices.filter(
          (service) => service.is_active === 1 || service.is_active === true,
        );
        setServices(activeServices);

        const featured = activeServices.filter(
          (service) =>
            service.is_featured === 1 || service.is_featured === true,
        );
        setFeaturedServices(featured);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroData = async () => {
    try {
      const response = await apiService.getHeroSlide();
      if (response.data.success && response.data.data) {
        setHeroData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
    }
  };

  useEffect(() => {
    fetchHeroData();
    fetchServices();
  }, []);

  const getTitle = (service) => {
    return language === "english"
      ? service.title_english
      : service.title_arabic;
  };

  const getDescription = (service) => {
    return language === "english"
      ? service.description_english
      : service.description_arabic;
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Featured icons for the main services (scale, building, file-text)
  const featuredIcons = [Scale, Building, FileText];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lawyer-accent mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "english"
              ? "Loading services..."
              : "جاري تحميل الخدمات..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl mb-4">
            {language === "english"
              ? "Error loading services"
              : "خطأ في تحميل الخدمات"}
          </p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-lawyer-accent text-white px-6 py-2 rounded-lg hover:bg-lawyer-gold"
          >
            {language === "english" ? "Try Again" : "حاول مرة أخرى"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-lawyer-primary to-lawyer-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${background_Image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        ></motion.div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {language === "english"
                ? "Our Legal Services"
                : "خدماتنا القانونية"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-200 max-w-3xl"
            >
              {language === "english"
                ? "Comprehensive legal solutions tailored to your needs"
                : "حلول قانونية شاملة مصممة خصيصاً لاحتياجاتك"}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Services Detailed */}
      {featuredServices.length > 0 && (
        <section className="py-20 bg-white" ref={ref}>
          <div className="container-custom">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {featuredServices.map((service, index) => {
                const FeaturedIcon =
                  featuredIcons[index % featuredIcons.length];
                return (
                  <motion.div
                    key={service.id}
                    variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={`mb-16 ${index % 2 === 1 ? "bg-gradient-to-r from-gray-50 to-white" : ""} rounded-2xl p-8 transition-all duration-500 hover:shadow-xl`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      <div className="lg:col-span-1">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-20 h-20 bg-lawyer-accent rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                        >
                          <FeaturedIcon className="w-10 h-10 text-white" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold text-lawyer-primary mb-4">
                          {getTitle(service)}
                        </h2>
                      </div>
                      <div className="lg:col-span-2">
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {getDescription(service)}
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to="/contact"
                            className="inline-block mt-6 bg-lawyer-accent hover:bg-lawyer-gold text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                          >
                            {language === "english"
                              ? "Request This Service"
                              : "اطلب هذه الخدمة"}
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section className="py-20 bg-gray-50" ref={servicesRef}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-lawyer-primary">
              {language === "english"
                ? "All Legal Services"
                : "جميع الخدمات القانونية"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === "english"
                ? "Comprehensive legal solutions tailored to your needs"
                : "حلول قانونية شاملة مصممة خصيصاً لاحتياجاتك"}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => {
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
                    {getTitle(service)}
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {getDescription(service).substring(0, 150)}
                    {getDescription(service).length > 150 && "..."}
                  </p>
                  <div className="h-1 w-0 bg-lawyer-accent group-hover:w-full transition-all duration-500"></div>
                </motion.div>
              );
            })}
          </motion.div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === "english"
                  ? "No services available at the moment."
                  : "لا توجد خدمات متاحة حالياً."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container-custom">
          <div className="bg-gradient-to-r from-lawyer-primary to-lawyer-secondary rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {language === "english" ? "Why Choose Us?" : "لماذا تختارنا؟"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title:
                    language === "english"
                      ? "Expertise & Experience"
                      : "الخبرة والكفاءة",
                  description:
                    language === "english"
                      ? "Over 20 years of combined legal experience"
                      : "أكثر من 20 عاماً من الخبرة القانونية المشتركة",
                  icon: Award,
                },
                {
                  title:
                    language === "english"
                      ? "Client-Centered Approach"
                      : "نهج يركز على العميل",
                  description:
                    language === "english"
                      ? "Personalized attention to every case"
                      : "اهتمام شخصي بكل قضية",
                  icon: Handshake,
                },
                {
                  title:
                    language === "english" ? "Proven Track Record" : "سجل حافل",
                  description:
                    language === "english"
                      ? "Successful resolution of thousands of cases"
                      : "حل ناجح لآلاف القضايا",
                  icon: Trophy,
                },
              ].map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm"
                  >
                    <div className="mb-4">
                      <ItemIcon className="w-12 h-12 text-lawyer-accent mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-200">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
