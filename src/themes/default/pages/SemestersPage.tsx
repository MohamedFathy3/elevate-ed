/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SemestersPage.tsx

import { useSearchParams, useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSemesters } from "@/hooks/useSemesters";
import { useSubjectCourses } from "@/hooks/useCourses";
import { useTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ChevronRight, DollarSign, Clock, Star, ArrowLeft, ArrowRight, 
  ShoppingCart, Loader2, Percent, Users, Calendar, Award, Filter, 
  Search, X, SlidersHorizontal, TrendingUp, Zap, Crown, Sparkles,
  ChevronDown, ChevronUp, Tag, Flame, Leaf, GraduationCap, Layers
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import OfferTimerDisplay from "@/components/ui/OfferTimer";
import { RedeemModal } from "@/components/RedeemModal";

// ✅ دالة مساعدة لحساب الأسعار من الباك اند
const getCoursePrice = (item: any) => {
  // ✅ price هو السعر النهائي (بعد الخصم)
  return parseFloat(item?.price) || 0;
};

const getOriginalPrice = (item: any) => {
  // ✅ original_price هو السعر الأصلي (قبل الخصم)
  return parseFloat(item?.original_price) || parseFloat(item?.price) || 0;
};

const hasDiscount = (item: any) => {
  const discount = parseFloat(item?.discount) || 0;
  const originalPrice = parseFloat(item?.original_price) || 0;
  const finalPrice = parseFloat(item?.price) || 0;
  return discount > 0 && originalPrice > finalPrice;
};

const getDiscountPercent = (item: any) => {
  const originalPrice = parseFloat(item?.original_price) || 0;
  const finalPrice = parseFloat(item?.price) || 0;
  if (originalPrice > 0 && finalPrice > 0 && originalPrice > finalPrice) {
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }
  return 0;
};

export const SemestersPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher, pick } = useTeacher();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subject_id');
  const subjectName = searchParams.get('subject_name');
  const stageId = searchParams.get('stage_id');
  const stageName = searchParams.get('stage_name');
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // الألوان حسب الثيم
  const primaryColor = isNature ? 'amber' : 'primary';
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const bgColor = isNature ? 'bg-amber-50/30' : 'bg-background';
  const cardBg = isNature ? 'bg-white' : 'bg-card';
  const cardBorder = isNature ? 'border-amber-200' : 'border-border';
  const cardHoverBorder = isNature ? 'hover:border-amber-400' : 'hover:border-primary/30';
  const inputBg = isNature ? 'bg-white' : 'bg-card';
  const textPrimary = isNature ? 'text-amber-700 dark:text-amber-400' : 'text-primary';
  const textSecondary = isNature ? 'text-amber-600/70' : 'text-foreground/60';
  
  // حالة الفلترة
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  
  // جلب الترمات
  const { data: semesters, isLoading: semestersLoading, refetch: refetchSemesters } = useSemesters(
    teacher?.id,
    subjectId ? parseInt(subjectId) : undefined
  );
  
  // جلب الكورسات المباشرة
  const { data: directCourses, isLoading: coursesLoading } = useSubjectCourses(
    subjectId ? parseInt(subjectId) : undefined,
    teacher?.id
  );
  
  // فلترة الترمات
  const filteredSemesters = useMemo(() => {
    if (!semesters) return [];
    
    let filtered = [...semesters];
    
    filtered = filtered.filter((s: any) => {
      const price = getCoursePrice(s);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    if (selectedType !== "all") {
      filtered = filtered.filter((s: any) => s.type === selectedType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((s: any) => {
        const name = pick(s.name, s.name_ar)?.toLowerCase() || "";
        return name.includes(searchQuery.toLowerCase());
      });
    }
    
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => getCoursePrice(a) - getCoursePrice(b));
        break;
      case "price_desc":
        filtered.sort((a, b) => getCoursePrice(b) - getCoursePrice(a));
        break;
      case "popularity":
        filtered.sort((a, b) => (b.courses?.length || 0) - (a.courses?.length || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [semesters, searchQuery, priceRange, selectedType, sortBy, pick]);
  
  // فلترة الكورسات المباشرة
  const filteredDirectCourses = useMemo(() => {
    if (!directCourses) return [];
    
    let filtered = [...directCourses];
    
    filtered = filtered.filter((c: any) => {
      const price = getCoursePrice(c);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    if (selectedType !== "all") {
      filtered = filtered.filter((c: any) => c.type === selectedType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((c: any) => {
        const title = pick(c.title, c.title_ar)?.toLowerCase() || "";
        return title.includes(searchQuery.toLowerCase());
      });
    }
    
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => getCoursePrice(a) - getCoursePrice(b));
        break;
      case "price_desc":
        filtered.sort((a, b) => getCoursePrice(b) - getCoursePrice(a));
        break;
      case "popularity":
        filtered.sort((a, b) => (b.count_student || 0) - (a.count_student || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [directCourses, searchQuery, priceRange, selectedType, sortBy, pick]);
  
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  if (semestersLoading || coursesLoading) {
    return <SemestersSkeleton isNature={isNature} />;
  }

  // عنوان الصفحة
  const pageTitle = stageName || subjectName || (lang === "ar" ? "الترمات والكورسات" : "Semesters & Courses");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen pt-32 pb-20 relative overflow-hidden `}
    >
      {/* Background Decorations */}
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
      </div>

      <div className="container-tight relative">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap">
            <Link to={``} className={`hover:${textPrimary} transition-colors`}>
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            
            {stageName ? (
              <>
                <Link to={`/stages`} className={`hover:${textPrimary} transition-colors`}>
                  {lang === "ar" ? "المراحل" : "Stages"}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                
              </>
            )}
            
            <span className={`font-medium ${textPrimary}`}>
              {pageTitle}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-4xl md:text-5xl font-black ${textPrimary}`}>
                {pageTitle}
              </h1>
              <p className={`${textSecondary} mt-2`}>
                {lang === "ar" 
                  ? `اختر الترم المناسب أو الكورس المباشر لبدء التعلم (${totalResults} نتيجة)`
                  : `Choose the right semester or direct course to start learning (${totalResults} results)`}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative min-w-[250px]">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isNature ? 'text-amber-400' : 'text-foreground/50'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "بحث..." : "Search..."}
                className={`w-full border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none transition-colors
                 focus:border-${primaryColor}/50`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className={`w-4 h-4 ${isNature ? 'text-amber-400 hover:text-amber-600' : 'text-foreground/50 hover:text-primary'}`} />
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
                  ? (isNature ? 'bg-amber-600 text-white border-amber-500' : `bg-gradient-to-r ${primaryGradient} text-white border-transparent`)
                  : ` hover:border-${primaryColor}/40`
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">{lang === "ar" ? "فلترة متقدمة" : "Advanced Filters"}</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-${primaryColor}/50`}
            >
              <option value="default">{lang === "ar" ? "ترتيب افتراضي" : "Default Sort"}</option>
              <option value="price_asc">{lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="price_desc">{lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="popularity">{lang === "ar" ? "الأكثر شهرة" : "Most Popular"}</option>
            </select>
            
            <div className={`text-sm px-3 py-1.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-foreground/50'}`}>
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
                <div className={`mt-4 p-5 rounded-xl border `}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        {lang === "ar" ? "نطاق السعر" : "Price Range"} (EGP)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm `}
                            placeholder="Min"
                          />
                        </div>
                        <span className="text-foreground/50">-</span>
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm ${inputBg} ${cardBorder}`}
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        {lang === "ar" ? "نوع الحضور" : "Attendance Type"}
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedType("all")}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedType === "all"
                              ? (isNature ? 'bg-amber-600 text-white' : `bg-gradient-to-r ${primaryGradient} text-white`)
                              : `bg-secondary hover:bg-secondary/80`
                          }`}
                        >
                          {lang === "ar" ? "الكل" : "All"}
                        </button>
                        <button
                          onClick={() => setSelectedType("online")}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedType === "online"
                              ? (isNature ? 'bg-amber-600 text-white' : `bg-gradient-to-r ${primaryGradient} text-white`)
                              : `bg-secondary hover:bg-secondary/80`
                          }`}
                        >
                          💻 {lang === "ar" ? "أونلاين" : "Online"}
                        </button>
                        <button
                          onClick={() => setSelectedType("center")}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedType === "center"
                              ? (isNature ? 'bg-amber-600 text-white' : `bg-gradient-to-r ${primaryGradient} text-white`)
                              : `bg-secondary hover:bg-secondary/80`
                          }`}
                        >
                          🏢 {lang === "ar" ? "سنتر" : "Center"}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-border">
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-foreground/60 hover:text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                      {lang === "ar" ? "إعادة ضبط الفلترة" : "Reset Filters"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Direct Courses Section */}
        {hasDirectCourses && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${primaryGradient} flex items-center justify-center`}>
                {isNature ? <Leaf className="w-5 h-5 text-white" /> : <Flame className="w-5 h-5 text-white" />}
              </div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>
                {lang === "ar" ? "كورسات المراجعه النهائيه" : "Final revision courses "}
              </h2>
              <span className={`text-sm px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-foreground/50'}`}>
                {filteredDirectCourses.length}
              </span>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          </motion.div>
        )}

        {/* Semesters Section */}
        {hasSemesters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${primaryGradient} flex items-center justify-center`}>
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>
                {lang === "ar" ? "الترمات الدراسية" : "Semesters"}
              </h2>
              <span className={`text-sm px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-foreground/50'}`}>
                {filteredSemesters.length}
              </span>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-6"
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
          </motion.div>
        )}
        
        {/* No Results Message */}
        {!hasSemesters && !hasDirectCourses && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {isNature ? <Leaf className="w-10 h-10 text-amber-400" /> : <Search className="w-10 h-10 text-foreground/30" />}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className={`${textSecondary} mb-4`}>
              {lang === "ar" 
                ? "لم نجد أي نتائج تطابق معايير البحث الخاصة بك"
                : "No results match your search criteria"}
            </p>
            <button
              onClick={resetFilters}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white ${isNature ? 'bg-amber-600' : `bg-gradient-to-r ${primaryGradient}`}`}
            >
              <X className="w-4 h-4" />
              {lang === "ar" ? "إعادة ضبط الفلترة" : "Reset Filters"}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Direct Course Card Component with Modal
const DirectCourseCard = ({ course, index, slug, lang, pick, isNature }: any) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  
  // ✅ الأسعار من الباك اند مباشرة
  const finalPrice = parseFloat(course?.price) || 0;
  const originalPrice = parseFloat(course?.original_price) || 0;
  const discountValue = parseFloat(course?.discount) || 0;
  const hasDiscount = discountValue > 0 && originalPrice > finalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
  
  const courseTitle = pick(course.title, course.title_ar) || "Course";
  const courseImage = course.image?.fullUrl || course.imageUrl || "/default-course.jpg";
  const lessonsCount = course.details?.length || 0;
  
  const primaryColor = isNature ? 'amber' : 'primary';
  const textPrimary = isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary';
  
  const handlePaymentSuccess = (data: any) => {
    console.log('✅ Payment success:', data);
    toast.success(lang === "ar" ? 'تم الدفع بنجاح!' : 'Payment successful!');
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    toast.error(lang === "ar" ? 'فشل الدفع، حاول مرة أخرى' : 'Payment failed, please try again');
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRedeemModal(true);
  };
  
  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className={`group rounded-2xl border transition-all overflow-hidden bg-white dark:bg-gray-900 ${isNature ? 'border-amber-200 dark:border-amber-800' : 'border-border'} hover:border-${primaryColor}/30`}
      >
        <Link to={`/courses/${course.id}`}>
          <div className="relative h-40 overflow-hidden">
            <img 
              src={courseImage} 
              alt={courseTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs">
              {course.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
            </div>
            
            {hasDiscount && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold">
                <Percent className="w-3 h-3" />
                {discountPercent}% خصم
              </div>
            )}
          </div>
          
          <div className="p-5">
            <h3 className={`font-bold text-lg line-clamp-1 mb-2 transition-colors ${isNature ? 'text-amber-800 dark:text-amber-200 group-hover:text-amber-600' : 'group-hover:text-primary'}`}>
              {courseTitle}
            </h3>
            
            <p className="text-sm text-foreground/60 line-clamp-2 mb-3">
              {pick(course.description, course.description_ar)?.replace(/<[^>]*>/g, '')}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-foreground/50 mb-4">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {lessonsCount} {lang === "ar" ? "دروس" : "lessons"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${textPrimary}`}>
                      {finalPrice.toFixed(2)} EGP
                    </span>
                    <span className="text-xs text-foreground/40 line-through">{originalPrice.toFixed(2)} EGP</span>
                  </div>
                ) : (
                  <span className={`text-xl font-bold ${textPrimary}`}>
                    {finalPrice.toFixed(2)} EGP
                  </span>
                )}
              </div>
              
              <button
                onClick={handleBuyClick}
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-1
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}
              >
                <ShoppingCart className="w-4 h-4" />
                {lang === "ar" ? "شراء" : "Buy"}
              </button>
            </div>
          </div>
        </Link>
      </motion.div>

      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        itemId={course.id}
        itemType="course"
        price={finalPrice}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};

// Semester Card Component with Modal
const SemesterCard = ({ semester, index, slug, lang, pick, refetchSemesters, isNature }: any) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  
  // ✅ الأسعار من الباك اند مباشرة
  const finalPrice = parseFloat(semester?.price) || 0;
  const originalPrice = parseFloat(semester?.original_price) || 0;
  const discountValue = parseFloat(semester?.discount) || 0;
  const hasDiscount = discountValue > 0 && originalPrice > finalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
    
  const coursesCount = semester.courses?.length || 0;
  
  // ✅ جلب تواريخ العرض
  const offerStartDate = semester?.offer_start_date;
  const offerEndDate = semester?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;
  
  const semesterImageUrl = semester.image?.fullUrl || semester.imageUrl;
  const defaultImage = isNature 
    ? "https://images.unsplash.com/photo-1434030216411-0b793f4f4173?w=400&h=200&fit=crop"
    : "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop";
  
  const finalImageUrl = semesterImageUrl || defaultImage;
  const primaryColor = isNature ? 'amber' : 'primary';
  const textPrimary = isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary';
  
  const handlePaymentSuccess = (data: any) => {
    console.log('✅ Payment success:', data);
    toast.success(lang === "ar" ? 'تم شراء الترم بنجاح!' : 'Semester purchased successfully!');
    setTimeout(() => refetchSemesters(), 2000);
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    toast.error(lang === "ar" ? 'فشل الدفع، حاول مرة أخرى' : 'Payment failed, please try again');
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRedeemModal(true);
  };
  
  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className={`group relative rounded-2xl border transition-all overflow-hidden bg-white dark:bg-gray-900 ${isNature ? 'border-amber-200 dark:border-amber-800' : 'border-border'} hover:border-${primaryColor}/30`}
      >
        <div className="relative h-56 md:h-60 lg:h-64 overflow-hidden bg-gradient-to-br from-amber-100/50 to-orange-100/50 dark:from-amber-900/30 dark:to-orange-900/30">
          <img 
            src={finalImageUrl} 
            alt={pick(semester.name, semester.name_ar)}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => { 
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full backdrop-blur-md bg-black/50 text-white border border-white/20 shadow-lg">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{coursesCount} {lang === "ar" ? "كورسات" : "courses"}</span>
          </div>
          
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
              <Percent className="w-3.5 h-3.5" />
              {discountPercent}% OFF
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-8 h-8 rounded-lg ${isNature ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-secondary'} grid place-items-center`}>
              {isNature ? (
                <Leaf className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Crown className="w-4 h-4 text-primary" />
              )}
            </div>
          </div>

          <h3 className={`text-xl font-bold mb-2 transition-colors line-clamp-1 ${isNature ? 'text-amber-800 dark:text-amber-200 group-hover:text-amber-600' : 'group-hover:text-primary'}`}>
            {pick(semester.name, semester.name_ar)}
          </h3>
          
          {semester.description && (
            <p className="text-sm text-foreground/60 mb-3 line-clamp-2">
              {pick(semester.description, semester.description_ar)}
            </p>
          )}

          <div className="mt-3">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-2xl font-black text-amber-800`}>
                  {finalPrice.toFixed(2)} EGP
                </span>
                <span className="text-sm text-amber-700 line-through">{originalPrice.toFixed(2)} EGP</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                  وفر {((originalPrice - finalPrice)).toFixed(2)} EGP
                </span>
              </div>
            ) : (
              <span className={`text-2xl font-black text-amber-800`}>
                {finalPrice.toFixed(2)} EGP
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/60">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lang === "ar" ? "تعلّم بوتيرتك" : "Self-paced"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{lang === "ar" ? "شهادة معتمدة" : "Certificate"}</span>
            </div>
          </div>

          {hasOfferDates && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3"
            >
              <OfferTimerDisplay 
                startDate={offerStartDate} 
                endDate={offerEndDate} 
                lang={lang}
                isDark={false}
                isNature={isNature}
                compact={true}
                showIcon={true}
              />
            </motion.div>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-3">
              <button
                onClick={handleBuyClick}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{lang === "ar" ? "شراء الترم" : "Buy Semester"}</span>
              </button>
              
              <Link
                to={`/courses?semester_id=${semester.id}&semester_name=${encodeURIComponent(pick(semester.name, semester.name_ar))}`}
                className={`
                  inline-flex items-center gap-2 
                  px-4 py-2.5 
                  rounded-xl 
                  border border-gray-200 dark:border-gray-700 
                  text-gray-900 dark:text-white 
                  font-semibold text-sm 
                  transition-all duration-300
                  hover:border-blue-400 dark:hover:border-blue-500 
                  hover:bg-blue-50 dark:hover:bg-blue-950/30
                `}
              >
                {lang === "ar" ? "عرض الكورسات" : "View Courses"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        itemId={semester.id}
        itemType="semester"
        price={finalPrice}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};

// Skeleton Component
const SemestersSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-amber-50/30' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="mb-8">
          <div className={`h-4 w-48 rounded mb-4 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-12 w-64 rounded-lg animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-4 w-72 mt-2 rounded animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`rounded-2xl p-6 animate-pulse ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`w-16 h-6 rounded-full animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              </div>
              <div className={`h-6 rounded-lg mb-2 w-3/4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg w-1/2 mb-4 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-8 rounded-lg w-1/3 mb-4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className="flex gap-4 mb-4">
                <div className={`h-4 rounded w-20 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`h-4 rounded w-20 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
              </div>
              <div className="flex gap-3">
                <div className={`h-10 flex-1 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`h-10 w-28 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemestersPage;