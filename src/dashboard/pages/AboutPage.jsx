// src/dashboard/pages/AboutPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Palette,
  FileText,
  Diamond,
  Target,
  Eye,
  Heart,
  Shield,
  Star,
  Users,
  Award,
  Globe,
  MessageCircle,
  Sparkles,
  BookOpen,
  TrendingUp,
  Zap,
} from "lucide-react";

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
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل تحميل محتوى صفحة عنا"
            : "Failed to load about content",
      });
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
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "لا يوجد محتوى للتحديث"
            : "No about content found to update",
      });
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
          text:
            language === "arabic"
              ? "تم تحديث محتوى صفحة عنا بنجاح!"
              : "About content updated successfully!",
        });
        setTimeout(() => setMessage(null), 3000);
        fetchAboutContent();
      }
    } catch (error) {
      console.error("Error updating about content:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل تحديث محتوى صفحة عنا"
            : "Failed to update about content",
      });
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
        text:
          language === "arabic"
            ? "يرجى ملء القيم بالإنجليزية والعربية"
            : "Please fill both English and Arabic values",
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
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? "تم إضافة القيمة الأساسية بنجاح!"
              : "Core value added successfully!",
        });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error adding core value:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل إضافة القيمة الأساسية"
            : "Failed to add core value",
      });
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
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? "تم تحديث القيمة الأساسية!"
              : "Core value updated!",
        });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error updating core value:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل تحديث القيمة الأساسية"
            : "Failed to update core value",
      });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const deleteCoreValue = async (id) => {
    if (
      window.confirm(
        language === "arabic"
          ? "هل أنت متأكد من حذف هذه القيمة الأساسية؟"
          : "Are you sure you want to delete this core value?",
      )
    ) {
      try {
        const response = await apiService.deleteCoreValue(id);
        if (response.data.success) {
          setCoreValues(coreValues.filter((v) => v.id !== id));
          setMessage({
            type: "success",
            text:
              language === "arabic"
                ? "تم حذف القيمة الأساسية!"
                : "Core value deleted!",
          });
          setTimeout(() => setMessage(null), 2000);
        }
      } catch (error) {
        console.error("Error deleting core value:", error);
        setMessage({
          type: "error",
          text:
            language === "arabic"
              ? "فشل حذف القيمة الأساسية"
              : "Failed to delete core value",
        });
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
      label: language === "arabic" ? "القسم الرئيسي" : "Main Section",
      icon: Palette,
    },
    {
      id: "content",
      label: language === "arabic" ? "المحتوى" : "Content",
      icon: FileText,
    },
    {
      id: "values",
      label: language === "arabic" ? "القيم الأساسية" : "Core Values",
      icon: Diamond,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-lawyer-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === "arabic" ? "صفحة عنا" : "About Page"}
            </h1>
          </div>
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
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
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
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-6 w-6 text-lawyer-accent" />
              <h2 className="text-xl font-bold text-gray-900">
                {language === "arabic" ? "القسم الرئيسي" : "Main Section"}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* English Fields */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">
                    {language === "arabic"
                      ? "النسخة الإنجليزية"
                      : "English Version"}
                  </h3>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "العنوان الرئيسي (إنجليزي)"
                      : "Hero Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={aboutContent?.hero_title_english || ""}
                    onChange={(e) =>
                      handleAboutChange("hero_title_english", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                    placeholder="Enter hero title in English"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "العنوان الفرعي (إنجليزي)"
                      : "Hero Subtitle (English)"}
                  </label>
                  <textarea
                    value={aboutContent?.hero_subtitle_english || ""}
                    onChange={(e) =>
                      handleAboutChange("hero_subtitle_english", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                    placeholder="Enter hero subtitle in English"
                  />
                </div>
              </div>

              {/* Arabic Fields */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">
                    {language === "arabic"
                      ? "النسخة العربية"
                      : "Arabic Version"}
                  </h3>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "العنوان الرئيسي (عربي)"
                      : "Hero Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={aboutContent?.hero_title_arabic || ""}
                    onChange={(e) =>
                      handleAboutChange("hero_title_arabic", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent font-arabic"
                    dir="rtl"
                    placeholder="أدخل العنوان الرئيسي بالعربية"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "العنوان الفرعي (عربي)"
                      : "Hero Subtitle (Arabic)"}
                  </label>
                  <textarea
                    value={aboutContent?.hero_subtitle_arabic || ""}
                    onChange={(e) =>
                      handleAboutChange("hero_subtitle_arabic", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none font-arabic"
                    dir="rtl"
                    placeholder="أدخل العنوان الفرعي بالعربية"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab - Mission & Vision */}
        {activeTab === "content" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-6 w-6 text-lawyer-accent" />
              <h2 className="text-xl font-bold text-gray-900">
                {language === "arabic" ? "الرسالة والرؤية" : "Mission & Vision"}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* English Version */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">
                    English Version
                  </h3>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "الرسالة (إنجليزي)"
                      : "Mission (English)"}
                  </label>
                  <textarea
                    value={aboutContent?.mission_english || ""}
                    onChange={(e) =>
                      handleAboutChange("mission_english", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                    placeholder="Enter mission statement in English"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "الرؤية (إنجليزي)"
                      : "Vision (English)"}
                  </label>
                  <textarea
                    value={aboutContent?.vision_english || ""}
                    onChange={(e) =>
                      handleAboutChange("vision_english", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                    placeholder="Enter vision statement in English"
                  />
                </div>
              </div>

              {/* Arabic Version */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">
                    Arabic Version
                  </h3>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "الرسالة (عربي)"
                      : "Mission (Arabic)"}
                  </label>
                  <textarea
                    value={aboutContent?.mission_arabic || ""}
                    onChange={(e) =>
                      handleAboutChange("mission_arabic", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none font-arabic"
                    dir="rtl"
                    placeholder="أدخل نص الرسالة بالعربية"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "الرؤية (عربي)"
                      : "Vision (Arabic)"}
                  </label>
                  <textarea
                    value={aboutContent?.vision_arabic || ""}
                    onChange={(e) =>
                      handleAboutChange("vision_arabic", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none font-arabic"
                    dir="rtl"
                    placeholder="أدخل نص الرؤية بالعربية"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Core Values Tab */}
        {activeTab === "values" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Diamond className="h-6 w-6 text-lawyer-accent" />
              <h2 className="text-xl font-bold text-gray-900">
                {language === "arabic" ? "القيم الأساسية" : "Core Values"}
              </h2>
            </div>

            {/* Add New Core Value Form */}
            <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-lawyer-accent" />
                <h3 className="font-semibold text-gray-800">
                  {language === "arabic"
                    ? "إضافة قيمة جديدة"
                    : "Add New Core Value"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newValueEnglish}
                  onChange={(e) => setNewValueEnglish(e.target.value)}
                  placeholder="Value (English)"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                />
                <input
                  type="text"
                  value={newValueArabic}
                  onChange={(e) => setNewValueArabic(e.target.value)}
                  placeholder="القيمة (عربي)"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent font-arabic"
                  dir="rtl"
                />
                <button
                  onClick={addCoreValue}
                  className="bg-lawyer-accent text-white px-6 py-2.5 rounded-lg hover:bg-lawyer-primary transition-colors flex items-center justify-center gap-2 md:col-span-2"
                >
                  <Plus className="w-5 h-5" />
                  {language === "arabic"
                    ? "إضافة قيمة جديدة"
                    : "Add Core Value"}
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
                    className="group bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-lawyer-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-lawyer-accent" />
                      </div>
                      <div className="flex-1">
                        {editingValue === value.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              defaultValue={value.value_english}
                              id={`edit_english_${value.id}`}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-lawyer-accent"
                              placeholder="English"
                            />
                            <input
                              type="text"
                              defaultValue={value.value_arabic}
                              id={`edit_arabic_${value.id}`}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-lawyer-accent font-arabic"
                              placeholder="Arabic"
                              dir="rtl"
                            />
                            <div className="flex gap-2 pt-1">
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
                                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
                              >
                                {language === "arabic" ? "حفظ" : "Save"}
                              </button>
                              <button
                                onClick={() => setEditingValue(null)}
                                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                              >
                                {language === "arabic" ? "إلغاء" : "Cancel"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3
                              className="font-semibold text-gray-900 cursor-pointer hover:text-lawyer-accent transition-colors"
                              onClick={() => setEditingValue(value.id)}
                            >
                              {language === "arabic"
                                ? value.value_arabic
                                : value.value_english}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {language === "arabic"
                                ? "بالإنجليزية:"
                                : "English:"}{" "}
                              <span className="text-gray-500">
                                {value.value_english}
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => deleteCoreValue(value.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title={language === "arabic" ? "حذف" : "Delete"}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {coreValues.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === "arabic"
                    ? "لا توجد قيم أساسية مضافة بعد"
                    : "No core values added yet"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {language === "arabic"
                    ? "استخدم النموذج أعلاه لإضافة قيمك الأولى"
                    : "Use the form above to add your first core values"}
                </p>
              </div>
            )}
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
              <Save className="w-5 h-5" />
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
