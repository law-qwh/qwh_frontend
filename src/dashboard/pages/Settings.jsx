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
      icon: "⚙️",
    },
    {
      id: "contact",
      label: language === "arabic" ? "معلومات الاتصال" : "Contact Info",
      icon: "📞",
    },
    {
      id: "social",
      label: language === "arabic" ? "وسائل التواصل" : "Social Media",
      icon: "📱",
    },
    // { id: "seo", label: "SEO", icon: "🔍" },
  ];

  const inputClasses =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all duration-200";
  const labelClasses = "block text-gray-700 font-semibold mb-2";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lawyer-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              <span>{tab.icon}</span>
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
                      placeholder="Enter site name"
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
                      placeholder="أدخل اسم الموقع"
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
                      placeholder="Enter site tagline"
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
                      placeholder="أدخل الشعار الفرعي"
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
                      placeholder="Enter office address"
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
                      placeholder="أدخل عنوان المكتب"
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

            {/* SEO Tab */}
            {/* {activeTab === "seo" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5"
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
                    <div>
                      <p className="text-sm text-blue-800">
                        {language === "arabic"
                          ? "إعدادات SEO تساعد في تحسين ظهور موقعك في محركات البحث"
                          : "SEO settings help improve your website's visibility in search engines"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "عنوان الميتا (إنجليزي)"
                        : "Meta Title (English)"}
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={settings.meta_title || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Your page title for search engines"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "arabic"
                        ? "موصى به: 50-60 حرف"
                        : "Recommended: 50-60 characters"}
                    </p>
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "عنوان الميتا (عربي)"
                        : "Meta Title (Arabic)"}
                    </label>
                    <input
                      type="text"
                      name="meta_title_arabic"
                      value={settings.meta_title_arabic || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="عنوان الصفحة لمحركات البحث"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "وصف الميتا (إنجليزي)"
                        : "Meta Description (English)"}
                    </label>
                    <textarea
                      name="meta_description"
                      value={settings.meta_description || ""}
                      onChange={handleChange}
                      rows="3"
                      className={inputClasses}
                      placeholder="Brief description of your page"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "arabic"
                        ? "موصى به: 150-160 حرف"
                        : "Recommended: 150-160 characters"}
                    </p>
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "وصف الميتا (عربي)"
                        : "Meta Description (Arabic)"}
                    </label>
                    <textarea
                      name="meta_description_arabic"
                      value={settings.meta_description_arabic || ""}
                      onChange={handleChange}
                      rows="3"
                      className={inputClasses}
                      placeholder="وصف مختصر لصفحتك"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      {language === "arabic"
                        ? "الكلمات المفتاحية"
                        : "Meta Keywords"}
                    </label>
                    <input
                      type="text"
                      name="meta_keywords"
                      value={settings.meta_keywords || ""}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="lawyer, legal services, attorney"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "arabic"
                        ? "افصل الكلمات بفواصل"
                        : "Separate keywords with commas"}
                    </p>
                  </div>
                </div>
              </div>
            )} */}

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
