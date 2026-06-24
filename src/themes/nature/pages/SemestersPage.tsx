/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SemestersPage.tsx
import { useSearchParams, useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSemesters } from "@/hooks/useSemesters";
import { useSubjectCourses } from "@/hooks/useCourses";
import { useTeacher } from "@/context/TeacherContext";
import { useBuyCourse } from "@/hooks/useEnroll";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ChevronRight, DollarSign, Clock, Star, ArrowLeft, ArrowRight, 
  ShoppingCart, Loader2, Percent, Users, Calendar, Award, Filter, 
  Search, X, SlidersHorizontal, TrendingUp, Zap, Crown, Sparkles,
  ChevronDown, ChevronUp, Tag, Flame
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast  } from "@/hooks/use-toast";

export const SemestersPage = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher, pick } = useTeacher();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subject_id');
  const subjectName = searchParams.get('subject_name');
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // ✅ حالة الفلترة
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
  
  // ✅ فلترة وترتيب الترمات
  const filteredSemesters = useMemo(() => {
    if (!semesters) return [];
    
    let filtered = [...semesters];
    
    // فلترة حسب السعر
    filtered = filtered.filter((s: any) => {
      const price = parseFloat(s.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // فلترة حسب نوع الحضور
    if (selectedType !== "all") {
      filtered = filtered.filter((s: any) => s.type === selectedType);
    }
    
    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter((s: any) => {
        const name = pick(s.name, s.name_ar)?.toLowerCase() || "";
        return name.includes(searchQuery.toLowerCase());
      });
    }
    
    // ترتيب النتائج
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case "popularity":
        filtered.sort((a, b) => (b.courses?.length || 0) - (a.courses?.length || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [semesters, searchQuery, priceRange, selectedType, sortBy, pick]);
  
  // ✅ فلترة وترتيب الكورسات المباشرة
  const filteredDirectCourses = useMemo(() => {
    if (!directCourses) return [];
    
    let filtered = [...directCourses];
    
    filtered = filtered.filter((c: any) => {
      const price = parseFloat(c.price) || 0;
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
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
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
  
  if (semestersLoading || coursesLoading) {
    return <SemestersSkeleton />;
  }

  return (
    <div className="container-tight py-32">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap">
          <Link to={``} className="hover:text-primary transition-colors">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/subjects`} className="hover:text-primary transition-colors">
            {lang === "ar" ? "المواد" : "Subjects"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{subjectName || (lang === "ar" ? "المادة" : "Subject")}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              {subjectName || (lang === "ar" ? "الترمات والكورسات" : "Semesters & Courses")}
            </h1>
            <p className="text-foreground/60 mt-2">
              {lang === "ar" 
                ? `اختر الترم المناسب أو الكورس المباشر لبدء التعلم (${totalResults} نتيجة)`
                : `Choose the right semester or direct course to start learning (${totalResults} results)`}
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ar" ? "بحث..." : "Search..."}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-foreground/50 hover:text-primary" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              showFilters ? 'gradient-primary text-white border-transparent' : 'bg-card border-border hover:border-primary/40'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">{lang === "ar" ? "فلترة متقدمة" : "Advanced Filters"}</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
          >
            <option value="default">{lang === "ar" ? "ترتيب افتراضي" : "Default Sort"}</option>
            <option value="price_asc">{lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
            <option value="price_desc">{lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
            <option value="popularity">{lang === "ar" ? "الأكثر شهرة" : "Most Popular"}</option>
          </select>
          
          {/* Results Count Badge */}
          <div className="text-sm text-foreground/50 bg-secondary px-3 py-1.5 rounded-full">
            {totalResults} {lang === "ar" ? "نتيجة" : "results"}
          </div>
        </div>
        
        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 bg-card rounded-xl border border-border">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Price Range */}
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
                          className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm"
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
                          className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      {lang === "ar" ? "نوع الحضور" : "Attendance Type"}
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedType("all")}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedType === "all" ? "gradient-primary text-white" : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        {lang === "ar" ? "الكل" : "All"}
                      </button>
                      <button
                        onClick={() => setSelectedType("online")}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedType === "online" ? "gradient-primary text-white" : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        💻 {lang === "ar" ? "أونلاين" : "Online"}
                      </button>
                      <button
                        onClick={() => setSelectedType("center")}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedType === "center" ? "gradient-primary text-white" : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        🏢 {lang === "ar" ? "سنتر" : "Center"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Reset Filters Button */}
                <div className="mt-5 pt-4 border-t border-border flex justify-end">
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
      </div>

      {/* Direct Courses Section */}
      {hasDirectCourses && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">
              {lang === "ar" ? "كورسات مباشرة" : "Direct Courses"}
            </h2>
            <span className="text-sm text-foreground/50 bg-secondary px-2 py-0.5 rounded-full">
              {filteredDirectCourses.length}
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDirectCourses.map((course: any, index: number) => (
              <DirectCourseCard
                key={course.id}
                course={course}
                index={index}
                slug={slug!}
                lang={lang}
                pick={pick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Semesters Section */}
      {hasSemesters ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">
              {lang === "ar" ? "الترمات الدراسية" : "Semesters"}
            </h2>
            <span className="text-sm text-foreground/50 bg-secondary px-2 py-0.5 rounded-full">
              {filteredSemesters.length}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSemesters.map((semester, i) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                index={i}
                slug={slug!}
                lang={lang}
                pick={(en, ar) => (lang === "ar" ? ar || en : en || ar)}
                refetchSemesters={refetchSemesters}
              />
            ))}
          </div>
        </div>
      ) : !hasDirectCourses ? (
        <EmptyState slug={slug!} lang={lang} Arrow={Arrow} />
      ) : null}
      
      {/* No Results Message */}
      {totalResults === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Search className="w-10 h-10 text-foreground/30" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {lang === "ar" ? "لا توجد نتائج" : "No results found"}
          </h3>
          <p className="text-foreground/60 mb-4">
            {lang === "ar" 
              ? "لم نجد أي نتائج تطابق معايير البحث الخاصة بك"
              : "No results match your search criteria"}
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white"
          >
            <X className="w-4 h-4" />
            {lang === "ar" ? "إعادة ضبط الفلترة" : "Reset Filters"}
          </button>
        </div>
      )}
    </div>
  );
};

// 🟢 Direct Course Card Component (نفس الكود السابق)
const DirectCourseCard = ({ course, index, slug, lang, pick }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  const originalPrice = parseFloat(course.price) || 0;
  const discountPercent = parseFloat(course.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  
  const courseTitle = pick(course.title, course.title_ar) || "Course";
  const courseImage = course.image?.fullUrl || course.imageUrl || "/default-course.jpg";
  const lessonsCount = course.details?.length || 0;
  const studentsCount = course.count_student || 0;
  
  const handleBuyCourse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBuying) return;
    setIsBuying(true);
    try {
      await buyCourse(course.id, finalPrice);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsBuying(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-card rounded-2xl border border-border hover:border-primary/30 transition-all overflow-hidden"
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
              {discountPercent}% OFF
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">
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
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {studentsCount} {lang === "ar" ? "طالب" : "students"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">{finalPrice.toFixed(2)} EGP</span>
                  <span className="text-xs text-foreground/40 line-through">{originalPrice.toFixed(2)} EGP</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-primary">{originalPrice.toFixed(2)} EGP</span>
              )}
            </div>
            
            <button
              onClick={handleBuyCourse}
              disabled={isBuying}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold flex items-center gap-1 disabled:opacity-50"
            >
              {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {lang === "ar" ? "شراء" : "Buy"}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// 🟢 Semester Card Component (محدث مع عرض السعر والخصم)
const SemesterCard = ({ semester, index, slug, lang, pick, refetchSemesters }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buySemester } = useBuyCourse();
  
  const originalPrice = parseFloat(semester.price) || 0;
  const discountPercent = parseFloat(semester.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  const coursesCount = semester.courses?.length || 0;
  
  const handleBuySemester = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBuying) return;
    setIsBuying(true);
    try {
      await buySemester(semester.id, finalPrice);
      setTimeout(() => refetchSemesters(), 2000);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsBuying(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-card rounded-2xl border border-border hover:border-primary/30 transition-all overflow-hidden"
    >
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          <Percent className="w-3 h-3" />
          {discountPercent}% OFF
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          {coursesCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-foreground/50 bg-secondary px-2 py-1 rounded-full">
              <BookOpen className="w-3 h-3" />
              <span>{coursesCount} {lang === "ar" ? "كورسات" : "courses"}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {pick(semester.name, semester.name_ar)}
        </h3>
        
        {semester.description && (
          <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
            {pick(semester.description, semester.description_ar)}
          </p>
        )}

        <div className="mt-4">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-black text-primary">{finalPrice.toFixed(2)} EGP</span>
              <span className="text-sm text-foreground/40 line-through">{originalPrice.toFixed(2)} EGP</span>
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                وفر {((originalPrice - finalPrice)).toFixed(2)} EGP
              </span>
            </div>
          ) : (
            <span className="text-2xl font-black text-primary">{originalPrice.toFixed(2)} EGP</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground/60">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{lang === "ar" ? "تعلّم بوتيرتك" : "Self-paced"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{lang === "ar" ? "شهادة معتمدة" : "Certificate"}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex gap-3">
            <button
              onClick={handleBuySemester}
              disabled={isBuying}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              <span>{lang === "ar" ? "شراء الترم" : "Buy Semester"}</span>
            </button>
            
            <Link
              to={`/courses?semester_id=${semester.id}&semester_name=${encodeURIComponent(pick(semester.name, semester.name_ar))}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {lang === "ar" ? "عرض الكورسات" : "View Courses"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 🟢 Empty State Component
const EmptyState = ({ slug, lang, Arrow }: any) => {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
        <BookOpen className="w-12 h-12 text-foreground/30" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {lang === "ar" ? "لا توجد ترمات أو كورسات" : "No semesters or courses found"}
      </h3>
      <p className="text-foreground/60">
        {lang === "ar" ? "لا توجد ترمات أو كورسات متاحة لهذه المادة حالياً" : "No semesters or courses available for this subject yet"}
      </p>
      <Link
        to={`/subjects`}
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
      >
        <Arrow className="w-4 h-4" />
        {lang === "ar" ? "العودة للمواد" : "Back to Subjects"}
      </Link>
    </div>
  );
};

// 🟢 Skeleton Component
const SemestersSkeleton = () => {
  return (
    <div className="container-tight py-32">
      <div className="mb-8">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-4 w-72 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-4" />
            <div className="flex gap-4 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemestersPage;