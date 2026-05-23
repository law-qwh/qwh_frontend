// src/dashboard/pages/Settings.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiService } from "../../services/api";

const Settings = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});

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
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "contact",
      label: language === "arabic" ? "معلومات الاتصال" : "Contact Info",
      icon: (
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
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      id: "social",
      label: language === "arabic" ? "وسائل التواصل" : "Social Media",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {language === "arabic" ? "الإعدادات" : "Settings"}
          </h1>
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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-lawyer-accent border-b-2 border-lawyer-accent"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
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
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "ساعات العمل (إنجليزي)"
                        : "Working Hours (English)"}
                    </label>
                    <input
                      type="text"
                      name="working_hours"
                      value={settings.working_hours || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Sunday - Thursday: 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "ساعات العمل (عربي)"
                        : "Working Hours (Arabic)"}
                    </label>
                    <input
                      type="text"
                      name="working_hours_arabic"
                      value={settings.working_hours_arabic || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Facebook</label>
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
                    <label className={labelClasses}>Twitter / X</label>
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
                    <label className={labelClasses}>Instagram</label>
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
                    <label className={labelClasses}>LinkedIn</label>
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
                className="flex-1 bg-lawyer-accent text-white font-semibold py-3 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                  </div>
                ) : language === "arabic" ? (
                  "حفظ الإعدادات"
                ) : (
                  "Save Settings"
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
