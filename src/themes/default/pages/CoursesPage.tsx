/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useCourses, useSubjectCourses } from "@/hooks/useCourses";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useTheme } from "@/context/ThemeContext";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { 
  Search, BookOpen, Filter, X, Clock, Users, Calendar, 
  GraduationCap, BookMarked, ShoppingCart, Loader2, 
  AlertCircle, ArrowLeft, ArrowRight, Sparkles, Zap, Leaf,
  Star, TrendingUp, Award, Percent
} from "lucide-react";
import DOMPurify from "dompurify";
import  OfferTimerDisplay  from "@/components/ui/OfferTimer";

const CoursesPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher, pick, isLoading: teacherLoading } = useSafeTeacherData();
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
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // الألوان حسب الثيم
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const bgColor = isNature ? 'bg-cream' : 'bg-background';
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const cardHoverBorder = isNature 
    ? 'hover:border-amber-400' 
    : 'hover:border-primary/40';
  const inputBg = isNature 
    ? (isDark ? 'bg-amber-900/30' : 'bg-white') 
    : 'bg-card';
  
  // جلب الكورسات
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
  
  const isLoading = teacherLoading || semesterLoading || subjectLoading || allCoursesLoading;
  
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

  if (isLoading) {
    return <CoursesPageSkeleton isNature={isNature} />;
  }

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

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`pt-36 md:pt-40 pb-24 min-h-screen relative overflow-hidden `}
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
        {/* Floating particles */}
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
                className={`mt-4 p-5 rounded-xl border overflow-hidden `}
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
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

// 🟢 Course Card Component (معدل للثيمات مع دعم dark mode)
const CourseCardFull = ({ course, slug, pick, lang, dir, isNature, primaryGradient, isHovered }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { theme, colorMode } = useTheme();
  const { buyCourse } = useBuyCourse();
  
  const isDark = colorMode === 'dark';
  
  if (!course) return null;
  const offerStartDate = course?.offer_start_date;
  const offerEndDate = course?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  
  const getImageUrl = () => {
    if (course?.image?.fullUrl) return course.image.fullUrl;
    if (course?.imageUrl) return course.imageUrl;
    if (course?.image?.previewUrl) {
      if (course.image.previewUrl.startsWith('http')) return course.image.previewUrl;
      return `https://lms.dentin.cloud${course.image.previewUrl}`;
    }
    return '/default-course.jpg';
  };
  
  const courseImage = getImageUrl();
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  const stageName = pick(course?.stage?.name, course?.stage?.name_ar) || "";
  const subjectName = pick(course?.subject?.name, course?.subject?.name_ar) || "";
  const semesterName = pick(course?.semester?.name, course?.semester?.name_ar) || "";
  const lessonsCount = course?.details?.length || 0;
  const studentsCount = course?.count_student || 0;
  
  // ألوان ديناميكية حسب الثيم والوضع
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/40 backdrop-blur-sm' : 'bg-white')
    : (isDark ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white');
    
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-700/50' : 'border-amber-200')
    : (isDark ? 'border-gray-700' : 'border-border');
    
  const cardHoverBorder = isNature 
    ? (isDark ? 'hover:border-amber-500' : 'hover:border-amber-400')
    : (isDark ? 'hover:border-primary/50' : 'hover:border-primary/40');
    
  const titleColor = isNature 
    ? (isDark ? 'text-amber-100' : 'text-amber-800')
    : (isDark ? 'text-gray-100' : '');
    
  const titleHoverColor = isNature 
    ? (isDark ? 'group-hover:text-amber-300' : 'group-hover:text-amber-600')
    : (isDark ? 'group-hover:text-primary' : 'group-hover:text-primary');
    
  const tagBg = isNature 
    ? (isDark ? 'bg-amber-800/50 text-amber-200' : 'bg-amber-100 text-amber-700')
    : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-primary/10 text-primary');
    
  const priceColor = isNature 
    ? (isDark ? 'text-amber-200' : 'text-amber-800')
    : (isDark ? 'text-gray-100' : '');
    
  const buttonBg = isNature 
    ? (isDark ? 'bg-amber-700 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700')
    : 'bg-gradient-to-r from-emerald-500 to-teal-600';
    
  const detailButtonBg = isNature 
    ? (isDark ? 'border-amber-700 bg-amber-900/30 hover:bg-amber-800/50' : 'border-amber-200 bg-white hover:bg-amber-50')
    : (isDark ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5');
  
  const sanitizeHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i'] }) };
  };
  
  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBuying) return;
    setIsBuying(true);
    try {
      await buyCourse(course.id, finalPrice);
    } finally {
      setIsBuying(false);
    }
  };
  
  return (
    <motion.div
      className={`group relative rounded-xl border transition-all duration-300 overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl
        ${cardBg} ${cardBorder} ${cardHoverBorder}`}
      animate={isHovered ? { scale: 1.02, y: -5 } : { scale: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated shine effect on hover */}
      <motion.div
        className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20 pointer-events-none
          bg-gradient-to-r from-transparent via-${isNature ? 'white' : 'white'}/10 to-transparent`}
      />
      
      {/* Image Section */}
      <div className={`relative h-44 overflow-hidden ${isNature ? '' : 'bg-gradient-to-br from-primary/20 to-accent/20'}`}>
        <motion.img
          src={courseImage}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = '/default-course.jpg'; }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* ✅ خصم فقط من غير مؤقت */}
        {hasDiscount && (
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-3 left-3 z-10"
          >
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold shadow-lg">
              <Percent className="w-3 h-3" />
              <span>{discountPercent}% خصم</span>
            </div>
          </motion.div>
        )}
        
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium z-10">
          {course?.type === "online" 
            ? (lang === "ar" ? "💻 أونلاين" : "💻 Online")
            : (lang === "ar" ? "🏢 مركز" : "🏢 Center")}
        </div>
        
        <div className="absolute bottom-3 left-3 right-3 z-10">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-black ${priceColor} drop-shadow-md`}>{finalPrice.toFixed(2)} EGP</span>
              <span className="text-xs text-white/50 line-through">{originalPrice.toFixed(2)} EGP</span>
            </div>
          ) : (
            <span className={`text-xl font-black ${priceColor} drop-shadow-md text-white`}>{originalPrice.toFixed(2)} EGP</span>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {stageName && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagBg}`}
            >
              <GraduationCap className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{stageName}</span>
            </motion.span>
          )}
          {subjectName && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagBg}`}>
              <BookMarked className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{subjectName}</span>
            </span>
          )}
          {semesterName && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${isNature 
                ? (isDark ? 'bg-amber-800/40 text-amber-300' : 'bg-amber-50 text-amber-600')
                : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-secondary text-foreground/70')}`}
            >
              <Calendar className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{semesterName}</span>
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className={`font-bold text-base mb-2 line-clamp-2 min-h-[48px] transition-colors ${titleColor} ${titleHoverColor}`}>
          {courseTitle}
        </h3>
        
        {/* Description */}
        {courseDescription && (
          <div 
            className={`text-xs line-clamp-2 mb-3 ${isNature ? (isDark ? 'text-amber-300/70' : 'text-amber-700/60') : (isDark ? 'text-gray-400' : 'text-foreground/60')}`}
            dangerouslySetInnerHTML={sanitizeHTML(courseDescription)}
          />
        )}
        
        {/* Stats */}
        <div className={`flex flex-wrap gap-3 mb-3 text-xs ${isNature ? (isDark ? 'text-amber-400/60' : 'text-amber-600/60') : (isDark ? 'text-gray-400' : 'text-foreground/50')}`}>
          {lessonsCount > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{lessonsCount} {lang === "ar" ? "دروس" : "lessons"}</span>
            </div>
          )}
   
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{lang === "ar" ? "مرن" : "Flexible"}</span>
          </div>
        </div>

        {/* ✅ المؤقت جوة الكارد من تحت */}
        {hasOfferDates && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3"
          >
            <OfferTimerDisplay 
              startDate={offerStartDate} 
              endDate={offerEndDate} 
              lang={lang}
              isDark={isDark}
              isNature={isNature}
              compact={true}
              showIcon={true}
            />
          </motion.div>
        )}
        
        {/* Buttons */}
        <div className="mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuy}
              disabled={isBuying}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50
                ${buttonBg} text-white`}
            >
              {isBuying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span>{lang === "ar" ? "شراء" : "Buy"}</span>
            </motion.button>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={`/courses/${course?.id}`}
                className={`px-3 py-2 rounded-xl border font-semibold text-sm transition-all
                  ${detailButtonBg} ${isNature ? (isDark ? 'text-amber-200' : 'text-amber-700') : (isDark ? 'text-gray-200' : 'text-foreground')}`}
              >
                {lang === "ar" ? "تفاصيل" : "Details"}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const EmptyState = ({ lang, isNature }: { lang: string; isNature: boolean }) => {
  return (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`w-24 h-24 mx-auto mb-4 rounded-full grid place-items-center
          ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'}`}
      >
        {isNature ? <Leaf className="w-12 h-12 text-amber-400" /> : <AlertCircle className="w-12 h-12 text-foreground/30" />}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">
        {lang === "ar" ? "لا توجد نتائج" : "No results found"}
      </h3>
      <p className="text-foreground/60">
        {lang === "ar"
          ? "لم نجد أي كورسات تطابق معايير البحث الخاصة بك"
          : "No courses match your search criteria"}
      </p>
    </motion.div>
  );
};

// 🟢 Skeleton Component (معدل للثيمات)
const CoursesPageSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <section className={`pt-36 md:pt-40 pb-24 min-h-screen ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="text-center mb-12">
          <div className={`h-8 w-32 rounded-full mx-auto mb-5 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-12 w-64 rounded-lg mx-auto animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        <div className="mb-10">
          <div className={`h-12 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`rounded-xl overflow-hidden animate-pulse
              ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className={`h-44 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className="p-4">
                <div className={`h-4 rounded w-1/2 mb-3 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`h-5 rounded mb-2 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`h-4 rounded w-3/4 mb-3 ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className="flex gap-2">
                  <div className={`h-9 flex-1 rounded-xl ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  <div className={`h-9 w-16 rounded-xl ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default CoursesPage;