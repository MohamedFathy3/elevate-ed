/* eslint-disable @typescript-eslint/no-explicit-any */
// src/themes/default/pages/CoursesPage.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useSearchParams, Link, useParams, Navigate } from "react-router-dom";
import { 
  Search, Filter, Sparkles, Leaf, ArrowLeft, ArrowRight
} from "lucide-react";

import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useCourses, useSubjectCourses } from "@/hooks/useCourses";
import { useTheme } from "@/context/ThemeContext";
import { useStudentAuth } from "@/context/StudentAuthContext"; // ✅ استخدم StudentAuth
import { toast } from "@/hooks/use-toast";

import { CourseCardFull } from "@/themes/default/components/site/pagecouress/CourseCardFull";
import { EmptyState } from "@/themes/default/components/site/pagecouress/EmptyState";
import { CoursesPageSkeleton } from "@/themes/default/components/site/pagecouress/CoursesPageSkeleton";
import { ChevronRight } from "@/components/ui/ChevronRight";
import RedeemModal from "@/components/RedeemModal";

const CoursesPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher, pick, isLoading: teacherLoading } = useSafeTeacherData();
  const { isAuthenticated, isLoading: authLoading } = useStudentAuth(); // ✅ استخدم useStudentAuth
  
  const [searchParams] = useSearchParams();
  
  const semesterId = searchParams.get('semester_id');
  const semesterName = searchParams.get('semester_name');
  const subjectId = searchParams.get('subject_id');
  const subjectName = searchParams.get('subject_name');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // ✅ ستيتات المودال
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";

  // ✅ جلب الكورسات
  const { data: semesterCourses, isLoading: semesterLoading } = useCourses(
    semesterId ? parseInt(semesterId) : undefined,
    teacher?.id
  );
  const { data: subjectCoursesData, isLoading: subjectLoading } = useSubjectCourses(
    subjectId ? parseInt(subjectId) : undefined,
    teacher?.id
  );
  const { courses: allCourses, isLoading: allCoursesLoading } = useSafeTeacherData();
  
  const displayCourses = useMemo(() => {
    if (semesterId && semesterCourses) return semesterCourses;
    if (subjectId && subjectCoursesData) return subjectCoursesData;
    return allCourses;
  }, [semesterId, semesterCourses, subjectId, subjectCoursesData, allCourses]);
  
  const isLoading = teacherLoading || semesterLoading || subjectLoading || allCoursesLoading || authLoading;
  
  // ✅ لو مش مسجل، حول للـ Login
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ مستويات وأنواع
  const levels = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(displayCourses)) {
      displayCourses.forEach((c: any) => { if (c?.level) set.add(c.level); });
    }
    return ["all", ...Array.from(set)];
  }, [displayCourses]);
  
  const types = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(displayCourses)) {
      displayCourses.forEach((c: any) => { if (c?.type) set.add(c.type); });
    }
    return ["all", ...Array.from(set)];
  }, [displayCourses]);
  
  const filteredCourses = useMemo(() => {
    if (!Array.isArray(displayCourses)) return [];
    return displayCourses.filter((c: any) => {
      const title = pick(c?.title, c?.title_ar) || "";
      const description = pick(c?.description, c?.description_ar) || "";
      const matchesSearch = !searchQuery ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === "all" || c?.level === selectedLevel;
      const matchesType = selectedType === "all" || c?.type === selectedType;
      return matchesSearch && matchesLevel && matchesType;
    });
  }, [displayCourses, searchQuery, selectedLevel, selectedType, pick]);

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

  // ✅ دوال المودال
  const handleOpenModal = (course: any) => {
    setSelectedCourse(course);
    setShowRedeemModal(true);
  };

  const handleCloseModal = () => {
    setShowRedeemModal(false);
    setSelectedCourse(null);
  };

  const handlePaymentSuccess = (data: any) => {
    toast.success(lang === "ar" ? "تم الدفع بنجاح!" : "Payment successful!");
    handleCloseModal();
  };

  const handlePaymentError = (error: any) => {
    toast.error(lang === "ar" ? "فشل الدفع، حاول مرة أخرى" : "Payment failed, please try again");
  };

  // ✅ حساب السعر النهائي
  const getCoursePrice = (course: any) => {
    if (course?.price !== undefined && course?.price !== null) {
      return parseFloat(course.price) || 0;
    }
    const originalPrice = parseFloat(course?.original_price) || parseFloat(course?.price) || 0;
    const discount = parseFloat(course?.discount) || 0;
    return originalPrice - discount;
  };

  const hasDiscount = (course: any) => {
    const discount = parseFloat(course?.discount) || 0;
    return discount > 0;
  };

  const getOriginalPrice = (course: any) => {
    return parseFloat(course?.original_price) || parseFloat(course?.price) || 0;
  };

  // ✅ دوال الصفحة
  const getPageTitle = () => {
    if (semesterName) return semesterName;
    if (subjectName) return subjectName;
    return lang === "ar" ? "جميع الكورسات" : "All Courses";
  };
  
  const getPageDescription = () => {
    if (semesterName) {
      return lang === "ar" 
        ? `استعرض جميع الكورسات المتاحة في ${semesterName}`
        : `Browse all courses available in ${semesterName}`;
    }
    if (subjectName) {
      return lang === "ar"
        ? `استعرض جميع الكورسات المتاحة في مادة ${subjectName}`
        : `Browse all courses available in ${subjectName}`;
    }
    return lang === "ar"
      ? "تصفح جميع الكورسات المتاحة واختر ما يناسب احتياجاتك التعليمية"
      : "Browse all available courses and choose what suits your educational needs";
  };

  if (isLoading) {
    return <CoursesPageSkeleton isNature={isNature} />;
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`pt-36 md:pt-40 pb-24 min-h-screen relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl ${isNature ? 'bg-amber-300/20' : 'bg-primary/5'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl ${isNature ? 'bg-orange-300/20' : 'bg-accent/5'}`}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0], y: [0, -50, -100] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.2 }}
            className={`absolute w-1 h-1 rounded-full ${isNature ? 'bg-amber-400' : 'bg-primary'} ${i % 2 === 0 ? 'left-1/4' : 'right-1/4'}`}
            style={{ top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="container-tight relative">
        {/* Back Button */}
        {(semesterId || subjectId) && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link 
              to={`/courses`}
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors group"
            >
              <Arrow className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              {lang === "ar" ? "جميع الكورسات" : "All Courses"}
            </Link>
          </motion.div>
        )}
        
        {/* Breadcrumb */}
        {(semesterId || subjectId) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap"
          >
            <Link to={``} className="hover:text-primary transition-colors">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/courses`} className="hover:text-primary transition-colors">
              {lang === "ar" ? "الكورسات" : "Courses"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{getPageTitle()}</span>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm mb-5 backdrop-blur-sm
              ${isNature 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary'}`}
          >
            {isNature ? <Leaf className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {lang === "ar" ? "استكشف الكورسات" : "Explore Courses"}
          </motion.div>
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight">
            <span className={`bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}>
              {getPageTitle()}
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-foreground/60 max-w-2xl mx-auto"
          >
            {getPageDescription()}
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-4 h-4 ${isNature ? 'text-amber-400' : 'text-foreground/50'}`} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن كورس..." : "Search for a course..."}
                className={`w-full border rounded-xl pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 text-sm focus:outline-none transition-all
                  focus:border-${isNature ? 'amber-400' : 'primary'}/50`}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all
                hover:${isNature ? 'border-amber-400' : 'border-primary/40'}`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {lang === "ar" ? "فلترة" : "Filters"}
              </span>
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-5 rounded-xl border overflow-hidden`}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {lang === "ar" ? "المستوى" : "Level"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((l) => (
                        <motion.button
                          key={l}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedLevel(l)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedLevel === l
                              ? `bg-gradient-to-r ${primaryGradient} text-white shadow-soft`
                              : `bg-secondary hover:bg-secondary/80`
                          }`}
                        >
                          {l === "all" ? (lang === "ar" ? "الكل" : "All") : l}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {lang === "ar" ? "النوع" : "Type"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {types.map((t) => (
                        <motion.button
                          key={t}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedType(t)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedType === t
                              ? `bg-gradient-to-r ${primaryGradient} text-white shadow-soft`
                              : `bg-secondary hover:bg-secondary/80`
                          }`}
                        >
                          {t === "all" 
                            ? (lang === "ar" ? "الكل" : "All")
                            : t === "online" 
                              ? (lang === "ar" ? "أونلاين" : "Online")
                              : (lang === "ar" ? "مركز" : "Center")}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-sm text-foreground/50 flex items-center justify-between"
        >
          <span>{lang === "ar" ? `تم العثور على ${filteredCourses.length} كورس` : `${filteredCourses.length} courses found`}</span>
          {filteredCourses.length > 0 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6"
            >
              {isNature ? <Leaf className="w-4 h-4 text-amber-400" /> : <Sparkles className="w-4 h-4 text-primary" />}
            </motion.div>
          )}
        </motion.div>

        {/* Courses Grid */}
        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <EmptyState lang={lang} isNature={isNature} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCourses.map((course: any, idx: number) => (
                <motion.div
                  key={course?.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onHoverStart={() => setHoveredCard(idx)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <CourseCardFull
                    course={course}
                    slug={slug!}
                    pick={pick}
                    lang={lang}
                    dir={dir}
                    isNature={isNature}
                    primaryGradient={primaryGradient}
                    isHovered={hoveredCard === idx}
                    onBuyClick={handleOpenModal}
                    getCoursePrice={getCoursePrice}
                    getOriginalPrice={getOriginalPrice}
                    hasDiscount={hasDiscount}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Modal */}
      <RedeemModal
        isOpen={showRedeemModal}
        onClose={handleCloseModal}
        itemId={selectedCourse?.id}
        itemType="course"
        price={selectedCourse ? getCoursePrice(selectedCourse) : 0}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </motion.section>
  );
};

export default CoursesPage;