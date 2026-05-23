// src/dashboard/pages/ServicesManagement.jsx
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
  Globe, // Alternative for Passport (Immigration)
} from "lucide-react";

const ServicesManagement = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title_english: "",
    title_arabic: "",
    description_english: "",
    description_arabic: "",
    icon: "scale",
    is_featured: true,
    is_active: true,
    order: 0,
  });

  const iconOptions = [
    { component: Scale, label: "Balance Scale - Justice", value: "scale" },
    {
      component: Building,
      label: "Building - Court/Law Firm",
      value: "building",
    },
    {
      component: FileText,
      label: "Document - Legal Papers",
      value: "file-text",
    },
    {
      component: Briefcase,
      label: "Briefcase - Corporate Law",
      value: "briefcase",
    },
    { component: Lock, label: "Lock - Confidential/Security", value: "lock" },
    {
      component: Users,
      label: "Users - Family/Client Services",
      value: "users",
    },
    { component: Home, label: "Home - Real Estate Law", value: "home" },
    {
      component: Briefcase,
      label: "Professional Services",
      value: "professional",
    }, // Replaces Shirt
    {
      component: Globe,
      label: "Globe - Immigration/International",
      value: "globe",
    }, // Replaces Passport
    {
      component: Lightbulb,
      label: "Lightbulb - Legal Insights",
      value: "lightbulb",
    },
    {
      component: DollarSign,
      label: "Dollar - Financial/Tax Law",
      value: "dollar-sign",
    },
    {
      component: Handshake,
      label: "Handshake - Agreements",
      value: "handshake",
    },
    {
      component: BarChart,
      label: "Bar Chart - Legal Analytics",
      value: "bar-chart",
    },
  ];

  // Get icon component by value
  const getIconComponent = (iconValue) => {
    const icon = iconOptions.find((i) => i.value === iconValue);
    if (icon) return icon.component;
    // Default to Scale if not found
    return Scale;
  };

  // Fetch ALL services (both active and inactive) for dashboard management
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setMessage({ type: "error", text: "Failed to load services" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title_english: service.title_english || "",
        title_arabic: service.title_arabic || "",
        description_english: service.description_english || "",
        description_arabic: service.description_arabic || "",
        icon: service.icon || "scale",
        is_featured: service.is_featured || false,
        is_active: service.is_active !== undefined ? service.is_active : true,
        order: service.order || 0,
      });
    } else {
      setEditingService(null);
      setFormData({
        title_english: "",
        title_arabic: "",
        description_english: "",
        description_arabic: "",
        icon: "scale",
        is_featured: true,
        is_active: true,
        order: services.length,
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setImageFile(null);
    setFormData({
      title_english: "",
      title_arabic: "",
      description_english: "",
      description_arabic: "",
      icon: "scale",
      is_featured: true,
      is_active: true,
      order: services.length,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title_english ||
      !formData.title_arabic ||
      !formData.description_english ||
      !formData.description_arabic
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields (both English and Arabic)",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      let response;

      if (editingService) {
        const updateData = {
          title_english: formData.title_english,
          title_arabic: formData.title_arabic,
          description_english: formData.description_english,
          description_arabic: formData.description_arabic,
          icon: formData.icon,
          is_featured: formData.is_featured ? 1 : 0,
          is_active: formData.is_active ? 1 : 0,
          order: formData.order,
        };

        response = await api.put(
          `/api/admin/services/${editingService.id}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("title_english", formData.title_english);
        formDataToSend.append("title_arabic", formData.title_arabic);
        formDataToSend.append(
          "description_english",
          formData.description_english,
        );
        formDataToSend.append(
          "description_arabic",
          formData.description_arabic,
        );
        formDataToSend.append("icon", formData.icon);
        formDataToSend.append("is_featured", formData.is_featured ? 1 : 0);
        formDataToSend.append("is_active", formData.is_active ? 1 : 0);
        formDataToSend.append("order", formData.order);

        if (imageFile) {
          formDataToSend.append("featured_image", imageFile);
        }

        response = await api.post("/api/admin/services", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data.success) {
        setMessage({
          type: "success",
          text: editingService
            ? "Service updated successfully!"
            : "Service added successfully!",
        });
        fetchServices();
        handleCloseModal();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      let errorMessage = "Failed to save service";
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

  const handleDelete = async (id) => {
    if (
      window.confirm(
        language === "arabic"
          ? "هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete this service? This action cannot be undone.",
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`/api/admin/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setMessage({
            type: "success",
            text: "Service deleted successfully!",
          });
          fetchServices();
          setTimeout(() => setMessage(null), 3000);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        setMessage({ type: "error", text: "Failed to delete service" });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/api/admin/services/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Status updated successfully!" });
        fetchServices();
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setMessage({ type: "error", text: "Failed to update status" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/api/admin/services/${id}/toggle-featured`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Featured status updated successfully!",
        });
        fetchServices();
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      setMessage({ type: "error", text: "Failed to update featured status" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReorder = async (reorderedServices) => {
    try {
      const token = localStorage.getItem("token");
      const orderData = reorderedServices.map((service, index) => ({
        id: service.id,
        order: index + 1,
      }));

      const response = await api.post(
        "/api/admin/services/reorder",
        { orders: orderData },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Order updated successfully!" });
        fetchServices();
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error reordering services:", error);
      setMessage({ type: "error", text: "Failed to update order" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newServices = [...services];
      [newServices[index], newServices[index - 1]] = [
        newServices[index - 1],
        newServices[index],
      ];
      setServices(newServices);
      handleReorder(newServices);
    }
  };

  const handleMoveDown = (index) => {
    if (index < services.length - 1) {
      const newServices = [...services];
      [newServices[index], newServices[index + 1]] = [
        newServices[index + 1],
        newServices[index],
      ];
      setServices(newServices);
      handleReorder(newServices);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchTerm === "" ||
      service.title_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.title_arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description_english
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && service.is_active) ||
      (filterStatus === "inactive" && !service.is_active);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: services.length,
    active: services.filter((s) => s.is_active).length,
    featured: services.filter((s) => s.is_featured).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lawyer-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-lawyer-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === "arabic" ? "الخدمات القانونية" : "Legal Services"}
            </h1>
          </div>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "قم بإدارة خدماتك القانونية الرئيسية (يتم عرض الخدمات النشطة وغير النشطة هنا)"
              : "Manage your main legal services (Both active and inactive services are shown here)"}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-lawyer-accent text-white px-5 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all transform hover:scale-105 shadow-md"
        >
          <Plus className="w-5 h-5" />
          {language === "arabic" ? "إضافة خدمة جديدة" : "Add New Service"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "إجمالي الخدمات" : "Total Services"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "الخدمات النشطة" : "Active Services"}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
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
                  ? "الخدمات المميزة"
                  : "Featured Services"}
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.featured}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
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

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                language === "arabic"
                  ? "ابحث عن الخدمات حسب العنوان (إنجليزي/عربي) أو الوصف..."
                  : "Search services by title (English/Arabic) or description..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent bg-white"
          >
            <option value="all">
              {language === "arabic" ? "جميع الخدمات" : "All Services"}
            </option>
            <option value="active">
              {language === "arabic" ? "النشطة فقط" : "Active Only"}
            </option>
            <option value="inactive">
              {language === "arabic" ? "غير النشطة فقط" : "Inactive Only"}
            </option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  {language === "arabic"
                    ? "العنوان (EN / AR)"
                    : "Title (EN / AR)"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === "arabic" ? "الوصف" : "Description"}
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
              {filteredServices.map((service, index) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 transition-colors"
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
                            disabled={index === filteredServices.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <IconComponent className="w-6 h-6 text-lawyer-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {service.title_english}
                        </div>
                        <div
                          className="text-sm text-gray-600 font-arabic"
                          dir="rtl"
                        >
                          {service.title_arabic}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {service.description_english}
                        </p>
                        <p
                          className="text-sm text-gray-500 mt-1 line-clamp-2 font-arabic"
                          dir="rtl"
                        >
                          {service.description_arabic}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleToggleStatus(service.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            service.is_active
                              ? "bg-lawyer-accent"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              service.is_active
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(service.id)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1 justify-center ${
                            service.is_featured
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <Star className="w-3 h-3" />
                          {language === "arabic"
                            ? service.is_featured
                              ? "مميز"
                              : "تعيين كمميز"
                            : service.is_featured
                              ? "Featured"
                              : "Set Featured"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Delete"
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

        {filteredServices.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === "arabic"
                ? "لم يتم العثور على خدمات"
                : "No services found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? language === "arabic"
                  ? "حاول تعديل البحث أو معايير التصفية"
                  : "Try adjusting your search or filter criteria"
                : language === "arabic"
                  ? "اضغط على الزر أعلاه لإضافة خدمتك الأولى"
                  : "Click the button above to add your first service"}
            </p>
          </div>
        )}
      </div>

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
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-lawyer-accent" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === "arabic"
                        ? editingService
                          ? "تحرير الخدمة"
                          : "إضافة خدمة جديدة"
                        : editingService
                          ? "Edit Service"
                          : "Add New Service"}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic"
                      ? "أيقونة الخدمة *"
                      : "Service Icon *"}
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((icon) => {
                      const IconComponent = icon.component;
                      return (
                        <button
                          key={icon.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, icon: icon.value })
                          }
                          className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                            formData.icon === icon.value
                              ? "border-lawyer-accent bg-lawyer-accent/10 ring-2 ring-lawyer-accent/20"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          title={icon.label}
                        >
                          <IconComponent className="w-6 h-6 text-gray-700" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "العنوان (بالإنجليزية) *"
                        : "Title (English) *"}
                    </label>
                    <input
                      type="text"
                      value={formData.title_english}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title_english: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20"
                      placeholder={
                        language === "arabic"
                          ? "أدخل عنوان الخدمة باللغة الإنجليزية"
                          : "Enter service title in English"
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "العنوان (بالعربية) *"
                        : "Title (Arabic) *"}
                    </label>
                    <input
                      type="text"
                      value={formData.title_arabic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title_arabic: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent text-right font-arabic"
                      placeholder={
                        language === "arabic"
                          ? "أدخل عنوان الخدمة بالعربية"
                          : "Enter service title in Arabic"
                      }
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "الوصف (بالإنجليزية) *"
                        : "Description (English) *"}
                    </label>
                    <textarea
                      value={formData.description_english}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description_english: e.target.value,
                        })
                      }
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none"
                      placeholder={
                        language === "arabic"
                          ? "أدخل وصفًا تفصيليًا باللغة الإنجليزية"
                          : "Enter detailed description in English"
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "الوصف (بالعربية) *"
                        : "Description (Arabic) *"}
                    </label>
                    <textarea
                      value={formData.description_arabic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description_arabic: e.target.value,
                        })
                      }
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent resize-none text-right font-arabic"
                      placeholder={
                        language === "arabic"
                          ? "أدخل الوصف التفصيلي بالعربية"
                          : "Enter detailed description in Arabic"
                      }
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                {!editingService && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "الصورة المميزة"
                        : "Featured Image"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "arabic"
                        ? "اختياري. الحجم الموصى به: 800 × 600 بكسل"
                        : "Optional. Recommended size: 800x600px"}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-lawyer-accent focus:ring-lawyer-accent"
                    />
                    <label
                      htmlFor="is_featured"
                      className="text-gray-700 font-medium cursor-pointer flex items-center gap-1"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                      {language === "arabic"
                        ? "وضع علامة كخدمة مميزة (تظهر في الصفحة الرئيسية)"
                        : "Mark as Featured Service (shows on homepage)"}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-lawyer-accent focus:ring-lawyer-accent"
                    />
                    <label
                      htmlFor="is_active"
                      className="text-gray-700 font-medium cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {language === "arabic"
                        ? "نشط (مرئي على الموقع)"
                        : "Active (visible on website)"}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {language === "arabic" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-lawyer-accent text-white px-4 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : editingService ? (
                      language === "arabic" ? (
                        "تحديث الخدمة"
                      ) : (
                        "Update Service"
                      )
                    ) : language === "arabic" ? (
                      "إضافة خدمة"
                    ) : (
                      "Add Service"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesManagement;
