// src/dashboard/pages/StatsManagement.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  CheckCircle,
  Star,
  FileText,
  Scale,
  Building,
  Lock,
  Users,
  Home,
  Briefcase,
  Lightbulb,
  DollarSign,
  Handshake,
  BarChart,
  AlertCircle,
  Hash,
  Eye,
  EyeOff,
  Globe,
  BadgeCheck,
  Calendar,
  Target,
  Trophy,
  TrendingUp,
  Award,
  Rocket,
  Zap,
  Save,
} from "lucide-react";

const StatsManagement = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [modifiedStats, setModifiedStats] = useState(new Set());
  const [formData, setFormData] = useState({
    label_english: "",
    label_arabic: "",
    value: "",
    icon: "calendar",
    is_active: true,
    order: 0,
  });

  const iconOptions = [
    { component: Calendar, label: "Calendar - Years/Time", value: "calendar" },
    { component: Users, label: "Users - Clients/People", value: "users" },
    { component: Scale, label: "Scale - Justice/Law", value: "scale" },
    {
      component: BadgeCheck,
      label: "Badge - Certified/Expert",
      value: "badge-check",
    },
    {
      component: Target,
      label: "Target - Goals/Achievements",
      value: "target",
    },
    { component: Star, label: "Star - Excellence/Rating", value: "star" },
    { component: Trophy, label: "Trophy - Awards/Wins", value: "trophy" },
    {
      component: Briefcase,
      label: "Briefcase - Business/Cases",
      value: "briefcase",
    },
    { component: Globe, label: "Globe - International/Global", value: "globe" },
    {
      component: BarChart,
      label: "Bar Chart - Analytics/Stats",
      value: "bar-chart",
    },
    {
      component: TrendingUp,
      label: "Trending Up - Growth",
      value: "trending-up",
    },
    {
      component: Lightbulb,
      label: "Lightbulb - Insights/Solutions",
      value: "lightbulb",
    },
    {
      component: Handshake,
      label: "Handshake - Agreements",
      value: "handshake",
    },
    { component: Award, label: "Award - Recognition", value: "award" },
    { component: Rocket, label: "Rocket - Success/Growth", value: "rocket" },
    { component: Zap, label: "Zap - Fast/Efficient", value: "zap" },
  ];

  // Get icon component by value
  const getIconComponent = (iconValue) => {
    const icon = iconOptions.find((i) => i.value === iconValue);
    if (icon) return icon.component;
    return BarChart;
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setMessage({ type: "error", text: "Failed to load statistics" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        label_english: stat.label_english || "",
        label_arabic: stat.label_arabic || "",
        value: stat.value || "",
        icon: stat.icon || "bar-chart",
        is_active: stat.is_active === 1 || stat.is_active === true,
        order: stat.order || 0,
      });
    } else {
      setEditingStat(null);
      setFormData({
        label_english: "",
        label_arabic: "",
        value: "",
        icon: "bar-chart",
        is_active: true,
        order: stats.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStat(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLocalFieldChange = (id, field, value) => {
    setStats(
      stats.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat,
      ),
    );
    setModifiedStats((prev) => new Set([...prev, id]));
  };

  const handleSaveAllChanges = async () => {
    if (modifiedStats.size === 0) {
      setMessage({
        type: "info",
        text:
          language === "arabic"
            ? "لا توجد تغييرات للحفظ"
            : "No changes to save",
      });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setSavingChanges(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const token = localStorage.getItem("token");

      for (const id of modifiedStats) {
        const stat = stats.find((s) => s.id === id);
        if (stat) {
          try {
            const updateData = {
              label_english: stat.label_english,
              label_arabic: stat.label_arabic,
              value: stat.value,
              icon: stat.icon,
              is_active: stat.is_active ? 1 : 0,
              order: stat.order,
            };

            await api.put(`/api/admin/stats/${id}`, updateData, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            successCount++;
          } catch (error) {
            console.error(`Error saving stat ${id}:`, error);
            errorCount++;
          }
        }
      }

      if (successCount > 0) {
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? `تم تحديث ${successCount} إحصائية بنجاح!${errorCount > 0 ? ` فشل ${errorCount}.` : ""}`
              : `${successCount} statistic(s) updated successfully!${errorCount > 0 ? ` ${errorCount} failed.` : ""}`,
        });
        setModifiedStats(new Set());
        await fetchStats();
      } else if (errorCount > 0) {
        setMessage({
          type: "error",
          text:
            language === "arabic"
              ? "فشل حفظ التغييرات"
              : "Failed to save changes",
        });
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل حفظ التغييرات"
            : "Failed to save changes",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleSaveNewStat = async () => {
    if (!formData.label_english || !formData.label_arabic || !formData.value) {
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "يرجى ملء جميع الحقول المطلوبة (التسمية بالإنجليزية والعربية والقيمة)"
            : "Please fill in all required fields (English & Arabic labels, and value)",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const submitData = {
        label_english: formData.label_english,
        label_arabic: formData.label_arabic,
        value: formData.value,
        icon: formData.icon,
        is_active: formData.is_active ? 1 : 0,
        order: formData.order,
      };

      let response;
      if (editingStat) {
        response = await api.put(
          `/api/admin/stats/${editingStat.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        response = await api.post("/api/admin/stats", submitData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data.success) {
        setMessage({
          type: "success",
          text: editingStat
            ? language === "arabic"
              ? "تم تحديث الإحصائية بنجاح!"
              : "Statistic updated successfully!"
            : language === "arabic"
              ? "تم إضافة الإحصائية بنجاح!"
              : "Statistic added successfully!",
        });
        await fetchStats();
        handleCloseModal();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving statistic:", error);
      let errorMessage =
        language === "arabic"
          ? "فشل حفظ الإحصائية"
          : "Failed to save statistic";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: "error", text: errorMessage });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStat = async (id) => {
    if (
      window.confirm(
        language === "arabic"
          ? "هل أنت متأكد من حذف هذه الإحصائية؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete this statistic? This action cannot be undone.",
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`/api/admin/stats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setMessage({
            type: "success",
            text:
              language === "arabic"
                ? "تم حذف الإحصائية بنجاح!"
                : "Statistic deleted successfully!",
          });
          await fetchStats();
          setModifiedStats(new Set());
          setTimeout(() => setMessage(null), 3000);
        }
      } catch (error) {
        console.error("Error deleting statistic:", error);
        setMessage({
          type: "error",
          text:
            language === "arabic"
              ? "فشل حذف الإحصائية"
              : "Failed to delete statistic",
        });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    handleLocalFieldChange(id, "is_active", !currentStatus);
  };

  const handleReorder = async (reorderedStats) => {
    try {
      const token = localStorage.getItem("token");
      const orderData = reorderedStats.map((stat, index) => ({
        id: stat.id,
        order: index,
      }));

      const response = await api.post(
        "/api/admin/stats/reorder",
        { orders: orderData },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            language === "arabic"
              ? "تم تحديث الترتيب بنجاح!"
              : "Order updated successfully!",
        });
        await fetchStats();
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error reordering stats:", error);
      setMessage({
        type: "error",
        text:
          language === "arabic"
            ? "فشل تحديث الترتيب"
            : "Failed to update order",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newStats = [...stats];
      [newStats[index], newStats[index - 1]] = [
        newStats[index - 1],
        newStats[index],
      ];
      setStats(newStats);
      handleReorder(newStats);
    }
  };

  const handleMoveDown = (index) => {
    if (index < stats.length - 1) {
      const newStats = [...stats];
      [newStats[index], newStats[index + 1]] = [
        newStats[index + 1],
        newStats[index],
      ];
      setStats(newStats);
      handleReorder(newStats);
    }
  };

  const activeStats = stats.filter(
    (stat) => stat.is_active === 1 || stat.is_active === true,
  );

  const totalValue = stats.reduce((sum, stat) => {
    const numValue = parseInt(stat.value);
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lawyer-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === "arabic"
              ? "جاري تحميل الإحصائيات..."
              : "Loading statistics..."}
          </p>
        </div>
      </div>
    );
  }

  const hasChanges = modifiedStats.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart className="h-7 w-7 text-lawyer-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === "arabic" ? "أرقام التأثير" : "Impact Numbers"}
            </h1>
          </div>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "إدارة الإحصائيات والمقاييس المعروضة على موقعك"
              : "Manage statistics and metrics displayed on your website"}
          </p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <button
              onClick={handleSaveAllChanges}
              disabled={savingChanges}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md disabled:opacity-50"
            >
              {savingChanges ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {language === "arabic" ? "حفظ التغييرات" : "Save Changes"} (
                  {modifiedStats.size})
                </>
              )}
            </button>
          )}
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-lawyer-accent text-white px-5 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all transform hover:scale-105 shadow-md"
          >
            <Plus className="w-5 h-5" />
            {language === "arabic"
              ? "إضافة إحصائية جديدة"
              : "Add New Statistic"}
          </button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic"
                  ? "إجمالي الإحصائيات"
                  : "Total Statistics"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic"
                  ? "الإحصائيات النشطة"
                  : "Active Statistics"}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {activeStats.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic"
                  ? "قيمة التأثير الإجمالية"
                  : "Total Impact Value"}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalValue.toLocaleString()}+
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
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
                : message.type === "info"
                  ? "bg-blue-50 border border-blue-200 text-blue-700"
                  : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : message.type === "info" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {language === "arabic" ? "قائمة الإحصائيات" : "Statistics List"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === "arabic"
              ? 'قم بتحرير الإحصائيات أدناه، ثم انقر على "حفظ التغييرات" لتحديث الكل دفعة واحدة'
              : 'Edit statistics below, then click "Save Changes" to update all at once'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {language === "arabic" ? "الترتيب" : "Order"}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "الأيقونة" : "Icon"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "التسمية (EN)" : "Label (EN)"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "التسمية (AR)" : "Label (AR)"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "القيمة" : "Value"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "الحالة" : "Status"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                  <tr
                    key={stat.id}
                    className={`hover:bg-gray-50 transition-colors ${modifiedStats.has(stat.id) ? "bg-yellow-50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-8">
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === stats.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={stat.icon}
                          onChange={(e) =>
                            handleLocalFieldChange(
                              stat.id,
                              "icon",
                              e.target.value,
                            )
                          }
                          className="w-32 px-2 py-1 border rounded-lg focus:outline-none focus:border-lawyer-accent appearance-none bg-white"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <IconComponent className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={stat.label_english}
                        onChange={(e) =>
                          handleLocalFieldChange(
                            stat.id,
                            "label_english",
                            e.target.value,
                          )
                        }
                        className="w-full min-w-[200px] px-3 py-1.5 border rounded-lg focus:outline-none focus:border-lawyer-accent"
                        placeholder={
                          language === "arabic"
                            ? "التسمية بالإنجليزية"
                            : "English label"
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={stat.label_arabic}
                        onChange={(e) =>
                          handleLocalFieldChange(
                            stat.id,
                            "label_arabic",
                            e.target.value,
                          )
                        }
                        className="w-full min-w-[200px] px-3 py-1.5 border rounded-lg focus:outline-none focus:border-lawyer-accent text-right font-arabic"
                        placeholder={
                          language === "arabic"
                            ? "التسمية بالعربية"
                            : "Arabic label"
                        }
                        dir="rtl"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) =>
                          handleLocalFieldChange(
                            stat.id,
                            "value",
                            e.target.value,
                          )
                        }
                        className="w-28 px-3 py-1.5 border rounded-lg focus:outline-none focus:border-lawyer-accent"
                        placeholder={
                          language === "arabic" ? "مثال: 1000+" : "e.g., 1000+"
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleToggleStatus(stat.id, stat.is_active)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          stat.is_active ? "bg-lawyer-accent" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            stat.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteStat(stat.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title={language === "arabic" ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {stats.length === 0 && (
          <div className="p-12 text-center">
            <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === "arabic"
                ? "لم يتم العثور على إحصائيات"
                : "No statistics found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {language === "arabic"
                ? "انقر على الزر أعلاه لإضافة أول إحصائية لك"
                : "Click the button above to add your first statistic"}
            </p>
          </div>
        )}
      </div>

      {/* Live Preview Section */}
      {activeStats.length > 0 && (
        <div className="bg-gradient-to-r from-lawyer-primary to-lawyer-secondary rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-white" />
                <h3 className="text-xl font-bold text-white">
                  {language === "arabic" ? "معاينة مباشرة" : "Live Preview"}
                </h3>
              </div>
              <span className="text-xs text-white/70">
                {language === "arabic"
                  ? "معاينة فورية لإحصائياتك"
                  : "Real-time preview of your statistics"}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {activeStats.map((stat) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent className="w-12 h-12 text-white/90 transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {language === "arabic"
                        ? stat.label_arabic
                        : stat.label_english}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-lawyer-accent" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "arabic"
                      ? editingStat
                        ? "تحرير الإحصائية"
                        : "إضافة إحصائية جديدة"
                      : editingStat
                        ? "Edit Statistic"
                        : "Add New Statistic"}
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic" ? "الأيقونة *" : "Icon *"}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((icon) => {
                      const IconComponent = icon.component;
                      return (
                        <button
                          key={icon.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, icon: icon.value })
                          }
                          className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                            formData.icon === icon.value
                              ? "border-lawyer-accent bg-lawyer-accent/10 ring-2 ring-lawyer-accent/20"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          title={icon.label}
                        >
                          <IconComponent className="w-5 h-5 text-gray-700" />
                          <span className="text-xs text-gray-500 truncate max-w-full">
                            {icon.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "التسمية (إنجليزي) *"
                      : "Label (English) *"}
                  </label>
                  <input
                    type="text"
                    name="label_english"
                    value={formData.label_english}
                    onChange={handleFormChange}
                    placeholder={
                      language === "arabic"
                        ? "مثال: عملاء سعداء"
                        : "e.g., Happy Clients"
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "التسمية (عربي) *"
                      : "Label (Arabic) *"}
                  </label>
                  <input
                    type="text"
                    name="label_arabic"
                    value={formData.label_arabic}
                    onChange={handleFormChange}
                    placeholder={
                      language === "arabic"
                        ? "أدخل التسمية بالعربية"
                        : "Enter label in Arabic"
                    }
                    dir="rtl"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent font-arabic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic" ? "القيمة *" : "Value *"}
                  </label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleFormChange}
                    placeholder={
                      language === "arabic" ? "مثال: 1000+" : "e.g., 1000+"
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-lawyer-accent focus:ring-lawyer-accent"
                    />
                    <span className="text-gray-700 font-medium">
                      {language === "arabic"
                        ? "الحالة النشطة"
                        : "Active Status"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  {language === "arabic" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleSaveNewStat}
                  disabled={submitting}
                  className="flex-1 bg-lawyer-accent text-white px-4 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : editingStat ? (
                    language === "arabic" ? (
                      "تحديث"
                    ) : (
                      "Update"
                    )
                  ) : language === "arabic" ? (
                    "إضافة"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatsManagement;
