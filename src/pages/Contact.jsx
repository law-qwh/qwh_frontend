// src/pages/Contact.jsx

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { apiService } from "../services/api";
import { getImageUrl } from "../utils/imageHelper";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Building,
  User,
  AtSign,
  FileText,
} from "lucide-react";

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "",
    email: "",
    phone: "",
    address: "",
    working_hours: "",
  });
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [heroData, setHeroData] = useState(null);

  const fetchSettings = async () => {
    try {
      const response = await apiService.getPublicSettings();
      if (response.data.success && response.data.data) {
        setSettings((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
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
    fetchSettings();
    fetchHeroData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await apiService.sendContactMessage(formData);
      if (response.data.success) {
        setSubmitStatus({
          type: "success",
          message:
            language === "english"
              ? "Message sent successfully! We will contact you soon."
              : "تم إرسال الرسالة بنجاح! سوف نتصل بك قريباً.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage =
        language === "english"
          ? "Failed to send message. Please try again."
          : "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.";

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      if (submitStatus?.type === "success") {
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    }
  };

  // Animation variants
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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

  const contactInfo = [
    {
      icon: MapPin,
      title: language === "english" ? "Office Address" : "عنوان المكتب",
      content: settings.address,
    },
    {
      icon: Phone,
      title: language === "english" ? "Phone Number" : "رقم الهاتف",
      content: settings.phone,
    },
    {
      icon: Mail,
      title: language === "english" ? "Email Address" : "البريد الإلكتروني",
      content: settings.email,
    },
    {
      icon: Clock,
      title: language === "english" ? "Working Hours" : "ساعات العمل",
      content: settings.working_hours,
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-lawyer-primary to-lawyer-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: heroData
              ? `url(${getImageUrl(heroData.image_path, heroData.image_url)})`
              : "url('/assets/bg-image.jpeg')",
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
              {language === "english" ? "Contact Us" : "اتصل بنا"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-200"
            >
              {language === "english"
                ? "Get in touch with our legal experts"
                : "تواصل مع خبرائنا القانونيين"}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50" ref={formRef}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={formInView ? { opacity: 1 } : {}}
                className="text-2xl md:text-3xl font-bold mb-6 text-lawyer-primary flex items-center gap-2"
              >
                <MessageCircle className="w-6 h-6 text-lawyer-accent" />
                {language === "english"
                  ? "Send us a message"
                  : "أرسل لنا رسالة"}
              </motion.h2>

              {/* Submit Status */}
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {submitStatus.message}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english" ? "Full Name" : "الاسم الكامل"} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english"
                      ? "Email Address"
                      : "البريد الإلكتروني"}{" "}
                    *
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english" ? "Phone Number" : "رقم الهاتف"}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "english" ? "Your Message" : "رسالتك"} *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent transition-all duration-300 resize-none"
                    ></motion.textarea>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lawyer-accent hover:bg-lawyer-gold text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {language === "english"
                        ? "Sending..."
                        : "جاري الإرسال..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {language === "english"
                        ? "Send Message"
                        : "إرسال الرسالة"}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-lawyer-primary to-lawyer-secondary rounded-2xl shadow-xl p-8 text-white mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  {language === "english"
                    ? "Contact Information"
                    : "معلومات الاتصال"}
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate={formInView ? "visible" : "hidden"}
                  className="space-y-6"
                >
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        whileHover={{ x: 10 }}
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-lawyer-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1 text-lg">
                            {info.title}
                          </h3>
                          <p className="text-gray-200">{info.content}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="h-80">
                  <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5736169234087!2d46.648637199999996!3d24.810049799999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee3c5dbb24def%3A0x8728e2245623de1b!2z2YLZiNipINmE2YTZhdit2KfZhdin2Kkg2YjYp9mE2KfYs9iq2LTYp9ix2KfYqiDYp9mE2YLYp9mG2YjZhtmK2Kk!5e0!3m2!1sen!2ssa!4v1777449556355!5m2!1sen!2ssa"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-lawyer-primary mb-4">
              {language === "english"
                ? "Frequently Asked Questions"
                : "الأسئلة الشائعة"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === "english"
                ? "Find answers to common questions about our services"
                : "اعثر على إجابات للأسئلة الشائعة حول خدماتنا"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q:
                  language === "english"
                    ? "How can I schedule a consultation?"
                    : "كيف يمكنني حجز استشارة؟",
                a:
                  language === "english"
                    ? "You can schedule a consultation by filling out the contact form above or calling our office directly."
                    : "يمكنك حجز استشارة عن طريق ملء نموذج الاتصال أعلاه أو الاتصال بمكتبنا مباشرة.",
              },
              {
                q:
                  language === "english"
                    ? "What are your consultation fees?"
                    : "ما هي رسوم الاستشارة؟",
                a:
                  language === "english"
                    ? "We offer competitive rates and free initial consultations for certain cases. Contact us for specific pricing."
                    : "نقدم أسعاراً تنافسية واستشارات أولية مجانية لبعض القضايا. اتصل بنا للحصول على تسعير محدد.",
              },
              {
                q:
                  language === "english"
                    ? "How long will my case take?"
                    : "كم من الوقت ستستغرق قضيتي؟",
                a:
                  language === "english"
                    ? "Case duration varies depending on complexity. We'll provide a timeline during your consultation."
                    : "تختلف مدة القضية حسب التعقيد. سنقدم جدولاً زمنياً خلال استشارتك.",
              },
              {
                q:
                  language === "english"
                    ? "Do you handle international cases?"
                    : "هل تتعاملون مع القضايا الدولية؟",
                a:
                  language === "english"
                    ? "Yes, we have experience with international law and cross-border legal matters."
                    : "نعم، لدينا خبرة في القانون الدولي والمسائل القانونية عبر الحدود.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-xl p-6 cursor-pointer"
              >
                <h3 className="font-bold text-lg text-lawyer-primary mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
