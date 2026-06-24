/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SubjectsPage.tsx
import { useSearchParams, useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ChevronRight, Search, Filter, X, 
  SlidersHorizontal, ChevronDown, ChevronUp, Star, 
  TrendingUp, Users, Clock, Award, ArrowLeft, ArrowRight,
  Lock, CheckCircle, Leaf, Sparkles, LogIn, GraduationCap
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSubjects } from "@/hooks/useSubjects";

export const SubjectsPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher, stages, pick, isLoading: teacherLoading } = useTeacher();
  const { student, isAuthenticated, isLoading: authLoading } = useStudentAuth();
  const [searchParams] = useSearchParams();
  
  // ✅ نجيب stage_id من الـ URL params
  const stageIdParam = searchParams.get('stage_id');
  const stageNameParam = searchParams.get('stage_name');
  
  // ✅ تحويل stage_id إلى رقم
  const stageId = stageIdParam ? parseInt(stageIdParam) : undefined;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>(stageIdParam || "");
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // ✅ جلب المواد باستخدام useSubjects مع stage_id من الـ URL و teacher_id
  const { data: subjectsData, isLoading: subjectsLoading, refetch } = useSubjects(
    stageId, // ✅ stage_id من الـ URL
    teacher?.id // ✅ teacher_id من الـ Teacher Context
  );

  // ✅ المواد من الـ API
  const allSubjects = subjectsData || [];

  // ✅ تخزين مسار الصفحة الحالية للعودة بعد تسجيل الدخول
  const [redirectPath, setRedirectPath] = useState<string>("");
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectPath(window.location.pathname);
    }
  }, []);

  // ✅ إذا كان المستخدم غير مسجل، حوله لصفحة تسجيل الدخول
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
  
  // ✅ الألوان الثابتة (أزرق-أبيض رايق)
  const bgColor = 'bg-gray-50 dark:bg-gray-950';
  const cardBg = 'bg-white dark:bg-gray-900';
  const cardBorder = 'border-gray-200 dark:border-gray-700';
  const cardHoverBorder = 'hover:border-blue-400 dark:hover:border-blue-500';
  const inputBg = 'bg-white dark:bg-gray-900';
  const primaryGradient = 'from-blue-600 to-blue-700';
  const textPrimary = 'text-blue-600 dark:text-blue-400';
  const textSecondary = 'text-gray-500 dark:text-gray-400';
  const badgeBg = 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400';
  
  // 🆕 فلترة المواد حسب البحث والترتيب
  const filteredSubjects = useMemo(() => {
    if (!allSubjects.length) return [];
    
    let filtered = [...allSubjects];
    
    if (searchQuery) {
      filtered = filtered.filter((subject: any) => {
        const subjectName = pick(subject.name, subject.name_ar)?.toLowerCase() || "";
        return subjectName.includes(searchQuery.toLowerCase());
      });
    }
    
    switch (sortBy) {
      case "name_asc":
        filtered.sort((a, b) => {
          const nameA = pick(a.name, a.name_ar) || "";
          const nameB = pick(b.name, b.name_ar) || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "name_desc":
        filtered.sort((a, b) => {
          const nameA = pick(a.name, a.name_ar) || "";
          const nameB = pick(b.name, b.name_ar) || "";
          return nameB.localeCompare(nameA);
        });
        break;
      default:
        filtered.sort((a, b) => (a.position || 0) - (b.position || 0));
        break;
    }
    
    return filtered;
  }, [allSubjects, searchQuery, sortBy, pick]);
  
  const totalResults = filteredSubjects.length;
  const hasResults = totalResults > 0;
  const stagesList = stages || [];
  
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setSelectedStageId("");
  };
  
  const clearStageFilter = () => {
    setSelectedStageId("");
  };
  
  // العثور على اسم المرحلة المختارة
  const getSelectedStageName = () => {
    if (stageNameParam && selectedStageId) return stageNameParam;
    const stage = stagesList.find((s: any) => s.id === parseInt(selectedStageId));
    return stage ? pick(stage.name, stage.name_ar) : "";
  };

  // أنيميشن المتغيرات
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // ✅ تحميل بيانات المواد
  if (authLoading || teacherLoading || subjectsLoading) {
    return <SubjectsSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen pt-32 pb-20 relative overflow-hidden ${bgColor}`}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      <div className="container-tight relative">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
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
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                {selectedStageId 
                  ? `${getSelectedStageName()} - ${lang === "ar" ? "المواد" : "Subjects"}`
                  : (lang === "ar" ? "المواد الدراسية" : "Subjects")}
              </h1>
              <p className={`${textSecondary} mt-2`}>
                {lang === "ar" 
                  ? "اختر المادة لاستعراض الترمات والكورسات" 
                  : "Choose a subject to view semesters and courses"}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "بحث عن مادة..." : "Search subject..."}
                className={`w-full border ${cardBorder} rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors ${inputBg} text-gray-900 dark:text-white`}
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
        </motion.div>

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                showFilters 
                  ? `bg-gradient-to-r ${primaryGradient} text-white border-transparent`
                  : `${inputBg} ${cardBorder} hover:border-blue-400`
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">
                {lang === "ar" ? "فلترة وترتيب" : "Filter & Sort"}
              </span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
            
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
                {getSelectedStageName()}
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
                <div className={`mt-4 p-5 rounded-xl border ${cardBg} ${cardBorder}`}>
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
                  
                  {stagesList.length > 0 ? (
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
                      {stagesList.map((stage: any) => (
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
                      {lang === "ar" ? "لا توجد مراحل متاحة" : "No stages available"}
                    </p>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      {lang === "ar" ? "إعادة ضبط الكل" : "Reset All"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        <AnimatePresence mode="wait">
          {!hasResults ? (
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
                <X className="w-4 h-4" />
                {lang === "ar" ? "مسح البحث" : "Clear Search"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSubjects.map((subject: any, i: number) => (
                <motion.div
                  key={subject.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
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

// 🟢 Subject Card Component
const SubjectCard = ({ subject, index, slug, lang, pick, primaryGradient, cardBg, cardBorder, cardHoverBorder }: any) => {
  const subjectName = pick(subject.name, subject.name_ar);
  const subjectStage = subject.stage ? pick(subject.stage.name, subject.stage.name_ar) : "";
  const isActive = subject.active !== false;
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border transition-all cursor-pointer
        ${cardBg} ${cardBorder} ${cardHoverBorder} shadow-sm hover:shadow-xl`}
    >
      <Link to={`/semesters?subject_id=${subject.id}&subject_name=${encodeURIComponent(subjectName)}`}>
        <div className="p-6">
          {/* Icon */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${primaryGradient} grid place-items-center mb-4 shadow-lg transition-transform`}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          
          {/* Title */}
          <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {subjectName}
          </h3>
          
          {/* Stage Info */}
          {subjectStage && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <GraduationCap className="w-3 h-3" />
              <span>{subjectStage}</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
              isActive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isActive 
                ? (lang === "ar" ? "نشط" : "Active") 
                : (lang === "ar" ? "غير نشط" : "Inactive")}
            </span>
          </div>
          
          {/* View Button */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="inline-flex items-center gap-2 font-semibold text-sm transition-all group-hover:gap-3 text-blue-600 dark:text-blue-400">
              {lang === "ar" ? "استعراض الترمات" : "View Semesters"}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// 🟢 Skeleton Component
const SubjectsSkeleton = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-gray-950">
      <div className="container-tight">
        <div className="mb-8">
          <div className="h-4 w-32 rounded mb-4 animate-pulse bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 w-64 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-72 mt-2 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        </div>
        
        <div className="h-12 rounded-xl mb-8 animate-pulse bg-gray-200 dark:bg-gray-700" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl p-6 animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl mb-4 animate-pulse bg-blue-100 dark:bg-blue-900/30" />
              <div className="h-6 rounded-lg mb-2 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 rounded-lg w-1/2 animate-pulse bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;