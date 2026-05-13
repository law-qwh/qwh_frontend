// src/dashboard/pages/TeamManagement.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";

const TeamManagement = () => {
  const { language } = useLanguage();
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [formData, setFormData] = useState({
    name_english: "",
    name_arabic: "",
    position_english: "",
    position_arabic: "",
    specialty_english: "",
    specialty_arabic: "",
    experience_years: "",
    email: "",
    linkedin_url: "",
    image: null,
    order: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch team members on mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllTeamMembers();
      if (response.data.success) {
        // Ensure each member has the correct image URL
        const members = response.data.data.map((member) => ({
          ...member,
          image: member.image_path
            ? `${import.meta.env.VITE_API_URL || ""}/storage/${member.image_path}`
            : null,
        }));
        setTeam(members);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setMessage({ type: "error", text: "Failed to load team members" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name_english: member.name_english || "",
        name_arabic: member.name_arabic || "",
        position_english: member.position_english || "",
        position_arabic: member.position_arabic || "",
        specialty_english: member.specialty_english || "",
        specialty_arabic: member.specialty_arabic || "",
        experience_years: member.experience_years || "",
        email: member.email || "",
        linkedin_url: member.linkedin_url || "",
        image: null,
        order: member.order || 0,
        is_active: member.is_active === 1 || member.is_active === true,
      });
      setImagePreview(member.image || "");
      setImageFile(null);
    } else {
      setEditingMember(null);
      setFormData({
        name_english: "",
        name_arabic: "",
        position_english: "",
        position_arabic: "",
        specialty_english: "",
        specialty_arabic: "",
        experience_years: "",
        email: "",
        linkedin_url: "",
        image: null,
        order: team.length,
        is_active: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  // Update the handleSubmit function in TeamManagement.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMember) {
        // Update existing member
        const updateData = {
          name_english: formData.name_english,
          name_arabic: formData.name_arabic,
          position_english: formData.position_english,
          position_arabic: formData.position_arabic,
          specialty_english: formData.specialty_english,
          specialty_arabic: formData.specialty_arabic,
          experience_years: parseInt(formData.experience_years),
          email: formData.email,
          linkedin_url: formData.linkedin_url || null,
          order: parseInt(formData.order) || 0,
          is_active: formData.is_active ? 1 : 0,
        };

        console.log("Update data being sent:", updateData);

        // Upload image separately if changed
        if (imageFile) {
          await apiService.uploadTeamMemberImage(editingMember.id, imageFile);
        }

        const response = await apiService.updateTeamMember(
          editingMember.id,
          updateData,
        );

        if (response.data.success) {
          setMessage({
            type: "success",
            text: "Team member updated successfully!",
          });
          fetchTeamMembers();
          setIsModalOpen(false);
        }
      } else {
        // Create new member
        const formDataToSend = new FormData();
        formDataToSend.append("name_english", formData.name_english);
        formDataToSend.append("name_arabic", formData.name_arabic);
        formDataToSend.append("position_english", formData.position_english);
        formDataToSend.append("position_arabic", formData.position_arabic);
        formDataToSend.append("specialty_english", formData.specialty_english);
        formDataToSend.append("specialty_arabic", formData.specialty_arabic);
        formDataToSend.append(
          "experience_years",
          parseInt(formData.experience_years),
        );
        formDataToSend.append("email", formData.email);
        formDataToSend.append("linkedin_url", formData.linkedin_url || "");
        formDataToSend.append("order", parseInt(formData.order) || 0);
        formDataToSend.append("is_active", formData.is_active ? 1 : 0);
        formDataToSend.append("is_active", formData.is_active ? 1 : 0);

        if (imageFile) {
          formDataToSend.append("image", imageFile);
        }

        console.log("FormData being sent:", [...formDataToSend.entries()]);

        const response = await apiService.createTeamMember(formDataToSend);

        if (response.data.success) {
          setMessage({
            type: "success",
            text: "Team member added successfully!",
          });
          fetchTeamMembers();
          setIsModalOpen(false);
        }
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving team member:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Failed to save team member";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: "error", text: errorMessage });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiService.deleteTeamMember(id);
      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Team member deleted successfully!",
        });
        fetchTeamMembers();
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      setMessage({ type: "error", text: "Failed to delete team member" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await apiService.toggleTeamMemberStatus(id);
      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Status updated successfully!",
        });
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setMessage({ type: "error", text: "Failed to update status" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredTeam = team
    .filter((member) => {
      const matchesSearch =
        searchTerm === "" ||
        member.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.name_arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position_english
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.specialty_english
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        filterSpecialty === "all" ||
        member.specialty_english === filterSpecialty;

      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => a.order - b.order);

  const stats = {
    total: team.length,
    active: team.filter((m) => m.is_active).length,
    specialties: [...new Set(team.map((m) => m.specialty_english))].length,
  };

  const specialties = [...new Set(team.map((m) => m.specialty_english))];

  if (loading && team.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lawyer-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team members...</p>
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
            {language === "arabic" ? "إدارة الفريق" : "Team Management"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "إدارة أعضاء فريق الخبراء ومعلوماتهم"
              : "Manage your expert team members and their information"}
          </p>
        </div>
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
          {language === "arabic" ? "إضافة عضو" : "Add Team Member"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "إجمالي الأعضاء" : "Total Members"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "الأعضاء النشطون" : "Active Members"}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "التخصصات" : "Specialties"}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.specialties}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={
                language === "arabic"
                  ? "بحث بالاسم أو المنصب أو التخصص..."
                  : "Search by name, position, or specialty..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20"
            />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent bg-white"
          >
            <option key="all" value="all">
              {language === "arabic" ? "جميع التخصصات" : "All Specialties"}
            </option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
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
              {message.type === "success" ? "✓" : "⚠️"} {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Grid */}
      {filteredTeam.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={
                    member.image ||
                    member.image_path ||
                    "https://via.placeholder.com/400x400?text=Team+Member"
                  }
                  alt={member.name_english}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=Team+Member";
                  }}
                />
                {!member.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                      {language === "arabic" ? "غير نشط" : "Inactive"}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() =>
                      handleToggleStatus(member.id, member.is_active)
                    }
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg hover:bg-white transition-colors"
                    title={
                      member.is_active
                        ? language === "arabic"
                          ? "إلغاء التنشيط"
                          : "Deactivate"
                        : language === "arabic"
                          ? "تنشيط"
                          : "Activate"
                    }
                  >
                    {member.is_active ? (
                      <svg
                        className="w-4 h-4 text-green-600"
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
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === "arabic"
                    ? member.name_arabic
                    : member.name_english}
                </h3>
                <p className="text-lawyer-accent font-semibold text-sm mt-1">
                  {language === "arabic"
                    ? member.position_arabic
                    : member.position_english}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {language === "arabic"
                    ? member.specialty_arabic
                    : member.specialty_english}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  📅 {member.experience_years}{" "}
                  {language === "arabic" ? "سنوات خبرة" : "years experience"}
                </p>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 text-sm transition-colors flex items-center justify-center gap-1"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {language === "arabic" ? "تعديل" : "Edit"}
                  </button>
                  <button
                    onClick={() => {
                      setMemberToDelete(member.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm transition-colors flex items-center justify-center gap-1"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {language === "arabic" ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <svg
            className="w-20 h-20 mx-auto text-gray-300"
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
          <h3 className="text-xl font-bold text-gray-900 mt-4">
            {language === "arabic"
              ? "لا يوجد أعضاء في الفريق"
              : "No team members found"}
          </h3>
          <p className="text-gray-500 mt-2">
            {language === "arabic"
              ? "حاول تعديل بحثك أو أضف عضو جديد"
              : "Try adjusting your search or add a new team member"}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center gap-2 bg-lawyer-accent text-white px-4 py-2 rounded-lg hover:bg-lawyer-primary transition-colors"
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
            {language === "arabic" ? "إضافة عضو فريق" : "Add Team Member"}
          </button>
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
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingMember
                      ? language === "arabic"
                        ? "تعديل عضو الفريق"
                        : "Edit Team Member"
                      : language === "arabic"
                        ? "إضافة عضو جديد"
                        : "Add New Team Member"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "arabic" ? "الصورة الشخصية" : "Profile Image"}
                  </label>
                  <div
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-lawyer-accent transition-colors"
                  >
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover mx-auto"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview("");
                            setImageFile(null);
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
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
                          {language === "arabic"
                            ? "انقر لرفع الصورة (حد أقصى 2 ميجابايت)"
                            : "Click to upload image (max 2MB)"}
                        </p>
                      </>
                    )}
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "الاسم (إنجليزي)"
                        : "Name (English)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="name_english"
                      value={formData.name_english}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic" ? "الاسم (عربي)" : "Name (Arabic)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="name_arabic"
                      value={formData.name_arabic}
                      onChange={handleChange}
                      dir="rtl"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "المنصب (إنجليزي)"
                        : "Position (English)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="position_english"
                      value={formData.position_english}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "المنصب (عربي)"
                        : "Position (Arabic)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="position_arabic"
                      value={formData.position_arabic}
                      onChange={handleChange}
                      dir="rtl"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "التخصص (إنجليزي)"
                        : "Specialty (English)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="specialty_english"
                      value={formData.specialty_english}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "التخصص (عربي)"
                        : "Specialty (Arabic)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="specialty_arabic"
                      value={formData.specialty_arabic}
                      onChange={handleChange}
                      dir="rtl"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic"
                        ? "سنوات الخبرة"
                        : "Experience Years"}{" "}
                      *
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic" ? "البريد الإلكتروني" : "Email"} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      {language === "arabic" ? "رابط LinkedIn" : "LinkedIn URL"}
                    </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-lawyer-accent focus:ring-lawyer-accent"
                      />
                      <span className="text-gray-700 font-medium">
                        {language === "arabic"
                          ? "الحالة نشطة"
                          : "Active Status"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {language === "arabic" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-lawyer-accent text-white px-4 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {language === "arabic" ? "جاري الحفظ..." : "Saving..."}
                      </div>
                    ) : editingMember ? (
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
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "arabic"
                    ? "حذف عضو الفريق"
                    : "Delete Team Member"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "arabic"
                    ? "هل أنت متأكد من حذف هذا العضو؟ لا يمكن التراجع عن هذا الإجراء."
                    : "Are you sure you want to delete this team member? This action cannot be undone."}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {language === "arabic" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={() => handleDelete(memberToDelete)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    {language === "arabic" ? "حذف" : "Delete"}
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

export default TeamManagement;
