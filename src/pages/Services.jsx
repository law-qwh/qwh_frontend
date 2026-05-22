// src/pages/Services.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import api from "../services/api";
import { getImageUrl } from "../utils/imageHelper";
import { apiService } from "../services/api";

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

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Fetch all active services (only show active ones to public)
        const response = await api.get("/api/services");

        if (response.data.success && response.data.data) {
          const allServices = response.data.data;
          // Filter only active services for public view
          const activeServices = allServices.filter(
            (service) => service.is_active === 1 || service.is_active === true,
          );
          setServices(activeServices);

          // Filter featured and active services
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
        const response = await apiService.getHeroSlides();
        if (response.data.success && response.data.data) {
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchHeroData();
    fetchServices();
  }, []);

  // Helper function to get title based on language
  const getTitle = (service) => {
    return language === "english"
      ? service.title_english
      : service.title_arabic;
  };

  // Helper function to get description based on language
  const getDescription = (service) => {
    return language === "english"
      ? service.description_english
      : service.description_arabic;
  };

  // Helper function to get icon
  const getServiceIcon = (service) => {
    if (service.icon) {
      return service.icon;
    }
    return "⚖️";
  };

  // Get SVG icon based on index (for featured services)
  const getFeaturedIcon = (index) => {
    const icons = [
      // Legal Consultations icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />,
      // Legal Representation icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
      />,
      // Contract Drafting icon
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />,
    ];
    return icons[index % icons.length];
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
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">
            ⚠️{" "}
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
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-lawyer-primary to-lawyer-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: heroData
              ? `url(${getImageUrl(heroData.image_path, heroData.image_url)})`
              : "url('/src/assets/bg-image.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
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
              {featuredServices.map((service, index) => (
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
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {getFeaturedIcon(index)}
                        </svg>
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
              ))}
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
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-md transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className="text-5xl mb-4 inline-block"
                >
                  {getServiceIcon(service)}
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
            ))}
          </motion.div>

          {services.length === 0 && (
            <div className="text-center py-12">
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
                  icon: "🎓",
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
                  icon: "🤝",
                },
                {
                  title:
                    language === "english" ? "Proven Track Record" : "سجل حافل",
                  description:
                    language === "english"
                      ? "Successful resolution of thousands of cases"
                      : "حل ناجح لآلاف القضايا",
                  icon: "🏆",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-200">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
