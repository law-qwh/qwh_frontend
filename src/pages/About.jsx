import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { apiService } from "../services/api";
import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageHelper";
import {
  Target,
  Eye,
  CheckCircle,
  BarChart,
  Users,
  Briefcase,
  Scale,
  Globe,
  Calendar,
  Trophy,
  Star,
  Award,
  Rocket,
  Zap,
  TrendingUp,
  Mail,
  Linkedin as LinkedinIcon, // Alias to avoid confusion
  AlertCircle,
  ArrowDown,
} from "lucide-react";

const About = () => {
  const { language } = useLanguage();

  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [valuesRef, valuesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [coreValues, setCoreValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroData, setHeroData] = useState(null);

  // Get stats icon component
  const getStatIconComponent = (iconName) => {
    const iconMap = {
      calendar: Calendar,
      users: Users,
      scale: Scale,
      star: Star,
      trophy: Trophy,
      briefcase: Briefcase,
      globe: Globe,
      "bar-chart": BarChart,
      "trending-up": TrendingUp,
      award: Award,
      rocket: Rocket,
      zap: Zap,
    };
    const IconComponent = iconMap[iconName];
    return IconComponent || BarChart;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const langCode = language === "english" ? "en" : "ar";
        const [
          teamResponse,
          statsResponse,
          aboutResponse,
          coreValuesResponse,
          heroResponse,
        ] = await Promise.all([
          apiService.getTeamMembers(),
          apiService.getActiveStats(),
          apiService.getAboutContent(langCode),
          apiService.getCoreValues(),
          apiService.getHeroSlide(),
        ]);
        if (teamResponse.data.success) {
          setTeamMembers(teamResponse.data.data);
        }

        if (statsResponse.data.success) {
          setStatsData(statsResponse.data.data);
        }

        if (aboutResponse.data.success) {
          setAboutContent(aboutResponse.data.data);
        }

        if (coreValuesResponse.data.success) {
          setCoreValues(coreValuesResponse.data.data);
        }

        if (heroResponse.data.success) {
          setHeroData(heroResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [language]);

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
        staggerChildren: 0.15,
      },
    },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const numberCount = {
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

  // Get stat label based on language
  const getStatLabel = (stat) => {
    return language === "english" ? stat.label_english : stat.label_arabic;
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lawyer-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-lawyer-accent text-white rounded-lg hover:bg-lawyer-gold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-lawyer-primary to-lawyer-secondary text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: heroData
              ? `url(${getImageUrl(heroData.image_path, heroData.image_url)})`
              : "url('/src/assets/bg-image.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        ></motion.div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {language === "english"
                ? aboutContent?.hero_title_english
                : aboutContent?.hero_title_arabic}
            </motion.h1>
            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
              className="text-xl md:text-2xl text-gray-200 leading-relaxed"
            >
              {language === "english"
                ? aboutContent?.hero_subtitle_english
                : aboutContent?.hero_subtitle_arabic}
            </motion.p>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white" ref={missionRef}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 bg-lawyer-accent rounded-2xl flex items-center justify-center mb-6"
              >
                <Target className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-lawyer-primary">
                {language === "english" ? "Our Mission" : "مهمتنا"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {language === "english"
                  ? aboutContent?.mission_english
                  : aboutContent?.mission_arabic}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 bg-lawyer-accent rounded-2xl flex items-center justify-center mb-6"
              >
                <Eye className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-lawyer-primary">
                {language === "english" ? "Our Vision" : "رؤيتنا"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {language === "english"
                  ? aboutContent?.vision_english
                  : aboutContent?.vision_arabic}
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 shadow-xl"
            ref={valuesRef}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-8 text-center text-lawyer-primary"
            >
              {language === "english" ? "Our Core Values" : "قيمنا الأساسية"}
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={valuesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {coreValues && coreValues.length > 0 ? (
                coreValues.map((value, index) => (
                  <motion.div
                    key={value.id}
                    variants={scaleUp}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-lawyer-accent/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-lawyer-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium text-lg">
                      {language === "english"
                        ? value.value_english
                        : value.value_arabic}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  {language === "english"
                    ? "No core values found"
                    : "لم يتم العثور على قيم أساسية"}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

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
            {statsData && statsData.length > 0 ? (
              statsData.slice(0, 4).map((stat, index) => {
                const StatIcon = getStatIconComponent(stat.icon);
                return (
                  <motion.div
                    key={stat.id}
                    variants={numberCount}
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
              })
            ) : (
              <div className="col-span-full text-center text-gray-300 py-12">
                No statistics available
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers && teamMembers.length > 0 ? (
        <section className="py-20 bg-gray-50" ref={teamRef}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-lawyer-primary">
                {language === "english"
                  ? "Meet Our Expert Team"
                  : "تعرف على فريقنا الخبير"}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {language === "english"
                  ? "Dedicated professionals committed to providing you with the best legal representation."
                  : "محترفون مخلصون ملتزمون بتقديم أفضل تمثيل قانوني لك."}
              </p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={teamInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id || index}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 group hover:shadow-2xl"
                >
                  <div className="h-80 overflow-hidden">
                    {member.image ? (
                      <motion.img
                        src={member.image}
                        alt={
                          language === "english"
                            ? member.name_en
                            : member.name_ar
                        }
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x400?text=Team+Member";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1 text-lawyer-primary group-hover:text-lawyer-accent transition-colors duration-300">
                      {language === "english" ? member.name_en : member.name_ar}
                    </h3>
                    <p className="text-lawyer-accent font-semibold mb-2">
                      {language === "english"
                        ? member.position_en
                        : member.position_ar}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {language === "english"
                        ? member.specialty_en
                        : member.specialty_ar}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-gray-500 text-sm">
                        {member.experience}{" "}
                        {language === "english"
                          ? "years experience"
                          : "سنوات خبرة"}
                      </span>
                      <div className="flex space-x-2">
                        {member.linkedin && (
                          <motion.a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-lawyer-accent group/link transition-all duration-300"
                          >
                            <LinkedinIcon className="w-4 h-4 text-gray-600 group-hover/link:text-white" />
                          </motion.a>
                        )}
                        {member.email && (
                          <motion.a
                            href={`mailto:${member.email}`}
                            whileHover={{ scale: 1.1 }}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-lawyer-accent group/link transition-all duration-300"
                          >
                            <Mail className="w-4 h-4 text-gray-600 group-hover/link:text-white" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : (
        <div></div>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-lawyer-accent to-lawyer-gold"
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
              ? "Ready to Work With Us?"
              : "هل أنت مستعد للعمل معنا؟"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-lg mb-8 opacity-90 max-w-2xl mx-auto"
          >
            {language === "english"
              ? "Let our experienced team guide you through your legal journey"
              : "دع فريقنا ذو الخبرة يرشدك خلال رحلتك القانونية"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/contact"
              className="inline-block bg-white text-lawyer-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              {language === "english"
                ? "Schedule Consultation"
                : "احجز استشارة"}
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
