// src/pages/stages/StagesPage.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { motion } from "framer-motion";
import { Sparkles, LogIn, X } from "lucide-react";

// ✅ Components
import { StagesHeader } from './components/StagesHeader';
import { StagesStats } from './components/StagesStats';
import { StagesFilters } from './components/StagesFilters';
import { StageCard } from './components/StageCard';
import { StagesSkeleton } from './components/StagesSkeleton';
import { EmptyStages } from './components/EmptyStages';

// ✅ Hooks
import { useStagesFilter } from './hooks/useStagesFilter';

export const StagesPage = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { stages, pick, isLoading, teacher } = useSafeTeacherData();
  const { student, isAuthenticated, isLoading: authLoading } = useStudentAuth();
  const navigate = useNavigate();

  const [studentStageId, setStudentStageId] = useState<number | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // ✅ ألوان المراحل
  const stageColors = [
    "from-blue-500 to-blue-600",
    "from-indigo-500 to-indigo-600",
    "from-blue-600 to-blue-700",
    "from-cyan-500 to-cyan-600"
  ];

  // ✅ تخزين مسار الصفحة
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectPath(window.location.pathname);
    }
  }, []);

  // ✅ تعيين مرحلة الطالب
  useEffect(() => {
    if (isAuthenticated && student?.stage_id) {
      setStudentStageId(student.stage_id);
    }
  }, [isAuthenticated, student]);

  // ✅ فلترة المراحل
  const filteredStages = useStagesFilter(stages || [], searchQuery, sortBy, pick);
  const totalResults = filteredStages.length;

  // ✅ إعادة ضبط الفلاتر
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setSelectedFeatures([]);
  };

  // ✅ إذا كان غير مسجل
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <LogIn className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {lang === "ar" ? "تسجيل الدخول مطلوب" : "Login Required"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {lang === "ar" 
              ? "يجب تسجيل الدخول أولاً لعرض المراحل الدراسية"
              : "You must login first to view educational stages"}
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

  // ✅ تحميل
  if (authLoading || isLoading) {
    return <StagesSkeleton />;
  }

  // ✅ لا توجد مراحل
  if (!stages?.length) {
    return <EmptyStages slug={slug!} lang={lang} />;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      <div className="container-tight relative">
        {/* Header */}
        <StagesHeader lang={lang} totalStages={stages.length} />

        {/* Stats */}
        <StagesStats stages={stages} lang={lang} />

        {/* Filters */}
        <StagesFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          totalResults={totalResults}
          lang={lang}
          resetFilters={resetFilters}
        />

        {/* No Results */}
        {totalResults === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/30 grid place-items-center">
              <Search className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {lang === "ar" 
                ? `لم نجد أي مرحلة تطابق "${searchQuery}"`
                : `No stages match "${searchQuery}"`}
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold"
            >
              <X className="w-4 h-4" />
              {lang === "ar" ? "مسح البحث" : "Clear Search"}
            </button>
          </div>
        )}

        {/* Stages Grid */}
        {totalResults > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStages.map((stage: any, i: number) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={i}
                lang={lang}
                pick={pick}
                isAuthenticated={isAuthenticated}
                studentStageId={studentStageId}
                onNavigate={navigate}
                stageColors={stageColors}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {isAuthenticated 
                ? (lang === "ar" ? "واصل رحلة التعلم" : "Continue Your Learning Journey")
                : (lang === "ar" ? "مستعد تبدأ رحلة التعلم؟" : "Ready to start learning?")}
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              {isAuthenticated 
                ? (lang === "ar" 
                    ? "استعرض الكورسات المتاحة واستمر في تطوير مهاراتك"
                    : "Browse available courses and continue developing your skills")
                : (lang === "ar" 
                    ? "سجل الآن وابدأ رحلتك التعليمية مع أفضل المعلمين"
                    : "Sign up now and start your learning journey with the best teachers")}
            </p>
            <Link
              to={isAuthenticated ? `/courses` : `/register`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              {isAuthenticated 
                ? (lang === "ar" ? "استعرض الكورسات" : "Browse Courses")
                : (lang === "ar" ? "سجل الآن" : "Register Now")}
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ✅ إضافة Search المستخدم
import { Search } from "lucide-react";

export default StagesPage;