// src/pages/stages/components/StagesFilters.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp, Users, Trophy, Award } from "lucide-react";
import { StagesFiltersProps } from "../StagesPage.types";

const PlayCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const StagesFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  selectedFeatures,
  setSelectedFeatures,
  totalResults,
  lang,
  resetFilters,
}: StagesFiltersProps) => {
  const availableFeatures = [
    { id: "live_support", label_ar: "دعم مباشر", label_en: "Live Support", icon: Users },
    { id: "video_lessons", label_ar: "دروس فيديو", label_en: "Video Lessons", icon: PlayCircle },
    { id: "exams", label_ar: "اختبارات", label_en: "Exams", icon: Trophy },
    { id: "certificate", label_ar: "شهادة معتمدة", label_en: "Certificate", icon: Award },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن مرحلة..." : "Search for a stage..."}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-blue-600" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
            showFilters 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-400'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">
            {lang === "ar" ? "فلترة" : "Filter"}
          </span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {lang === "ar" ? "ترتيب حسب:" : "Sort by:"}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
        >
          <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
          <option value="name_asc">{lang === "ar" ? "الاسم (أ-ي)" : "Name (A-Z)"}</option>
          <option value="name_desc">{lang === "ar" ? "الاسم (ي-أ)" : "Name (Z-A)"}</option>
          <option value="courses_desc">{lang === "ar" ? "الأكثر كورسات" : "Most Courses"}</option>
          <option value="courses_asc">{lang === "ar" ? "الأقل كورسات" : "Least Courses"}</option>
        </select>

        <div className="text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full">
          {totalResults} {lang === "ar" ? "مرحلة" : "stages"}
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
            <div className="mt-4 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h4 className="font-semibold">{lang === "ar" ? "فلترة حسب الميزات" : "Filter by Features"}</h4>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {lang === "ar" ? "إعادة ضبط" : "Reset"}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableFeatures.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                        } else {
                          setSelectedFeatures([...selectedFeatures, feature.id]);
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{lang === "ar" ? feature.label_ar : feature.label_en}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};