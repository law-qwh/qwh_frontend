// src/dashboard/pages/AboutPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";

const AboutPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // About Content State
  const [aboutContent, setAboutContent] = useState(null);
  const [aboutContentId, setAboutContentId] = useState(null);

  // Core Values State
  const [coreValues, setCoreValues] = useState([]);
  const [newValueEnglish, setNewValueEnglish] = useState("");
  const [newValueArabic, setNewValueArabic] = useState("");
  const [editingValue, setEditingValue] = useState(null);

  // Fetch Data
  useEffect(() => {
    fetchAboutContent();
    fetchCoreValues();
  }, []);

  const fetchAboutContent = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAboutContent();
      if (response.data.success && response.data.data) {
        setAboutContent(response.data.data);
        setAboutContentId(response.data.data.id);
      }
    } catch (error) {
      console.error("Error fetching about content:", error);
      setMessage({ type: "error", text: "Failed to load about content" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoreValues = async () => {
    try {
      const response = await apiService.getCoreValues();
      if (response.data.success) {
        setCoreValues(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching core values:", error);
    }
  };

  // Update About Content
  const updateAboutContent = async () => {
    if (!aboutContentId) {
      setMessage({ type: "error", text: "No about content found to update" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.updateAboutContent(
        aboutContentId,
        aboutContent,
      );
      if (response.data.success) {
        setMessage({
          type: "success",
          text: "About content updated successfully!",
        });
        setTimeout(() => setMessage(null), 3000);
        fetchAboutContent();
      }
    } catch (error) {
      console.error("Error updating about content:", error);
      setMessage({ type: "error", text: "Failed to update about content" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Core Values CRUD
  const addCoreValue = async () => {
    if (!newValueEnglish.trim() || !newValueArabic.trim()) {
      setMessage({
        type: "error",
        text: "Please fill both English and Arabic values",
      });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    try {
      const response = await apiService.createCoreValue({
        value_english: newValueEnglish.trim(),
        value_arabic: newValueArabic.trim(),
        is_active: true,
      });
      if (response.data.success) {
        setCoreValues([...coreValues, response.data.data]);
        setNewValueEnglish("");
        setNewValueArabic("");
        setMessage({ type: "success", text: "Core value added successfully!" });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error adding core value:", error);
      setMessage({ type: "error", text: "Failed to add core value" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const updateCoreValue = async (id, valueEnglish, valueArabic) => {
    try {
      const response = await apiService.updateCoreValue(id, {
        value_english: valueEnglish,
        value_arabic: valueArabic,
      });
      if (response.data.success) {
        setCoreValues(
          coreValues.map((v) => (v.id === id ? response.data.data : v)),
        );
        setEditingValue(null);
        setMessage({ type: "success", text: "Core value updated!" });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error updating core value:", error);
      setMessage({ type: "error", text: "Failed to update core value" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const deleteCoreValue = async (id) => {
    if (window.confirm("Are you sure you want to delete this core value?")) {
      try {
        const response = await apiService.deleteCoreValue(id);
        if (response.data.success) {
          setCoreValues(coreValues.filter((v) => v.id !== id));
          setMessage({ type: "success", text: "Core value deleted!" });
          setTimeout(() => setMessage(null), 2000);
        }
      } catch (error) {
        console.error("Error deleting core value:", error);
        setMessage({ type: "error", text: "Failed to delete core value" });
        setTimeout(() => setMessage(null), 2000);
      }
    }
  };

  // Handle About Content Changes
  const handleAboutChange = (field, value) => {
    setAboutContent({ ...aboutContent, [field]: value });
  };

  const tabs = [
    {
      id: "hero",
      label: language === "arabic" ? "قسم البطل" : "Hero Section",
      icon: "🎨",
    },
    {
      id: "content",
      label: language === "arabic" ? "المحتوى" : "Content",
      icon: "📝",
    },
    {
      id: "values",
      label: language === "arabic" ? "القيم الأساسية" : "Core Values",
      icon: "💎",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {language === "arabic" ? "صفحة عنا" : "About Page"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "إدارة محتوى صفحة عنا ومعلومات الشركة"
              : "Manage your About page content and company information"}
          </p>
        </div>
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

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Hero Section Tab */}
        {activeTab === "hero" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {language === "arabic" ? "قسم البطل" : "Hero Section"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* English Fields */}
              <div className="space-y-5">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">
                    English Version
                  </h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Hero Title (English)
                    </label>
                    <input
                      type="text"
                      value={aboutContent?.hero_title_english || ""}
                      onChange={(e) =>
                        handleAboutChange("hero_title_english", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Hero Subtitle (English)
                    </label>
                    <textarea
                      value={aboutContent?.hero_subtitle_english || ""}
                      onChange={(e) =>
                        handleAboutChange(
                          "hero_subtitle_english",
                          e.target.value,
                        )
                      }
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Arabic Fields */}
              <div className="space-y-5">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">
                    Arabic Version
                  </h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Hero Title (Arabic)
                    </label>
                    <input
                      type="text"
                      value={aboutContent?.hero_title_arabic || ""}
                      onChange={(e) =>
                        handleAboutChange("hero_title_arabic", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Hero Subtitle (Arabic)
                    </label>
                    <textarea
                      value={aboutContent?.hero_subtitle_arabic || ""}
                      onChange={(e) =>
                        handleAboutChange(
                          "hero_subtitle_arabic",
                          e.target.value,
                        )
                      }
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab - Mission & Vision */}
        {activeTab === "content" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {language === "arabic" ? "الرسالة والرؤية" : "Mission & Vision"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* English Version */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                  English Version
                </h3>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Mission (English)
                  </label>
                  <textarea
                    value={aboutContent?.mission_english || ""}
                    onChange={(e) =>
                      handleAboutChange("mission_english", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Vision (English)
                  </label>
                  <textarea
                    value={aboutContent?.vision_english || ""}
                    onChange={(e) =>
                      handleAboutChange("vision_english", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                  />
                </div>
              </div>

              {/* Arabic Version */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">
                  Arabic Version
                </h3>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Mission (Arabic)
                  </label>
                  <textarea
                    value={aboutContent?.mission_arabic || ""}
                    onChange={(e) =>
                      handleAboutChange("mission_arabic", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Vision (Arabic)
                  </label>
                  <textarea
                    value={aboutContent?.vision_arabic || ""}
                    onChange={(e) =>
                      handleAboutChange("vision_arabic", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Core Values Tab */}
        {activeTab === "values" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === "arabic" ? "القيم الأساسية" : "Core Values"}
              </h2>
            </div>

            {/* Add New Core Value Form */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-3">
                {language === "arabic"
                  ? "إضافة قيمة جديدة"
                  : "Add New Core Value"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newValueEnglish}
                  onChange={(e) => setNewValueEnglish(e.target.value)}
                  placeholder="Value (English)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                />
                <input
                  type="text"
                  value={newValueArabic}
                  onChange={(e) => setNewValueArabic(e.target.value)}
                  placeholder="Value (Arabic)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                  dir="rtl"
                />
                <button
                  onClick={addCoreValue}
                  className="bg-lawyer-accent text-white px-6 py-2 rounded-lg hover:bg-lawyer-primary transition-colors md:col-span-2"
                >
                  {language === "arabic" ? "إضافة" : "Add Core Value"}
                </button>
              </div>
            </div>

            {/* Core Values List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {coreValues.map((value, index) => (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        {editingValue === value.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              defaultValue={value.value_english}
                              id={`edit_english_${value.id}`}
                              className="w-full px-3 py-1 border rounded-lg text-sm"
                              placeholder="English"
                            />
                            <input
                              type="text"
                              defaultValue={value.value_arabic}
                              id={`edit_arabic_${value.id}`}
                              className="w-full px-3 py-1 border rounded-lg text-sm"
                              placeholder="Arabic"
                              dir="rtl"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const newEnglish = document.getElementById(
                                    `edit_english_${value.id}`,
                                  ).value;
                                  const newArabic = document.getElementById(
                                    `edit_arabic_${value.id}`,
                                  ).value;
                                  updateCoreValue(
                                    value.id,
                                    newEnglish,
                                    newArabic,
                                  );
                                }}
                                className="text-green-600 text-sm hover:text-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingValue(null)}
                                className="text-gray-500 text-sm hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3
                              className="font-semibold text-gray-900 cursor-pointer hover:text-lawyer-accent"
                              onClick={() => setEditingValue(value.id)}
                            >
                              {language === "arabic"
                                ? value.value_arabic
                                : value.value_english}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {language === "arabic"
                                ? "القيمة الإنجليزية:"
                                : "English:"}{" "}
                              {value.value_english}
                            </p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => deleteCoreValue(value.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>

      {/* Submit Button */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <button
          onClick={updateAboutContent}
          disabled={loading}
          className="w-full bg-lawyer-accent text-white px-6 py-3 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {language === "arabic" ? "جاري الحفظ..." : "Saving Changes..."}
            </>
          ) : (
            <>
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
              {language === "arabic"
                ? "حفظ جميع التغييرات"
                : "Save All Changes"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
