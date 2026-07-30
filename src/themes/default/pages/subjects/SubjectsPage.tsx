// src/pages/subjects/SubjectsPage.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams, useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, LogIn, ArrowLeft, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSubjects } from "@/hooks/useSubjects";

// ✅ Components
import { SubjectCard } from './components/SubjectCard';
import { SubjectsHeader } from './components/SubjectsHeader';
import { SubjectsFilters } from './components/SubjectsFilters';
import { SubjectsSkeleton } from './components/SubjectsSkeleton';

// ✅ Hooks
import { useSubjectsFilter } from './hooks/useSubjectsFilter';

export const SubjectsPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher, stages, pick, isLoading: teacherLoading } = useTeacher();
  const { student, isAuthenticated, isLoading: authLoading } = useStudentAuth();
  const [searchParams] = useSearchParams();

  const stageIdParam = searchParams.get('stage_id');
  const stageNameParam = searchParams.get('stage_name');
  const stageId = stageIdParam ? parseInt(stageIdParam) : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>(stageIdParam || "");
  const [redirectPath, setRedirectPath] = useState<string>("");

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects(
    stageId,
    teacher?.id
  );

  const allSubjects = subjectsData || [];

  // ✅ الفلترة
  const filteredSubjects = useSubjectsFilter(allSubjects, searchQuery, sortBy, pick);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectPath(window.location.pathname);
    }
  }, []);

  // ✅ الألوان
  const bgColor = 'bg-gray-50 dark:bg-gray-950';
  const cardBg = 'bg-white dark:bg-gray-900';
  const cardBorder = 'border-gray-200 dark:border-gray-700';
  const cardHoverBorder = 'hover:border-blue-400 dark:hover:border-blue-500';
  const inputBg = 'bg-white dark:bg-gray-900';
  const primaryGradient = 'from-blue-600 to-blue-700';
  const textSecondary = 'text-gray-500 dark:text-gray-400';
  const badgeBg = 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400';

  const getSelectedStageName = () => {
    if (stageNameParam && selectedStageId) return stageNameParam;
    const stage = stages.find((s: any) => s.id === parseInt(selectedStageId));
    return stage ? pick(stage.name, stage.name_ar) : "";
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setSelectedStageId("");
  };

  const clearStageFilter = () => {
    setSelectedStageId("");
  };

  // ✅ إذا كان غير مسجل
  if (!authLoading && !isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isNature ? 'bg-cream' : 'bg-background'}`}>
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <LogIn className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">
            {lang === "ar" ? "تسجيل الدخول مطلوب" : "Login Required"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {lang === "ar" 
              ? "يجب تسجيل الدخول أولاً لعرض المواد الدراسية"
              : "You must login first to view subjects"}
          </p>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath || window.location.pathname)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all"
          >
            <LogIn className="w-5 h-5" />
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading || teacherLoading || subjectsLoading) {
    return <SubjectsSkeleton />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen pt-28 pb-20 relative overflow-hidden ${bgColor}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="container-tight relative">
        {/* Header */}
        <SubjectsHeader
          lang={lang}
          selectedStageId={selectedStageId}
          getSelectedStageName={getSelectedStageName}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          textSecondary={textSecondary}
          cardBorder={cardBorder}
          inputBg={inputBg}
        />

        {/* Filters */}
        <SubjectsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedStageId={selectedStageId}
          setSelectedStageId={setSelectedStageId}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          stages={stages}
          totalResults={filteredSubjects.length}
          lang={lang}
          pick={pick}
          resetFilters={resetFilters}
          clearStageFilter={clearStageFilter}
          primaryGradient={primaryGradient}
          inputBg={inputBg}
          cardBorder={cardBorder}
          badgeBg={badgeBg}
        />

        {/* Results */}
        <AnimatePresence mode="wait">
          {filteredSubjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/30 grid place-items-center">
                <Search className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {lang === "ar" ? "لا توجد نتائج" : "No results found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {lang === "ar" 
                  ? `لم نجد أي مادة تطابق "${searchQuery}"`
                  : `No subjects match "${searchQuery}"`}
              </p>
              <button
                onClick={resetFilters}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${primaryGradient}`}
              >
                <Search className="w-4 h-4" />
                {lang === "ar" ? "مسح البحث" : "Clear Search"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredSubjects.map((subject: any, i: number) => (
                <motion.div key={subject.id} variants={itemVariants}>
                  <SubjectCard
                    subject={subject}
                    index={i}
                    slug={slug!}
                    lang={lang}
                    pick={pick}
                    primaryGradient={primaryGradient}
                    cardBg={cardBg}
                    cardBorder={cardBorder}
                    cardHoverBorder={cardHoverBorder}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SubjectsPage;