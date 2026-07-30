// src/pages/subjects/components/SubjectsHeader.tsx

import { Link } from "react-router-dom";
import { ChevronRight, Search, X } from "lucide-react";

interface SubjectsHeaderProps {
  lang: string;
  selectedStageId: string;
  getSelectedStageName: () => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  textSecondary: string;
  cardBorder: string;
  inputBg: string;
  isLoading?: boolean; // ✅ إضافة
}

export const SubjectsHeader = ({
  lang,
  selectedStageId,
  getSelectedStageName,
  searchQuery,
  setSearchQuery,
  textSecondary,
  cardBorder,
  inputBg,
  isLoading = false,
}: SubjectsHeaderProps) => {
  return (
    <div className="mb-8">
      {/* Breadcrumb - مبسط */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
        <Link to={``} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/stages`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {lang === "ar" ? "المراحل" : "Stages"}
        </Link>
        {selectedStageId && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {getSelectedStageName()}
            </span>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {lang === "ar" ? "المواد" : "Subjects"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* ✅ h1 - LCP element - يتغير حسب التحميل */}
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white transition-all">
            {isLoading ? (
              // ✅ Skeleton للـ h1 أثناء التحميل
              <span className="inline-block w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ) : (
              selectedStageId 
                ? `${getSelectedStageName()} - ${lang === "ar" ? "المواد" : "Subjects"}`
                : (lang === "ar" ? "المواد الدراسية" : "Subjects")
            )}
          </h1>
          <p className={`${textSecondary} mt-1 text-sm transition-all`}>
            {isLoading ? (
              <span className="inline-block w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              lang === "ar" 
                ? "اختر المادة لاستعراض الترمات والكورسات" 
                : "Choose a subject to view semesters and courses"
            )}
          </p>
        </div>

        {/* Search Bar - يظهر متأخر */}
        <div className="relative min-w-[200px] md:min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
            className={`w-full border ${cardBorder} rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors ${inputBg} text-gray-900 dark:text-white`}
            disabled={isLoading}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};