// src/pages/semesters/SemestersPage.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams, useParams } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSemesters } from "@/hooks/useSemesters";
import { useSubjectCourses } from "@/hooks/useCourses";
import { useTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Search, Leaf, Flame, Layers, X } from "lucide-react";
import { useState } from "react";

// ✅ Components
import { SemestersHeader } from './components/SemestersHeader';
import { SemestersFilters } from './components/SemestersFilters';
import { DirectCourseCard } from './components/DirectCourseCard';
import { SemesterCard } from './components/SemesterCard';
import { SemestersSkeleton } from './components/SemestersSkeleton';

// ✅ Hooks
import { useSemestersFilter, useDirectCoursesFilter } from './hooks/useSemestersFilter';

export const SemestersPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher, pick } = useTeacher();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subject_id');
  const subjectName = searchParams.get('subject_name');
  const stageName = searchParams.get('stage_name');
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  
  // ✅ الألوان
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const textPrimary = isNature ? 'text-amber-700 dark:text-amber-400' : 'text-primary';
  
  // ✅ State
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  
  // ✅ جلب البيانات
  const { data: semesters, isLoading: semestersLoading, refetch: refetchSemesters } = useSemesters(
    teacher?.id,
    subjectId ? parseInt(subjectId) : undefined
  );
  
  const { data: directCourses, isLoading: coursesLoading } = useSubjectCourses(
    subjectId ? parseInt(subjectId) : undefined,
    teacher?.id
  );
  
  // ✅ فلترة البيانات
  const filteredSemesters = useSemestersFilter(
    semesters || [],
    searchQuery,
    priceRange,
    selectedType,
    sortBy,
    pick
  );
  
  const filteredDirectCourses = useDirectCoursesFilter(
    directCourses || [],
    searchQuery,
    priceRange,
    selectedType,
    sortBy,
    pick
  );
  
  const hasDirectCourses = filteredDirectCourses.length > 0;
  const hasSemesters = filteredSemesters.length > 0;
  const totalResults = filteredDirectCourses.length + filteredSemesters.length;
  
  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSelectedType("all");
    setSortBy("default");
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.06,
        delayChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
  };

  const pageTitle = stageName || subjectName || (lang === "ar" ? "الترمات والكورسات" : "Semesters & Courses");

  if (semestersLoading || coursesLoading) {
    return <SemestersSkeleton isNature={isNature} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen pt-28 pb-20 relative overflow-hidden bg-white dark:bg-gray-950`}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl ${isNature ? 'bg-amber-300/10' : 'bg-primary/5'}`} />
        <div className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl ${isNature ? 'bg-orange-300/10' : 'bg-accent/5'}`} />
      </div>

      <div className="container-tight relative">
        {/* Header */}
        <SemestersHeader
          pageTitle={pageTitle}
          totalResults={totalResults}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          lang={lang}
          isNature={isNature}
          textPrimary={textPrimary}
        />
        
        {/* Filters */}
        <SemestersFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          totalResults={totalResults}
          lang={lang}
          isNature={isNature}
          resetFilters={resetFilters}
          primaryGradient={primaryGradient}
        />

        {/* Direct Courses - بس اللي semester_id = null */}
        {hasDirectCourses && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${primaryGradient} flex items-center justify-center`}>
                {isNature ? <Leaf className="w-4 h-4 text-white" /> : <Flame className="w-4 h-4 text-white" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lang === "ar" ? "كورسات المراجعة النهائية" : "Final Revision Courses"}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                {filteredDirectCourses.length}
              </span>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredDirectCourses.map((course: any, index: number) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <DirectCourseCard
                    course={course}
                    index={index}
                    slug={slug!}
                    lang={lang}
                    pick={pick}
                    isNature={isNature}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Semesters */}
        {hasSemesters && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${primaryGradient} flex items-center justify-center`}>
                <Layers className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lang === "ar" ? "الترمات الدراسية" : "Semesters"}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                {filteredSemesters.length}
              </span>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-5"
            >
              {filteredSemesters.map((semester, i) => (
                <motion.div key={semester.id} variants={itemVariants}>
                  <SemesterCard
                    semester={semester}
                    index={i}
                    slug={slug!}
                    lang={lang}
                    pick={pick}
                    refetchSemesters={refetchSemesters}
                    isNature={isNature}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
        
        {/* No Results */}
        {!hasSemesters && !hasDirectCourses && (
          <div className="text-center py-12">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
              ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <button
              onClick={resetFilters}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold ${isNature ? 'bg-amber-600 hover:bg-amber-700' : `bg-gradient-to-r ${primaryGradient}`}`}
            >
              <X className="w-4 h-4" />
              {lang === "ar" ? "إعادة ضبط" : "Reset"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SemestersPage;