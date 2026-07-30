// src/pages/semesters/components/SemestersFilters.tsx

import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, ChevronUp, DollarSign, X } from "lucide-react";
import { SemestersFiltersProps } from "../SemestersPage.types";

export const SemestersFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  selectedType,
  setSelectedType,
  showFilters,
  setShowFilters,
  totalResults,
  lang,
  isNature,
  resetFilters,
  primaryGradient,
}: SemestersFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all 
            ${showFilters 
              ? (isNature ? 'bg-amber-600 text-white border-amber-500' : `bg-gradient-to-r ${primaryGradient} text-white border-transparent`)
              : `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-${isNature ? 'amber' : 'primary'}/40`
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">{lang === "ar" ? "فلترة" : "Filter"}</span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`border rounded-xl px-4 py-2 text-sm focus:outline-none 
            bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 
            text-gray-900 dark:text-white
            focus:border-${isNature ? 'amber' : 'primary'}/50`}
        >
          <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
          <option value="price_asc">{lang === "ar" ? "السعر: من الأقل" : "Price: Low"}</option>
          <option value="price_desc">{lang === "ar" ? "السعر: من الأعلى" : "Price: High"}</option>
          <option value="popularity">{lang === "ar" ? "الأكثر شهرة" : "Popular"}</option>
        </select>
        
        <div className={`text-sm px-3 py-1.5 rounded-full 
          ${isNature ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          {totalResults} {lang === "ar" ? "نتيجة" : "results"}
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
            <div className={`mt-4 p-4 rounded-xl border 
              bg-white dark:bg-gray-900 
              border-gray-200 dark:border-gray-700`}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {lang === "ar" ? "نطاق السعر" : "Price Range"}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm 
                          bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 
                          text-gray-900 dark:text-white
                          focus:border-${isNature ? 'amber' : 'primary'}/50`}
                        placeholder="Min"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm 
                          bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 
                          text-gray-900 dark:text-white
                          focus:border-${isNature ? 'amber' : 'primary'}/50`}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {lang === "ar" ? "نوع الحضور" : "Type"}
                  </label>
                  <div className="flex gap-2">
                    {["all", "online", "center"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedType === type
                            ? (isNature ? 'bg-amber-600 text-white' : `bg-gradient-to-r ${primaryGradient} text-white`)
                            : `bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`
                        }`}
                      >
                        {type === "all" ? (lang === "ar" ? "الكل" : "All") :
                         type === "online" ? "💻 أونلاين" : "🏢 سنتر"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm 
                    text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                  {lang === "ar" ? "إعادة ضبط" : "Reset"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};