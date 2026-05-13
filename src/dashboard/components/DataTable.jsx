// src/dashboard/components/DataTable.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  itemsPerPage = 10,
}) => {
  const { language, isRTL } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter data
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-lg ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* Search Bar */}
      <div
        className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${isRTL ? "sm:flex-row-reverse" : ""}`}
      >
        <div className="relative flex-1 max-w-sm">
          <svg
            className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${isRTL ? "right-3" : "left-3"}`}
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
            placeholder={language === "arabic" ? "بحث..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-lg border border-gray-300 py-2 pr-10 focus:border-lawyer-accent focus:outline-none focus:ring-2 focus:ring-lawyer-accent ${
              isRTL ? "pl-4" : "pl-10 pr-4"
            }`}
          />
        </div>
        <div className="text-sm text-gray-500">
          {language === "arabic"
            ? `عرض ${paginatedData.length} من ${filteredData.length} إدخالات`
            : `Showing ${paginatedData.length} of ${filteredData.length} entries`}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                    col.sortable !== false
                      ? "cursor-pointer hover:text-lawyer-accent"
                      : ""
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {col.label}
                    {sortColumn === col.key && (
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
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
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th
                  className={`px-4 py-3 text-sm font-semibold text-gray-700 ${isRTL ? "text-left" : "text-right"}`}
                >
                  {language === "arabic" ? "الإجراءات" : "Actions"}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td
                      className={`px-4 py-3 ${isRTL ? "text-left" : "text-right"}`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50"
                            title={language === "arabic" ? "عرض" : "View"}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="rounded-lg p-1.5 text-green-500 transition-colors hover:bg-green-50"
                            title={language === "arabic" ? "تعديل" : "Edit"}
                          >
                            <svg
                              className="h-4 w-4"
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
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                            title={language === "arabic" ? "حذف" : "Delete"}
                          >
                            <svg
                              className="h-4 w-4"
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
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`mt-6 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            {language === "arabic" ? "السابق" : "Previous"}
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-sm transition-colors ${
                  currentPage === page
                    ? "bg-lawyer-accent text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            {language === "arabic" ? "التالي" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
