// src/dashboard/pages/ContactMessages.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";

const ContactMessages = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await apiService.getContactMessages();
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-mark as read when selected
  useEffect(() => {
    if (selectedMessage && !selectedMessage.is_read) {
      handleMarkAsRead(selectedMessage.id);
    }
  }, [selectedMessage]);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await apiService.markMessageAsRead(id);
      if (response.data.success) {
        setMessages(
          messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read: true });
        }
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleReply = async (id, reply) => {
    try {
      const response = await apiService.replyToMessage(id, reply);
      if (response.data.success) {
        setShowReplyModal(false);
        setReplyMessage("");
        setReplyingTo(null);
        alert(
          language === "arabic"
            ? "تم إرسال الرد بنجاح"
            : "Reply sent successfully",
        );
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert(language === "arabic" ? "فشل إرسال الرد" : "Failed to send reply");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiService.deleteContactMessage(id);
      if (response.data.success) {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        setIsDeleteModalOpen(false);
        setMessageToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleBulkDelete = async () => {
    const filteredIds = filteredMessages.map((m) => m.id);
    try {
      const response = await apiService.bulkDeleteContactMessages({
        ids: filteredIds,
      });
      if (response.data.success) {
        setMessages(messages.filter((m) => !filteredIds.includes(m.id)));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error bulk deleting:", error);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      filter === "all" ? true : filter === "unread" ? !m.is_read : m.is_read;
    const matchesSearch =
      searchTerm === "" ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.message && m.message.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return language === "arabic" ? "أمس" : "Yesterday";
    if (diffDays < 7)
      return `${diffDays} ${language === "arabic" ? "أيام مضت" : "days ago"}`;
    return date.toLocaleDateString(language === "arabic" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => !m.is_read).length,
    read: messages.filter((m) => m.is_read).length,
  };

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
            {language === "arabic" ? "رسائل الاتصال" : "Contact Messages"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {language === "arabic"
              ? "عرض وإدارة الرسائل من زوار موقعك"
              : "View and manage messages from your website visitors"}
          </p>
        </div>
        {filteredMessages.length > 0 && filter !== "all" && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
            {language === "arabic" ? "حذف جميع المصفاة" : "Delete All Filtered"}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "الإجمالي" : "Total"}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "غير مقروءة" : "Unread"}
              </p>
              <p className="text-2xl font-bold text-lawyer-accent">
                {stats.unread}
              </p>
            </div>
            <div className="w-10 h-10 bg-lawyer-accent/10 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-lawyer-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === "arabic" ? "مقروءة" : "Read"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
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
                    ? "بحث في الرسائل..."
                    : "Search messages..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-lawyer-accent text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {language === "arabic" ? "الكل" : "All"} ({stats.total})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "unread"
                    ? "bg-lawyer-accent text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {language === "arabic" ? "غير مقروءة" : "Unread"} (
                {stats.unread})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "read"
                    ? "bg-lawyer-accent text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {language === "arabic" ? "مقروءة" : "Read"} ({stats.read})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            <AnimatePresence>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-all ${
                      selectedMessage?.id === message.id
                        ? "bg-gray-50 border-l-4 border-lawyer-accent"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">
                            {message.name}
                          </h3>
                          {!message.is_read && (
                            <span className="w-2 h-2 bg-lawyer-accent rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {message.message}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-gray-500 mt-2">
                    {language === "arabic"
                      ? "لا توجد رسائل"
                      : "No messages found"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {selectedMessage.name}
                      </h2>
                    </div>
                    <p className="text-gray-600">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-gray-600 mt-1">
                        {selectedMessage.phone}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm mt-2">
                      {language === "arabic" ? "تاريخ الاستلام:" : "Received:"}{" "}
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setReplyingTo(selectedMessage);
                        setShowReplyModal(true);
                      }}
                      className="px-3 py-1.5 text-sm bg-lawyer-accent text-white rounded-lg hover:bg-lawyer-primary transition-colors"
                    >
                      {language === "arabic" ? "رد" : "Reply"}
                    </button>
                    <button
                      onClick={() => {
                        setMessageToDelete(selectedMessage.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      {language === "arabic" ? "حذف" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {language === "arabic" ? "الرسالة:" : "Message:"}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      (window.location.href = `mailto:${selectedMessage.email}`)
                    }
                    className="flex-1 bg-lawyer-accent text-white px-4 py-2.5 rounded-lg hover:bg-lawyer-primary transition-all transform hover:scale-105 flex items-center justify-center gap-2"
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {language === "arabic"
                      ? "رد عبر البريد"
                      : "Reply via Email"}
                  </button>
                  {selectedMessage.phone && (
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${selectedMessage.phone}`)
                      }
                      className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {language === "arabic" ? "اتصال" : "Call Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-20 h-20 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                {language === "arabic"
                  ? "اختر رسالة لعرض التفاصيل"
                  : "Select a message to view details"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {language === "arabic"
                  ? "انقر على أي رسالة من القائمة لقراءتها"
                  : "Click on any message from the list to read it"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && replyingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === "arabic"
                    ? "رد على الرسالة"
                    : "Reply to Message"}
                </h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">
                  From: {replyingTo.email}
                </p>
                <p className="text-sm text-gray-600">{replyingTo.message}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  {language === "arabic" ? "الرد" : "Your Reply"}
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent"
                  placeholder={
                    language === "arabic"
                      ? "اكتب ردك هنا..."
                      : "Type your reply here..."
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReply(replyingTo.id, replyMessage)}
                  className="flex-1 bg-lawyer-accent text-white px-4 py-2 rounded-lg hover:bg-lawyer-primary transition-colors"
                >
                  {language === "arabic" ? "إرسال الرد" : "Send Reply"}
                </button>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === "arabic" ? "إلغاء" : "Cancel"}
                </button>
              </div>
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
                  {language === "arabic" ? "حذف الرسالة" : "Delete Message"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "arabic"
                    ? "هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء."
                    : "Are you sure you want to delete this message? This action cannot be undone."}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {language === "arabic" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={() => handleDelete(messageToDelete)}
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

export default ContactMessages;
