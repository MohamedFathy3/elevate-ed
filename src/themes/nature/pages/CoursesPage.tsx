/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useCourses, useSubjectCourses } from "@/hooks/useCourses";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { Search, BookOpen, Filter, X, Clock, Users, Calendar, GraduationCap, BookMarked, ShoppingCart, Loader2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";

const CoursesPage = () => {
  const { lang, dir } = useLang();
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
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // ✅ جلب الكورسات حسب semester_id لو موجود
  const { data: semesterCourses, isLoading: semesterLoading } = useCourses(
    semesterId ? parseInt(semesterId) : undefined,
    teacher?.id
  );
  
  // ✅ جلب الكورسات حسب subject_id لو موجود
  const { data: subjectCoursesData, isLoading: subjectLoading } = useSubjectCourses(
    subjectId ? parseInt(subjectId) : undefined,
    teacher?.id
  );
  
  // ✅ الكورسات العامة من الـ Context (عند عدم وجود فلتر)
  const { courses: allCourses, isLoading: allCoursesLoading } = useSafeTeacherData();
  
  // تحديد الكورسات المعروضة بناءً على الفلتر
  const displayCourses = useMemo(() => {
    if (semesterId && semesterCourses) {
      return semesterCourses;
    }
    if (subjectId && subjectCoursesData) {
      return subjectCoursesData;
    }
    return allCourses;
  }, [semesterId, semesterCourses, subjectId, subjectCoursesData, allCourses]);
  
  const isLoading = teacherLoading || semesterLoading || subjectLoading || allCoursesLoading;
  
  // الحصول على جميع المستويات والأنواع المتاحة من الكورسات المعروضة
  const levels = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(displayCourses)) {
      displayCourses.forEach((c: any) => {
        if (c?.level) set.add(c.level);
      });
    }
    return ["all", ...Array.from(set)];
  }, [displayCourses]);
  
  const types = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(displayCourses)) {
      displayCourses.forEach((c: any) => {
        if (c?.type) set.add(c.type);
      });
    }
    return ["all", ...Array.from(set)];
  }, [displayCourses]);
  
  // فلترة الكورسات
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

  if (isLoading) {
    return <CoursesPageSkeleton />;
  }

  // عنوان الصفحة حسب الفلتر
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
    <section className="pt-36 md:pt-40 pb-24 min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container-tight relative">
        {/* Back Button (if filtered) */}
        {(semesterId || subjectId) && (
          <div className="mb-6">
            <Link 
              to={`/courses`}
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              <Arrow className="w-4 h-4" />
              {lang === "ar" ? "جميع الكورسات" : "All Courses"}
            </Link>
          </div>
        )}
        
        {/* Breadcrumb (if filtered) */}
        {(semesterId || subjectId) && (
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap">
            <Link to={``} className="hover:text-primary transition-colors">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/courses`} className="hover:text-primary transition-colors">
              {lang === "ar" ? "الكورسات" : "Courses"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{getPageTitle()}</span>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold text-sm mb-5 backdrop-blur-sm">
            <BookOpen className="w-4 h-4" />
            {lang === "ar" ? "استكشف الكورسات" : "Explore Courses"}
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {getPageTitle()}
            </span>
          </h1>
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
            {getPageDescription()}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-4 h-4 text-foreground/50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن كورس..." : "Search for a course..."}
                className="w-full bg-card border border-border rounded-xl pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {lang === "ar" ? "فلترة" : "Filters"}
              </span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-5 bg-card rounded-xl border border-border"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {lang === "ar" ? "المستوى" : "Level"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((l) => (
                      <button
                        key={l}
                        onClick={() => setSelectedLevel(l)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedLevel === l
                            ? "gradient-primary text-white shadow-soft"
                            : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        {l === "all" ? (lang === "ar" ? "الكل" : "All") : l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {lang === "ar" ? "النوع" : "Type"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedType === t
                            ? "gradient-primary text-white shadow-soft"
                            : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        {t === "all" 
                          ? (lang === "ar" ? "الكل" : "All")
                          : t === "online" 
                            ? (lang === "ar" ? "أونلاين" : "Online")
                            : (lang === "ar" ? "مركز" : "Center")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-foreground/50">
          {lang === "ar" 
            ? `تم العثور على ${filteredCourses.length} كورس`
            : `${filteredCourses.length} courses found`}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <EmptyState lang={lang} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course: any) => (
              <CourseCardFull
                key={course?.id}
                course={course}
                slug={slug!}
                pick={pick}
                lang={lang}
                dir={dir}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// 🟢 Course Card Component with Image + Buy Button (نفس الكود السابق)
const CourseCardFull = ({ course, slug, pick, lang, dir }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  if (!course) return null;
  
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          src={courseImage}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-course.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {hasDiscount && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow-lg z-10">
            🔥 {discountPercent}% OFF
          </div>
        )}
        
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium z-10">
          {course?.type === "online" 
            ? (lang === "ar" ? "💻 أونلاين" : "💻 Online")
            : (lang === "ar" ? "🏢 مركز" : "🏢 Center")}
        </div>
        
        <div className="absolute bottom-3 left-3 right-3 z-10">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">{finalPrice.toFixed(2)} EGP</span>
              <span className="text-xs text-white/60 line-through">{originalPrice.toFixed(2)} EGP</span>
            </div>
          ) : (
            <span className="text-xl font-black text-white">{originalPrice.toFixed(2)} EGP</span>
          )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1 mb-3">
          {stageName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
              <GraduationCap className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{stageName}</span>
            </span>
          )}
          {subjectName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
              <BookMarked className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{subjectName}</span>
            </span>
          )}
          {semesterName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-foreground/70 text-xs">
              <Calendar className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{semesterName}</span>
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
          {courseTitle}
        </h3>
        
        {courseDescription && (
          <div 
            className="text-xs text-foreground/60 line-clamp-2 mb-3"
            dangerouslySetInnerHTML={sanitizeHTML(courseDescription)}
          />
        )}
        
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-foreground/50">
          {lessonsCount > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{lessonsCount} {lang === "ar" ? "دروس" : "lessons"}</span>
            </div>
          )}
          {studentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{studentsCount} {lang === "ar" ? "طالب" : "students"}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{lang === "ar" ? "مرن" : "Flexible"}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBuy}
              disabled={isBuying}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span>{lang === "ar" ? "شراء" : "Buy"}</span>
            </button>
            
            <Link
              to={`/courses/${course?.id}`}
              className="px-3 py-2 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {lang === "ar" ? "تفاصيل" : "Details"}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 🟢 Empty State (نفس الكود السابق)
const EmptyState = ({ lang }: { lang: string }) => {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
        <AlertCircle className="w-12 h-12 text-foreground/30" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {lang === "ar" ? "لا توجد نتائج" : "No results found"}
      </h3>
      <p className="text-foreground/60">
        {lang === "ar"
          ? "لم نجد أي كورسات تطابق معايير البحث الخاصة بك"
          : "No courses match your search criteria"}
      </p>
    </div>
  );
};

// 🟢 Skeleton Component (نفس الكود السابق)
const CoursesPageSkeleton = () => {
  return (
    <section className="pt-36 md:pt-40 pb-24 min-h-screen">
      <div className="container-tight">
        <div className="text-center mb-12">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 animate-pulse" />
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="mb-10">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="flex gap-2">
                  <div className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
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