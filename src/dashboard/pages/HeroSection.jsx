import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import api, { apiService } from "../../services/api";

const HeroSection = () => {
  const { language } = useLanguage();
  const [heroData, setHeroData] = useState({
    id: null,
    title_english: "",
    title_arabic: "",
    subtitle_english: "",
    subtitle_arabic: "",
    description_english: "",
    description_arabic: "",
    image_path: "",
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [formLanguage, setFormLanguage] = useState("english");
  const [savedPresets, setSavedPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [showPresetModal, setShowPresetModal] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved presets from localStorage
  useEffect(() => {
    const presets = localStorage.getItem("heroPresets");
    if (presets) {
      setSavedPresets(JSON.parse(presets));
    }
  }, []);

  // Fetch hero data on component mount
  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setFetching(true);
    try {
      // Use the correct API endpoint - /hero (not /hero-slides)
      const response = await apiService.getHeroSlides();

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setHeroData({
          id: data.id,
          title_english: data.title_english || "",
          title_arabic: data.title_arabic || "",
          subtitle_english: data.subtitle_english || "",
          subtitle_arabic: data.subtitle_arabic || "",
          description_english: data.description_english || "",
          description_arabic: data.description_arabic || "",
          image_path: data.image_path || "",
          is_active: data.is_active,
        });

        if (data.image_path) {
          const baseUrl = import.meta.env.VITE_API_URL || "https://qwh.com.sa/";
          const imageUrl = `${baseUrl}/storage/${data.image_path}`;
          setImagePreview(imageUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      console.error("Error details:", error.response?.data);
      setMessage({
        type: "error",
        text: "Failed to load hero data. Please refresh the page.",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroData({
      ...heroData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 2MB",
        });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Please upload JPEG, PNG, JPG, or WEBP image",
        });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAsPreset = () => {
    if (!presetName.trim()) {
      setMessage({ type: "error", text: "Please enter a preset name" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newPreset = {
      id: Date.now(),
      name: presetName,
      data: { ...heroData, image_path: imagePreview },
      createdAt: new Date().toISOString(),
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem("heroPresets", JSON.stringify(updatedPresets));
    setPresetName("");
    setShowPresetModal(false);
    setMessage({ type: "success", text: "Preset saved successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadPreset = (preset) => {
    setHeroData(preset.data);
    setImagePreview(preset.data.image_path);
    setMessage({ type: "success", text: `Preset "${preset.name}" loaded!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const deletePreset = (id) => {
    const updatedPresets = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(updatedPresets);
    localStorage.setItem("heroPresets", JSON.stringify(updatedPresets));
    setMessage({ type: "success", text: "Preset deleted successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        language === "arabic"
          ? "هل أنت متأكد من إعادة تعيين جميع التغييرات؟"
          : "Are you sure you want to reset all changes?",
      )
    ) {
      fetchHeroData();
      setImageFile(null);
      setMessage({ type: "success", text: "Changes reset successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heroData.id) {
      setMessage({
        type: "error",
        text: "Hero data not loaded. Please refresh the page.",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare data - match exactly what the backend expects
      const updateData = {
        title_english: heroData.title_english || "",
        title_arabic: heroData.title_arabic || "",
        subtitle_english: heroData.subtitle_english || "",
        subtitle_arabic: heroData.subtitle_arabic || "",
        description_english: heroData.description_english || "",
        description_arabic: heroData.description_arabic || "",
        cta_text_english: heroData.cta_text_english || "",
        cta_text_arabic: heroData.cta_text_arabic || "",
        is_active: heroData.is_active ? 1 : 0,
      };

      // If there's an image file, we need to use FormData
      let response;

      if (imageFile) {
        const formData = new FormData();
        Object.keys(updateData).forEach((key) => {
          formData.append(key, updateData[key]);
        });
        formData.append("image", imageFile);
        formData.append("_method", "PUT");

        response = await api.post(
          `api/admin/hero-slides/${heroData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        // No image change, use regular PUT
        response = await api.put(
          `api/admin/hero-slides/${heroData.id}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? "تم تحديث قسم البطل بنجاح!"
              : "Hero section updated successfully!",
        });

        await fetchHeroData();
        setImageFile(null);

        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error updating hero section:", error);

      // Extract validation errors
      let errorMessage = "Error updating hero section";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/api/admin/hero-slides/${heroData.id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setHeroData({
          ...heroData,
          is_active: response.data.is_active,
        });
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? `القسم ${response.data.is_active ? "تم التفعيل" : "تم التعطيل"} بنجاح`
              : `Hero section ${response.data.is_active ? "activated" : "deactivated"} successfully`,
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "حدث خطأ في تغيير الحالة"
            : "Error toggling status",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {language === "arabic" ? "قسم البطل" : "Hero Section"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "تخصيص البanner الرئيسي لموقعك"
              : "Customize the main banner of your website"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              heroData.is_active
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${heroData.is_active ? "bg-green-500" : "bg-gray-500"}`}
            ></div>
            {heroData.is_active
              ? language === "arabic"
                ? "نشط"
                : "Active"
              : language === "arabic"
                ? "غير نشط"
                : "Inactive"}
          </button>
          <button
            onClick={() => setShowPresetModal(true)}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Save as Preset
          </button>
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
            {language === "arabic" ? "إعادة تعيين" : "Reset Changes"}
          </button>
        </div>
      </div>

      {/* Saved Presets Bar */}
      {savedPresets.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Saved Presets:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedPresets.map((preset) => (
              <div key={preset.id} className="group relative">
                <button
                  onClick={() => loadPreset(preset)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-lawyer-accent hover:text-white rounded-lg transition-colors"
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => deletePreset(preset.id)}
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Language Tabs for Form */}
          <div className="flex gap-2 border-b border-gray-200 mb-6">
            <button
              type="button"
              className={`px-4 py-2 font-medium transition-colors ${
                formLanguage === "english"
                  ? "text-lawyer-accent border-b-2 border-lawyer-accent"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setFormLanguage("english")}
            >
              English
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium transition-colors ${
                formLanguage === "arabic"
                  ? "text-lawyer-accent border-b-2 border-lawyer-accent"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setFormLanguage("arabic")}
            >
              العربية
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {formLanguage === "english" ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Hero Title (English)
                  </label>
                  <input
                    type="text"
                    name="title_english"
                    value={heroData.title_english}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all"
                    placeholder="Enter hero title"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 5-10 words
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    name="subtitle_english"
                    value={heroData.subtitle_english}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all"
                    placeholder="Enter subtitle"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description (English)
                  </label>
                  <textarea
                    name="description_english"
                    value={heroData.description_english}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all resize-none"
                    placeholder="Enter description"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 15-30 words
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    العنوان الرئيسي (عربي)
                  </label>
                  <input
                    type="text"
                    name="title_arabic"
                    value={heroData.title_arabic}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all text-right"
                    placeholder="أدخل العنوان الرئيسي"
                    required
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    يوصى: 5-10 كلمات
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    العنوان الفرعي (عربي)
                  </label>
                  <input
                    type="text"
                    name="subtitle_arabic"
                    value={heroData.subtitle_arabic}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all text-right"
                    placeholder="أدخل العنوان الفرعي"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    الوصف (عربي)
                  </label>
                  <textarea
                    name="description_arabic"
                    value={heroData.description_arabic}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all resize-none text-right"
                    placeholder="أدخل الوصف"
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    يوصى: 15-30 كلمة
                  </p>
                </div>
              </div>
            )}

            {/* Background Image - Common for both tabs */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <label className="block text-gray-700 font-semibold mb-2">
                {language === "arabic" ? "صورة الخلفية" : "Background Image"}
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-lawyer-accent transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Click to change image (Max 2MB)
                    </p>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to upload image (JPEG, PNG, JPG, WEBP, max 2MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-lawyer-accent text-white font-semibold py-2.5 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                  </div>
                ) : language === "arabic" ? (
                  "حفظ التغييرات"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {language === "arabic" ? "معاينة مباشرة" : "Live Preview"}
              </h2>
              <div className="flex gap-2">
                <span className="text-xs text-gray-500">Real-time preview</span>
                <span className="text-xs text-green-500 animate-pulse">
                  ● Live
                </span>
              </div>
            </div>
            {/* Preview Language Indicator */}
            <div className="mt-2 flex gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${formLanguage === "english" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
              >
                Previewing: English
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${formLanguage === "arabic" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
              >
                المعاينة: العربية
              </span>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="relative rounded-xl overflow-hidden min-h-[450px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{
                  backgroundImage: `url(${imagePreview || "https://placehold.co/1920x1080/1a1a2e/ffffff?text=Hero+Background"})`,
                }}
              >
                <div className="absolute inset-0 bg-black opacity-30" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
                  <div className="max-w-2xl">
                    <motion.h1
                      key={
                        formLanguage === "english"
                          ? heroData.title_english
                          : heroData.title_arabic
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white"
                    >
                      {formLanguage === "english"
                        ? heroData.title_english
                        : heroData.title_arabic}
                    </motion.h1>

                    <motion.p
                      key={
                        formLanguage === "english"
                          ? heroData.subtitle_english
                          : heroData.subtitle_arabic
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg md:text-xl font-semibold mb-4 text-lawyer-accent"
                    >
                      {formLanguage === "english"
                        ? heroData.subtitle_english
                        : heroData.subtitle_arabic}
                    </motion.p>

                    <motion.p
                      key={
                        formLanguage === "english"
                          ? heroData.description_english
                          : heroData.description_arabic
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white/90 text-sm md:text-base mb-6"
                    >
                      {formLanguage === "english"
                        ? heroData.description_english
                        : heroData.description_arabic}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-3"
                    >
                      <button className="bg-lawyer-accent hover:bg-lawyer-primary text-white font-semibold px-6 py-2.5 rounded-lg transition-all transform hover:scale-105">
                        {formLanguage === "english" ? "Contact Us" : "اتصل بنا"}
                      </button>
                      <button className="border-2 border-white hover:bg-white/10 text-white font-semibold px-6 py-2.5 rounded-lg transition-all">
                        {formLanguage === "english"
                          ? "Our Services"
                          : "خدماتنا"}
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Controls Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                💡{" "}
                {language === "arabic"
                  ? "المعاينة تتغير في الوقت الفعلي أثناء تعديل المحتوى"
                  : "Preview updates in real-time as you modify content"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Preset Modal */}
      <AnimatePresence>
        {showPresetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPresetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Save as Preset
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Save current hero configuration as a preset for future use.
                </p>
                <input
                  type="text"
                  placeholder="Enter preset name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPresetModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAsPreset}
                    className="flex-1 bg-lawyer-accent text-white px-4 py-2.5 rounded-lg hover:bg-lawyer-primary transition-colors"
                  >
                    Save Preset
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
