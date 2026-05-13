// src/dashboard/pages/StatsManagement.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const StatsManagement = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [modifiedStats, setModifiedStats] = useState(new Set()); // Track modified stats
  const [formData, setFormData] = useState({
    label_english: "",
    label_arabic: "",
    value: "",
    icon: "📊",
    is_active: true,
    order: 0,
  });

  const iconOptions = [
    "📅",
    "👥",
    "⚖️",
    "👨‍⚖️",
    "🎯",
    "⭐",
    "🏆",
    "💼",
    "🌍",
    "📊",
    "📈",
    "💡",
    "🤝",
    "🎓",
    "🚀",
    "💪",
  ];

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
        icon: stat.icon || "📊",
        is_active: stat.is_active === 1 || stat.is_active === true,
        order: stat.order || 0,
      });
    } else {
      setEditingStat(null);
      setFormData({
        label_english: "",
        label_arabic: "",
        value: "",
        icon: "📊",
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

  // Track field changes for inline editing
  const handleLocalFieldChange = (id, field, value) => {
    setStats(
      stats.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat,
      ),
    );
    setModifiedStats((prev) => new Set([...prev, id]));
  };

  // Save all changes
  const handleSaveAllChanges = async () => {
    if (modifiedStats.size === 0) {
      setMessage({ type: "info", text: "No changes to save" });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setSavingChanges(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const token = localStorage.getItem("token");

      // Save each modified stat
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
          text: `${successCount} statistic(s) updated successfully!${errorCount > 0 ? ` ${errorCount} failed.` : ""}`,
        });
        setModifiedStats(new Set());
        await fetchStats(); // Refresh data
      } else if (errorCount > 0) {
        setMessage({ type: "error", text: "Failed to save changes" });
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage({ type: "error", text: "Failed to save changes" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleSaveNewStat = async () => {
    if (!formData.label_english || !formData.label_arabic || !formData.value) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields (English & Arabic labels, and value)",
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
            ? "Statistic updated successfully!"
            : "Statistic added successfully!",
        });
        await fetchStats();
        handleCloseModal();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving statistic:", error);
      let errorMessage = "Failed to save statistic";
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
        "Are you sure you want to delete this statistic? This action cannot be undone.",
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
            text: "Statistic deleted successfully!",
          });
          await fetchStats();
          setModifiedStats(new Set());
          setTimeout(() => setMessage(null), 3000);
        }
      } catch (error) {
        console.error("Error deleting statistic:", error);
        setMessage({ type: "error", text: "Failed to delete statistic" });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    // Update locally first
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
        setMessage({ type: "success", text: "Order updated successfully!" });
        await fetchStats();
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Error reordering stats:", error);
      setMessage({ type: "error", text: "Failed to update order" });
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
          <p className="mt-4 text-gray-600">Loading statistics...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Impact Numbers
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage statistics and metrics displayed on your website
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
                  Saving...
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
                  Save Changes ({modifiedStats.size})
                </>
              )}
            </button>
          )}
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-lawyer-accent text-white px-5 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all transform hover:scale-105 shadow-md"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Statistic
          </button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Statistics</p>
              <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Statistics</p>
              <p className="text-2xl font-bold text-green-600">
                {activeStats.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Impact Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalValue.toLocaleString()}+
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
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
              {message.type === "success"
                ? "✓"
                : message.type === "info"
                  ? "ℹ️"
                  : "⚠️"}{" "}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Statistics List</h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit statistics below, then click "Save Changes" to update all at
            once
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label (EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label (AR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.map((stat, index) => (
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
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === stats.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={stat.icon}
                      onChange={(e) =>
                        handleLocalFieldChange(stat.id, "icon", e.target.value)
                      }
                      className="w-20 px-2 py-1 border rounded-lg text-center text-2xl focus:outline-none focus:border-lawyer-accent"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
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
                      placeholder="English label"
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
                      placeholder="Arabic label"
                      dir="rtl"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) =>
                        handleLocalFieldChange(stat.id, "value", e.target.value)
                      }
                      className="w-28 px-3 py-1.5 border rounded-lg focus:outline-none focus:border-lawyer-accent"
                      placeholder="e.g., 1000+"
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
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stats.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No statistics found
            </h3>
            <p className="text-gray-500 mb-4">
              Click the button above to add your first statistic
            </p>
          </div>
        )}
      </div>

      {/* Live Preview Section */}
      {activeStats.length > 0 && (
        <div className="bg-gradient-to-r from-lawyer-primary to-lawyer-secondary rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Live Preview</h3>
              <span className="text-xs text-white/70">
                Real-time preview of your statistics
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {activeStats.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group"
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {stat.label_english}
                  </div>
                </motion.div>
              ))}
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStat ? "Edit Statistic" : "Add New Statistic"}
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Icon *
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`text-2xl p-2 rounded-lg border transition-all ${
                          formData.icon === icon
                            ? "border-lawyer-accent bg-lawyer-accent/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Label (English) *
                  </label>
                  <input
                    type="text"
                    name="label_english"
                    value={formData.label_english}
                    onChange={handleFormChange}
                    placeholder="e.g., Happy Clients"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Label (Arabic) *
                  </label>
                  <input
                    type="text"
                    name="label_arabic"
                    value={formData.label_arabic}
                    onChange={handleFormChange}
                    placeholder="أدخل التسمية بالعربية"
                    dir="rtl"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent font-arabic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Value *
                  </label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleFormChange}
                    placeholder="e.g., 1000+"
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
                      Active Status
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewStat}
                  disabled={submitting}
                  className="flex-1 bg-lawyer-accent text-white px-4 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : editingStat ? (
                    "Update"
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
