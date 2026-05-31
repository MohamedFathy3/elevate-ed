/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/StagesPage.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { 
  GraduationCap, Sparkles, ArrowRight, ArrowLeft, BookOpen, 
  Trophy, Users, Clock, Calendar, ChevronRight, Star, 
  Award, Target, Rocket, Search, Filter, X, SlidersHorizontal,
  ChevronDown, ChevronUp, TrendingUp, Zap, Layers3, Eye, Lock, CheckCircle
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const StagesPage = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { stages, pick, isLoading, teacher } = useSafeTeacherData();
  const { student, isAuthenticated } = useStudentAuth();
  const navigate = useNavigate();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [studentStageId, setStudentStageId] = useState<number | null>(null);
  
  // ✅ جلب المرحلة الخاصة بالطالب المسجل
  useEffect(() => {
    if (isAuthenticated && student?.stage_id) {
      setStudentStageId(student.stage_id);
    }
  }, [isAuthenticated, student]);
  
  // ✅ حالة البحث والفلترة
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // الميزات المتاحة للفلترة
  const availableFeatures = [
    { id: "live_support", label_ar: "دعم مباشر", label_en: "Live Support", icon: Users },
    { id: "video_lessons", label_ar: "دروس فيديو", label_en: "Video Lessons", icon: PlayCircle },
    { id: "exams", label_ar: "اختبارات", label_en: "Exams", icon: Trophy },
    { id: "certificate", label_ar: "شهادة معتمدة", label_en: "Certificate", icon: Award },
  ];
  
  // ✅ فلترة المراحل حسب البحث والميزات
  const filteredStages = useMemo(() => {
    if (!stages) return [];
    
    let filtered = [...stages];
    
    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter((stage: any) => {
        const stageName = pick(stage.name, stage.name_ar)?.toLowerCase() || "";
        const stageDesc = pick(stage.description, stage.description_ar)?.toLowerCase() || "";
        return stageName.includes(searchQuery.toLowerCase()) || stageDesc.includes(searchQuery.toLowerCase());
      });
    }
    
    // ترتيب النتائج
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
      case "courses_asc":
        filtered.sort((a, b) => (a.courses_count || 0) - (b.courses_count || 0));
        break;
      case "courses_desc":
        filtered.sort((a, b) => (b.courses_count || 0) - (a.courses_count || 0));
        break;
      default:
        filtered.sort((a, b) => (a.position || 0) - (b.position || 0));
        break;
    }
    
    return filtered;
  }, [stages, searchQuery, sortBy, pick]);
  
  const totalResults = filteredStages.length;
  const hasResults = totalResults > 0;
  
  // إعادة ضبط الفلترة
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setSelectedFeatures([]);
  };
  
  // إحصائيات إضافية
  const totalCourses = stages?.reduce((acc, stage) => acc + (stage.courses_count || 0), 0) || 0;
  const totalStudents = stages?.reduce((acc, stage) => acc + (stage.students_count || 0), 0) || 0;
  
  if (isLoading) {
    return <StagesPageSkeleton />;
  }

  if (!stages?.length) {
    return <EmptyStagesPage slug={slug!} lang={lang} />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />
        </div>
      </div>

      <div className="container-tight relative">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold text-sm mb-5 backdrop-blur-sm"
          >
            <GraduationCap className="w-4 h-4" />
            {lang === "ar" ? "جميع المراحل الدراسية" : "All Educational Stages"}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-6xl lg:text-7xl tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {lang === "ar" ? "اختر مرحلتك الدراسية" : "Choose Your Educational Stage"}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-foreground/60 text-lg max-w-2xl mx-auto"
          >
            {lang === "ar" 
              ? "نقدم برامج تعليمية متكاملة تناسب جميع المراحل الدراسية"
              : "We offer integrated educational programs suitable for all educational stages"}
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <StatCard
            icon={<GraduationCap className="w-6 h-6 text-white" />}
            value={stages.length}
            label={lang === "ar" ? "مرحلة دراسية" : "Educational Stages"}
            color="from-primary to-purple-600"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            value={`${totalCourses}+`}
            label={lang === "ar" ? "كورس تعليمي" : "Educational Courses"}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-white" />}
            value={`${totalStudents}+`}
            label={lang === "ar" ? "طالب مسجل" : "Enrolled Students"}
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-white" />}
            value="100%"
            label={lang === "ar" ? "رضا الطلاب" : "Satisfaction Rate"}
            color="from-blue-500 to-cyan-600"
          />
        </motion.div>

        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن مرحلة..." : "Search for a stage..."}
                className="w-full bg-card border border-border rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-foreground/40 hover:text-primary" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                showFilters 
                  ? "gradient-primary text-white border-transparent" 
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">
                {lang === "ar" ? "فلترة وترتيب" : "Filter & Sort"}
              </span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-sm text-foreground/50">
              {lang === "ar" ? "ترتيب حسب:" : "Sort by:"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
              <option value="name_asc">{lang === "ar" ? "الاسم (أ-ي)" : "Name (A-Z)"}</option>
              <option value="name_desc">{lang === "ar" ? "الاسم (ي-أ)" : "Name (Z-A)"}</option>
              <option value="courses_desc">{lang === "ar" ? "الأكثر كورسات" : "Most Courses"}</option>
              <option value="courses_asc">{lang === "ar" ? "الأقل كورسات" : "Least Courses"}</option>
            </select>
            
            <div className="text-sm text-foreground/50 bg-secondary px-3 py-1.5 rounded-full">
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
                <div className="mt-4 p-5 bg-card rounded-xl border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h4 className="font-semibold">{lang === "ar" ? "فلترة حسب الميزات" : "Filter by Features"}</h4>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-foreground/50 hover:text-primary transition-colors"
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
                              ? "gradient-primary text-white"
                              : "bg-secondary hover:bg-secondary/80"
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

        {/* No Results */}
        {!hasResults && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
              <Search className="w-12 h-12 text-foreground/30" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-foreground/60 mb-6">
              {lang === "ar" 
                ? `لم نجد أي مرحلة تطابق "${searchQuery}"`
                : `No stages match "${searchQuery}"`}
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
            >
              <X className="w-4 h-4" />
              {lang === "ar" ? "مسح البحث" : "Clear Search"}
            </button>
          </div>
        )}

        {/* ✅ Stages Grid مع تعطيل المراحل الأخرى */}
        {hasResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredStages.map((stage: any, i: number) => {
              const stageName = pick(stage.name, stage.name_ar) || `Stage ${i + 1}`;
              const stageImage = stage.image?.fullUrl || stage.image?.previewUrl || null;
              const coursesCount = stage.courses_count || Math.floor(Math.random() * 30) + 10;
              const isStudentStage = isAuthenticated && stage.id === studentStageId;
              const isDisabled = isAuthenticated && !isStudentStage;
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  whileHover={!isDisabled ? { y: -8 } : {}}
                  onClick={() => {
                    if (!isDisabled) {
                      navigate(`/${slug}/subjects?stage_id=${stage.id}&stage_name=${encodeURIComponent(stageName)}`);
                    }
                  }}
                  className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isDisabled ? 'opacity-60' : ''}`}
                >
                  <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 shadow-card hover:shadow-elegant h-full">
                    
                    {/* ✅ Disabled Overlay */}
                    {isDisabled && (
                      <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                        <Lock className="w-12 h-12 text-white/70 mb-2" />
                        <p className="text-white/80 text-sm font-semibold text-center px-4">
                          {lang === "ar" 
                            ? "هذه المرحلة غير متاحة لك"
                            : "This stage is not available for you"}
                        </p>
                      </div>
                    )}
                    
                    {/* ✅ Student Stage Badge */}
                    {isStudentStage && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
                          <CheckCircle className="w-3 h-3" />
                          <span>{lang === "ar" ? "مرحلتي" : "My Stage"}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Image Section */}
                    <div className="relative h-52 overflow-hidden">
                      {stageImage ? (
                        <>
                          <img
                            src={stageImage}
                            alt={stageName}
                            className={`w-full h-full object-cover transition-transform duration-700 ${!isDisabled ? 'group-hover:scale-110' : ''}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-accent/30">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-2xl gradient-primary grid place-items-center">
                              <GraduationCap className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Badges Overlay */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                          {lang === "ar" ? `المرحلة ${i + 1}` : `Stage ${i + 1}`}
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                          <BookOpen className="w-3 h-3" />
                          <span>{coursesCount} {lang === "ar" ? "كورس" : "Courses"}</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                          <Users className="w-3 h-3" />
                          <span>{stage.students_count || Math.floor(Math.random() * 500) + 100} {lang === "ar" ? "طالب" : "Students"}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {stageName}
                      </h3>
                      
                      <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 min-h-[40px]">
                        {pick(stage.description, stage.description_ar) || (lang === "ar" 
                          ? `برامج تعليمية متكاملة لمرحلة ${stageName}`
                          : `Integrated educational programs for ${stageName}`)}
                      </p>
                      
                      {/* Features Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/5 text-primary text-xs">
                          <Target className="w-3 h-3" />
                          <span>{lang === "ar" ? "منهج متكامل" : "Integrated Curriculum"}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/5 text-accent text-xs">
                          <Rocket className="w-3 h-3" />
                          <span>{lang === "ar" ? "تعلم تفاعلي" : "Interactive Learning"}</span>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${!isDisabled ? 'text-primary group-hover:gap-3' : 'text-foreground/30'}`}>
                          {lang === "ar" ? "استكشف المواد" : "Explore Subjects"}
                          <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="mt-16 text-center"
>
  <div className="gradient-primary rounded-3xl p-8 md:p-12 text-white">
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
      to={isAuthenticated ? `/${slug}/courses` : `/${slug}/register`}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:shadow-lg transition-all hover:scale-105"
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

// 🟢 Stat Card Component
const StatCard = ({ icon, value, label, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg text-center`}
  >
    <div className="flex items-center justify-center mb-3">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
    </div>
    <div className="text-2xl md:text-3xl font-black">{value}</div>
    <div className="text-xs opacity-90 mt-1">{label}</div>
  </motion.div>
);

// 🟢 Skeleton Component
const StagesPageSkeleton = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 animate-pulse" />
          <div className="h-12 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mt-4 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-card animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto mb-3" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 animate-pulse" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-52 bg-gray-200 dark:bg-gray-700" />
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🟢 Empty State
const EmptyStagesPage = ({ slug, lang }: { slug: string; lang: string }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
          <GraduationCap className="w-16 h-16 text-foreground/30" />
        </div>
        <h1 className="text-2xl font-bold mb-3">
          {lang === "ar" ? "لا توجد مراحل دراسية" : "No Stages Found"}
        </h1>
        <p className="text-foreground/60 mb-6">
          {lang === "ar" 
            ? "لم يتم إضافة أي مراحل دراسية بعد"
            : "No educational stages have been added yet"}
        </p>
        <Link
          to={`/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
};

const PlayCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default StagesPage;