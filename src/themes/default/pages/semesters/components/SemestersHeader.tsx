// src/pages/semesters/components/SemestersHeader.tsx

import { Link } from "react-router-dom";
import { ChevronRight, Search, X } from "lucide-react";
import { SemestersHeaderProps } from "../SemestersPage.types";

export const SemestersHeader = ({
  pageTitle,
  totalResults,
  searchQuery,
  setSearchQuery,
  lang,
  isNature,
  textPrimary,
}: SemestersHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
        <Link to={`/`} className={`hover:${textPrimary} transition-colors`}>
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className={`font-medium ${textPrimary}`}>
          {pageTitle}
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lang === "ar" 
              ? `اختر الترم المناسب أو الكورس المباشر (${totalResults} نتيجة)`
              : `Choose the right semester or direct course (${totalResults} results)`}
          </p>
        </div>
        
        <div className="relative min-w-[200px] md:min-w-[250px]">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isNature ? 'text-amber-400' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
            className={`w-full border rounded-xl pl-10 pr-10 py-2 text-sm focus:outline-none transition-colors
              bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 
              text-gray-900 dark:text-white
              focus:border-${isNature ? 'amber' : 'primary'}/50`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className={`w-4 h-4 ${isNature ? 'text-amber-400 hover:text-amber-600' : 'text-gray-400 hover:text-gray-600'}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};