/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SubjectsPage.tsx
import { useSearchParams, useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSubjects } from "@/hooks/useSubjects";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ChevronRight, Search, Filter, X, 
  SlidersHorizontal, ChevronDown, ChevronUp, Star, 
  TrendingUp, Users, Clock, Award, ArrowLeft, ArrowRight,
  Lock, CheckCircle, Leaf, Sparkles
} from "lucide-react";
import { useState, useMemo } from "react";

export const SubjectsPage = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const { teacher } = useTeacher();
  const { student, isAuthenticated } = useStudentAuth();
  const [searchParams] = useSearchParams();
  const stageId = searchParams.get('stage_id');
  const stageName = searchParams.get('stage_name');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // الألوان حسب الثيم
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "gradient-primary";
  const bgColor = isNature ? 'bg-cream' : 'bg-background';
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const cardHoverBorder = isNature 
    ? 'hover:border-amber-400' 
    : 'hover:border-primary/30';
  const inputBg = isNature 
    ? (isDark ? 'bg-amber-900/30' : 'bg-white') 
    : 'bg-card';
  
  const { data: subjects, isLoading } = useSubjects(
    stageId ? parseInt(stageId) : undefined,
    teacher?.id
  );
  
  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];
    
    let filtered = [...subjects];
    
    if (searchQuery) {
      filtered = filtered.filter((subject: any) => {
        const subjectName = (lang === "ar" && subject.name_ar ? subject.name_ar : subject.name)?.toLowerCase() || "";
        return subjectName.includes(searchQuery.toLowerCase());
      });
    }
    
    switch (sortBy) {
      case "name_asc":
        filtered.sort((a, b) => {
          const nameA = (lang === "ar" && a.name_ar ? a.name_ar : a.name) || "";
          const nameB = (lang === "ar" && b.name_ar ? b.name_ar : b.name) || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "name_desc":
        filtered.sort((a, b) => {
          const nameA = (lang === "ar" && a.name_ar ? a.name_ar : a.name) || "";
          const nameB = (lang === "ar" && b.name_ar ? b.name_ar : b.name) || "";
          return nameB.localeCompare(nameA);
        });
        break;
      default:
        filtered.sort((a, b) => (a.position || 0) - (b.position || 0));
        break;
    }
    
    return filtered;
  }, [subjects, searchQuery, sortBy, lang]);
  
  const totalResults = filteredSubjects.length;
  const hasResults = totalResults > 0;
  
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setSelectedFeatures([]);
  };
  
  const availableFeatures = [
    { id: "has_courses", label_ar: "يوجد كورسات", label_en: "Has Courses", icon: BookOpen },
    { id: "has_exams", label_ar: "يوجد امتحانات", label_en: "Has Exams", icon: Award },
    { id: "popular", label_ar: "شائع", label_en: "Popular", icon: TrendingUp },
  ];

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
    return <SubjectsSkeleton isNature={isNature} />;
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0], y: [0, -40, -80] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.2 }}
            className={`absolute w-1 h-1 rounded-full ${isNature ? 'bg-amber-400' : 'bg-primary'} ${i % 2 === 0 ? 'left-1/4' : 'right-1/4'}`}
            style={{ top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="container-tight relative">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap">
            <Link to={`/${slug}`} className={`hover:${isNature ? 'text-amber-600' : 'text-primary'} transition-colors`}>
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${slug}/stages`} className={`hover:${isNature ? 'text-amber-600' : 'text-primary'} transition-colors`}>
              {lang === "ar" ? "المراحل" : "Stages"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={`font-medium ${isNature ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'}`}>
              {stageName || (lang === "ar" ? "المواد" : "Subjects")}
            </span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-black ${isNature ? 'text-amber-800 dark:text-amber-100' : ''}`}>
            {stageName || (lang === "ar" ? "المواد الدراسية" : "Subjects")}
          </h1>
          <p className="text-foreground/60 mt-2">
            {lang === "ar" ? "اختر المادة لاستعراض الترمات والكورسات" : "Choose a subject to view semesters and courses"}
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isNature ? 'text-amber-400' : 'text-foreground/40'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن مادة..." : "Search for a subject..."}
                className={`w-full border rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none transition-colors
                  ${inputBg} ${cardBorder} focus:border-${isNature ? 'amber-400' : 'primary'}/50`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className={`w-4 h-4 ${isNature ? 'text-amber-400 hover:text-amber-600' : 'text-foreground/40 hover:text-primary'}`} />
                </button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                showFilters 
                  ? (isNature ? 'bg-amber-600 text-white border-amber-500' : 'gradient-primary text-white border-transparent')
                  : `${inputBg} ${cardBorder} hover:${isNature ? 'border-amber-400' : 'border-primary/40'}`
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">
                {lang === "ar" ? "فلترة وترتيب" : "Filter & Sort"}
              </span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-sm text-foreground/50">
              {lang === "ar" ? "ترتيب حسب:" : "Sort by:"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`${inputBg} ${cardBorder} border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-${isNature ? 'amber-400' : 'primary'}/50`}
            >
              <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
              <option value="name_asc">{lang === "ar" ? "الاسم (أ-ي)" : "Name (A-Z)"}</option>
              <option value="name_desc">{lang === "ar" ? "الاسم (ي-أ)" : "Name (Z-A)"}</option>
            </select>
            
            <div className={`text-sm px-3 py-1.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-secondary text-foreground/50'}`}>
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
                <div className={`mt-4 p-5 rounded-xl border ${inputBg} ${cardBorder}`}>
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
                        <motion.button
                          key={feature.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                            } else {
                              setSelectedFeatures([...selectedFeatures, feature.id]);
                            }
                          }}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                            isSelected
                              ? (isNature ? 'bg-amber-600 text-white' : 'gradient-primary text-white')
                              : `bg-secondary hover:bg-secondary/80`
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{lang === "ar" ? feature.label_ar : feature.label_en}</span>
                        </motion.button>
                      );
                    })}
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
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-24 h-24 mx-auto mb-4 rounded-full grid place-items-center
                  ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                {isNature ? <Leaf className="w-12 h-12 text-amber-400" /> : <Search className="w-12 h-12 text-foreground/30" />}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                {lang === "ar" ? "لا توجد نتائج" : "No results found"}
              </h3>
              <p className="text-foreground/60 mb-6">
                {lang === "ar" 
                  ? `لم نجد أي مادة تطابق "${searchQuery}"`
                  : `No subjects match "${searchQuery}"`}
              </p>
              <button
                onClick={resetFilters}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'gradient-primary'}`}
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
                    isNature={isNature}
                    isDark={isDark}
                    primaryGradient={primaryGradient}
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

// 🟢 Subject Card Component (معدل للثيمات)
const SubjectCard = ({ subject, index, slug, lang, isNature, isDark, primaryGradient }: any) => {
  const subjectName = lang === "ar" && subject.name_ar ? subject.name_ar : subject.name;
  const subjectStage = subject.stage?.name || "";
  
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const cardHoverBorder = isNature 
    ? 'hover:border-amber-400' 
    : 'hover:border-primary/30';
  const iconBg = isNature 
    ? 'from-amber-500 to-orange-600' 
    : 'gradient-primary';
  const titleColor = isNature 
    ? (isDark ? 'text-amber-200' : 'text-amber-800') 
    : '';
  const titleHoverColor = isNature 
    ? 'group-hover:text-amber-600 dark:group-hover:text-amber-400' 
    : 'group-hover:text-primary';
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border transition-all cursor-pointer
        ${cardBg} ${cardBorder} ${cardHoverBorder} shadow-sm hover:shadow-xl`}
    >
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none rounded-2xl"
      />
      
      <Link to={`/${slug}/semesters?subject_id=${subject.id}&subject_name=${encodeURIComponent(subjectName)}`}>
        <div className="p-6">
          {/* Icon */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-12 h-12 rounded-xl ${iconBg} grid place-items-center mb-4 shadow-lg transition-transform`}
          >
            {isNature ? <Leaf className="w-6 h-6 text-white" /> : <BookOpen className="w-6 h-6 text-white" />}
          </motion.div>
          
          {/* Title */}
          <h3 className={`text-xl font-bold mb-2 line-clamp-1 transition-colors ${titleColor} ${titleHoverColor}`}>
            {subjectName}
          </h3>
          
          {/* Stage Info */}
          {subjectStage && (
            <div className={`flex items-center gap-1 text-xs mb-2 ${isNature ? 'text-amber-600/70 dark:text-amber-400/70' : 'text-foreground/50'}`}>
              <ChevronRight className="w-3 h-3" />
              <span>{subjectStage}</span>
            </div>
          )}
          
          {/* Description */}
          <p className={`text-sm line-clamp-2 min-h-[40px] ${isNature ? 'text-amber-700/60 dark:text-amber-300/60' : 'text-foreground/60'}`}>
            {lang === "ar" 
              ? `استعرض الترمات والكورسات المتاحة في ${subjectName}`
              : `Browse semesters and courses available in ${subjectName}`}
          </p>
          
          {/* View Button */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}>
            <div className={`inline-flex items-center gap-2 font-semibold text-sm transition-all group-hover:gap-3
              ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
              {lang === "ar" ? "استعراض" : "View"}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// 🟢 Skeleton Component (معدل للثيمات)
const SubjectsSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="mb-8">
          <div className={`h-4 w-32 rounded mb-4 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-12 w-64 rounded-lg animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-4 w-72 mt-2 rounded animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        
        <div className={`h-12 rounded-xl mb-8 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`rounded-2xl p-6 animate-pulse
              ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className={`w-12 h-12 rounded-xl mb-4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-6 rounded-lg mb-2 w-3/4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg w-1/2 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;