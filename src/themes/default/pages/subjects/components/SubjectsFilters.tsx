/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/subjects/components/SubjectsFilters.tsx

import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from "lucide-react";
import { SubjectsFiltersProps } from "../SubjectsPage.types";

export const SubjectsFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedStageId,
  setSelectedStageId,
  showFilters,
  setShowFilters,
  stages,
  totalResults,
  lang,
  pick,
  resetFilters,
  clearStageFilter,
  primaryGradient,
  inputBg,
  cardBorder,
  badgeBg,
}: SubjectsFiltersProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
            showFilters 
              ? `bg-gradient-to-r ${primaryGradient} text-white border-transparent`
              : `${inputBg} ${cardBorder} hover:border-blue-400`
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">
            {lang === "ar" ? "فلترة" : "Filter"}
          </span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`${inputBg} ${cardBorder} border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 text-gray-900 dark:text-white`}
        >
          <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
          <option value="name_asc">{lang === "ar" ? "الاسم (أ-ي)" : "Name (A-Z)"}</option>
          <option value="name_desc">{lang === "ar" ? "الاسم (ي-أ)" : "Name (Z-A)"}</option>
        </select>

        {selectedStageId && (
          <button
            onClick={clearStageFilter}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${badgeBg}`}
          >
            {stages.find((s: any) => s.id === parseInt(selectedStageId))?.name}
            <X className="w-3 h-3 cursor-pointer" />
          </button>
        )}

        <div className={`text-sm px-3 py-1.5 rounded-full ${badgeBg}`}>
          {totalResults} {lang === "ar" ? "مادة" : "subjects"}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`mt-4 p-5 rounded-xl border ${inputBg} ${cardBorder}`}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {lang === "ar" ? "فلترة حسب المرحلة" : "Filter by Stage"}
                </h4>
                {selectedStageId && (
                  <button
                    onClick={clearStageFilter}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {lang === "ar" ? "إزالة الفلتر" : "Clear filter"}
                  </button>
                )}
              </div>

              {stages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStageId("")}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      !selectedStageId
                        ? `bg-gradient-to-r ${primaryGradient} text-white`
                        : `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`
                    }`}
                  >
                    {lang === "ar" ? "الكل" : "All"}
                  </button>
                  {stages.map((stage: any) => (
                    <button
                      key={stage.id}
                      onClick={() => setSelectedStageId(stage.id.toString())}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedStageId === stage.id.toString()
                          ? `bg-gradient-to-r ${primaryGradient} text-white`
                          : `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`
                      }`}
                    >
                      {pick(stage.name, stage.name_ar)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lang === "ar" ? "لا توجد مراحل" : "No stages available"}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  {lang === "ar" ? "إعادة ضبط" : "Reset All"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};