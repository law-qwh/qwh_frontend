// src/dashboard/pages/Settings.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiService } from "../../services/api";
import {
  Settings as SettingsIcon,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  User,
} from "lucide-react";

const Settings = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});

  // Working hours state
  const [workingHours, setWorkingHours] = useState({
    startDay: "Sunday",
    endDay: "Thursday",
    startTime: "09:00",
    endTime: "18:00",
  });

  // Day options for dropdown
  const dayOptions = {
    english: [
      { value: "Sunday", label: "Sunday" },
      { value: "Monday", label: "Monday" },
      { value: "Tuesday", label: "Tuesday" },
      { value: "Wednesday", label: "Wednesday" },
      { value: "Thursday", label: "Thursday" },
      { value: "Friday", label: "Friday" },
      { value: "Saturday", label: "Saturday" },
    ],
    arabic: [
      { value: "Sunday", label: "الأحد" },
      { value: "Monday", label: "الاثنين" },
      { value: "Tuesday", label: "الثلاثاء" },
      { value: "Wednesday", label: "الأربعاء" },
      { value: "Thursday", label: "الخميس" },
      { value: "Friday", label: "الجمعة" },
      { value: "Saturday", label: "السبت" },
    ],
  };

  // Generate working hours string
  const generateWorkingHoursString = (hours) => {
    const startDayEn = hours.startDay;
    const endDayEn = hours.endDay;
    const startTime = hours.startTime;
    const endTime = hours.endTime;

    // Format time to 12-hour format
    const formatTime = (time) => {
      const [hour, minute] = time.split(":");
      const h = parseInt(hour);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute} ${ampm}`;
    };

    const startTimeFormatted = formatTime(startTime);
    const endTimeFormatted = formatTime(endTime);

    // English version
    const englishHours = `${startDayEn} - ${endDayEn}: ${startTimeFormatted} - ${endTimeFormatted}`;

    // Get Arabic day names
    const getArabicDay = (day) => {
      const arabicDays = {
        Sunday: "الأحد",
        Monday: "الاثنين",
        Tuesday: "الثلاثاء",
        Wednesday: "الأربعاء",
        Thursday: "الخميس",
        Friday: "الجمعة",
        Saturday: "السبت",
      };
      return arabicDays[day];
    };

    // Format time in Arabic (24-hour format for Arabic)
    const formatTimeArabic = (time) => {
      const [hour, minute] = time.split(":");
      return `${hour}:${minute}`;
    };

    const startTimeArabic = formatTimeArabic(startTime);
    const endTimeArabic = formatTimeArabic(endTime);

    // Arabic version
    const arabicHours = `${getArabicDay(startDayEn)} - ${getArabicDay(endDayEn)}: ${startTimeArabic} - ${endTimeArabic}`;

    return { english: englishHours, arabic: arabicHours };
  };

  // Update working hours and sync with settings
  const updateWorkingHours = (field, value) => {
    const newWorkingHours = { ...workingHours, [field]: value };
    setWorkingHours(newWorkingHours);

    const generatedHours = generateWorkingHoursString(newWorkingHours);
    setSettings({
      ...settings,
      working_hours: generatedHours.english,
      working_hours_arabic: generatedHours.arabic,
    });
  };

  // Parse existing working hours into dropdown values
  const parseWorkingHours = (hoursString) => {
    if (!hoursString) return null;

    // Try to parse English format: "Sunday - Thursday: 9:00 AM - 6:00 PM"
    const englishMatch = hoursString.match(
      /^(\w+)\s*-\s*(\w+):\s*(\d+:\d+\s*(?:AM|PM))\s*-\s*(\d+:\d+\s*(?:AM|PM))$/i,
    );
    if (englishMatch) {
      const startDay = englishMatch[1];
      const endDay = englishMatch[2];
      const startTime = englishMatch[3];
      const endTime = englishMatch[4];

      // Convert 12-hour format to 24-hour format for time inputs
      const convertTo24Hour = (time12h) => {
        const match = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          let hour = parseInt(match[1]);
          const minute = match[2];
          const ampm = match[3].toUpperCase();
          if (ampm === "PM" && hour !== 12) hour += 12;
          if (ampm === "AM" && hour === 12) hour = 0;
          return `${hour.toString().padStart(2, "0")}:${minute}`;
        }
        return "09:00";
      };

      return {
        startDay,
        endDay,
        startTime: convertTo24Hour(startTime),
        endTime: convertTo24Hour(endTime),
      };
    }
    return null;
  };

  // Initialize working hours from settings
  useEffect(() => {
    if (settings.working_hours) {
      const parsed = parseWorkingHours(settings.working_hours);
      if (parsed) {
        setWorkingHours(parsed);
      }
    }
  }, [settings.working_hours]);

  // Fetch settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSettings();
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
        setOriginalSettings(response.data.data);

        // Parse working hours if they exist
        if (response.data.data.working_hours) {
          const parsed = parseWorkingHours(response.data.data.working_hours);
          if (parsed) {
            setWorkingHours(parsed);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل تحميل الإعدادات"
            : "Failed to load settings",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleReset = () => {
    setSettings(originalSettings);
    if (originalSettings.working_hours) {
      const parsed = parseWorkingHours(originalSettings.working_hours);
      if (parsed) {
        setWorkingHours(parsed);
      }
    }
    setMessage({
      type: "success",
      text:
        language === "arabic"
          ? "تم إعادة تعيين الإعدادات!"
          : "Settings reset to saved values!",
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert settings object to array for API
      const settingsArray = Object.keys(settings).map((key) => ({
        key: key,
        value: settings[key],
      }));

      const response = await apiService.bulkUpdateSettings(settingsArray);
      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? "تم حفظ الإعدادات بنجاح!"
              : "Settings saved successfully!",
        });
        setOriginalSettings({ ...settings });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل حفظ الإعدادات"
            : "Failed to save settings",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      id: "general",
      label: language === "arabic" ? "عام" : "General",
      icon: SettingsIcon,
    },
    {
      id: "contact",
      label: language === "arabic" ? "معلومات الاتصال" : "Contact Info",
      icon: Mail,
    },
    {
      id: "social",
      label: language === "arabic" ? "وسائل التواصل" : "Social Media",
      icon: Globe,
    },
  ];

  const inputClasses = `w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all duration-200 ${
    language === "arabic" ? "text-right" : "text-left"
  }`;
  const labelClasses = `block text-gray-700 font-semibold mb-2 ${
    language === "arabic" ? "text-right" : "text-left"
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lawyer-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={language === "arabic" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-lawyer-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === "arabic" ? "الإعدادات" : "Settings"}
            </h1>
          </div>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "إدارة إعدادات موقعك وتفضيلاته"
              : "Manage your website settings and preferences"}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {language === "arabic" ? "إعادة تعيين" : "Reset"}
        </button>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-lawyer-accent border-b-2 border-lawyer-accent"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* General Settings Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "اسم الموقع (إنجليزي)"
                        : "Site Name (English)"}
                    </label>
                    <input
                      type="text"
                      name="site_name"
                      value={settings.site_name || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={
                        language === "arabic"
                          ? "أدخل اسم الموقع"
                          : "Enter site name"
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "اسم الموقع (عربي)"
                        : "Site Name (Arabic)"}
                    </label>
                    <input
                      type="text"
                      name="site_name_arabic"
                      value={settings.site_name_arabic || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={
                        language === "arabic"
                          ? "أدخل اسم الموقع"
                          : "Enter site name"
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "الشعار الفرعي (إنجليزي)"
                        : "Site Tagline (English)"}
                    </label>
                    <input
                      type="text"
                      name="site_tagline"
                      value={settings.site_tagline || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={
                        language === "arabic"
                          ? "أدخل الشعار الفرعي"
                          : "Enter site tagline"
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "الشعار الفرعي (عربي)"
                        : "Site Tagline (Arabic)"}
                    </label>
                    <input
                      type="text"
                      name="site_tagline_arabic"
                      value={settings.site_tagline_arabic || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={
                        language === "arabic"
                          ? "أدخل الشعار الفرعي"
                          : "Enter site tagline"
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Info Tab */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic" ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={settings.email || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="info@example.com"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic" ? "البريد الإداري" : "Admin Email"}
                    </label>
                    <input
                      type="email"
                      name="admin_email"
                      value={settings.admin_email || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic" ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={settings.phone || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic" ? "هاتف بديل" : "Alternate Phone"}
                    </label>
                    <input
                      type="tel"
                      name="alternate_phone"
                      value={settings.alternate_phone || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "العنوان (إنجليزي)"
                        : "Address (English)"}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={settings.address || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={
                        language === "arabic"
                          ? "أدخل عنوان المكتب"
                          : "Enter office address"
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "العنوان (عربي)"
                        : "Address (Arabic)"}
                    </label>
                    <input
                      type="text"
                      name="address_arabic"
                      value={settings.address_arabic || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={
                        language === "arabic"
                          ? "أدخل عنوان المكتب"
                          : "Enter office address"
                      }
                    />
                  </div>

                  {/* Working Hours Section */}
                  <div className="md:col-span-2">
                    <div className="border-t border-gray-200 pt-6 mt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-lawyer-accent" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {language === "arabic"
                            ? "ساعات العمل"
                            : "Working Hours"}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className={labelClasses}>
                            {language === "arabic" ? "من يوم" : "From Day"}
                          </label>
                          <select
                            value={workingHours.startDay}
                            onChange={(e) =>
                              updateWorkingHours("startDay", e.target.value)
                            }
                            className={inputClasses}
                          >
                            {(language === "arabic"
                              ? dayOptions.arabic
                              : dayOptions.english
                            ).map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={labelClasses}>
                            {language === "arabic" ? "إلى يوم" : "To Day"}
                          </label>
                          <select
                            value={workingHours.endDay}
                            onChange={(e) =>
                              updateWorkingHours("endDay", e.target.value)
                            }
                            className={inputClasses}
                          >
                            {(language === "arabic"
                              ? dayOptions.arabic
                              : dayOptions.english
                            ).map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={labelClasses}>
                            {language === "arabic" ? "من الساعة" : "From Time"}
                          </label>
                          <input
                            type="time"
                            value={workingHours.startTime}
                            onChange={(e) =>
                              updateWorkingHours("startTime", e.target.value)
                            }
                            className={inputClasses}
                          />
                        </div>

                        <div>
                          <label className={labelClasses}>
                            {language === "arabic" ? "إلى الساعة" : "To Time"}
                          </label>
                          <input
                            type="time"
                            value={workingHours.endTime}
                            onChange={(e) =>
                              updateWorkingHours("endTime", e.target.value)
                            }
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      {/* Preview of generated working hours */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">
                          {language === "arabic" ? "معاينة:" : "Preview:"}
                        </p>
                        <p className="text-sm text-gray-700">
                          {settings.working_hours}
                        </p>
                        <p
                          className="text-sm text-gray-700 mt-1 font-arabic"
                          dir="rtl"
                        >
                          {settings.working_hours_arabic}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>
                      <Facebook className="inline w-4 h-4 mr-2" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={settings.facebook || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      <Twitter className="inline w-4 h-4 mr-2" />
                      Twitter / X
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={settings.twitter || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      <Instagram className="inline w-4 h-4 mr-2" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={settings.instagram || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      <Linkedin className="inline w-4 h-4 mr-2" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={settings.linkedin || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-lawyer-accent text-white font-semibold py-3 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {language === "arabic" ? "حفظ الإعدادات" : "Save Settings"}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default Settings;
