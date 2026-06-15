/* eslint-disable @typescript-eslint/no-explicit-any */
// src/themes/nature/pages/CenterHours.tsx

import { motion } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";
import { 
  Calendar, Clock, MapPin, Phone, NotebookText, 
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  School, Users, Star, Award, Clock8, ExternalLink,
  Sparkles, Leaf, ChevronRight as ChevronRightIcon,
  GraduationCap, BookOpen, Tag
} from "lucide-react";

export const CenterHours = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { teacher, centerHours, slug, isLoading, pick } = useTeacher();
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const hoursList = centerHours || [];
  const totalPages = Math.ceil(hoursList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHours = hoursList.slice(startIndex, startIndex + itemsPerPage);
  
  // ✅ الألوان حسب الثيم
  const bgColor = isNature ? 'bg-amber-50/30' : 'bg-background';
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const cardHoverBorder = isNature 
    ? 'hover:border-amber-400' 
    : 'hover:border-primary/30';
  const badgeBg = isNature 
    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
    : 'bg-primary/10 text-primary';
  const iconColor = isNature ? 'text-amber-500' : 'text-primary';
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const textPrimary = isNature ? 'text-amber-800 dark:text-amber-100' : '';
  
  const formatTime = (time: string) => {
    if (!time) return "";
    return time.substring(0, 5);
  };
  
  const formatDay = (day: string) => {
    if (lang === "ar") {
      const daysMap: Record<string, string> = {
        "Sunday": "الأحد",
        "Monday": "الإثنين", 
        "Tuesday": "الثلاثاء",
        "Wednesday": "الأربعاء",
        "Thursday": "الخميس",
        "Friday": "الجمعة",
        "Saturday": "السبت",
      };
      return daysMap[day] || day;
    }
    return day;
  };

  if (isLoading) {
    return <CenterHoursSkeleton isNature={isNature} />;
  }

  if (!hoursList.length) {
    return (
      <div className={`min-h-screen pt-32 pb-20 relative overflow-hidden ${bgColor}`}>
        <div className="container-tight text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
            <Calendar className="w-16 h-16 text-foreground/30" />
          </div>
          <h1 className="text-2xl font-bold mb-3">
            {lang === "ar" ? "لا توجد مواعيد سنتر" : "No Center Hours Available"}
          </h1>
          <p className="text-foreground/60 mb-6">
            {lang === "ar" 
              ? "سيتم إضافة مواعيد السنتر قريباً"
              : "Center hours will be added soon"}
          </p>
          <Link
            to={`/${slug}`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${primaryGradient} text-white font-semibold`}
          >
            <Arrow className="w-4 h-4" />
            {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    );
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
            <ChevronRightIcon className="w-4 h-4" />
            <span className={`font-medium ${isNature ? 'text-amber-700 dark:text-amber-400' : 'text-primary'}`}>
              {lang === "ar" ? "مواعيد السنتر" : "Center Hours"}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-4xl md:text-5xl font-black ${textPrimary}`}>
                {lang === "ar" ? "مواعيد السنتر الأسبوعية" : "Weekly Center Hours"}
              </h1>
              <p className="text-foreground/60 mt-2">
                {teacher?.name} | {lang === "ar" 
                  ? "اختر الميعاد المناسب لك للحضور"
                  : "Choose the suitable time for attendance"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <StatCard
            icon={<Calendar className="w-6 h-6 text-white" />}
            value={hoursList.length}
            label={lang === "ar" ? "مواعيد متاحة" : "Available Hours"}
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            icon={<School className="w-6 h-6 text-white" />}
            value={new Set(hoursList.map((h: any) => h.stage_id)).size}
            label={lang === "ar" ? "مراحل دراسية" : "Stages"}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            value={new Set(hoursList.map((h: any) => h.subject_id)).size}
            label={lang === "ar" ? "مواد دراسية" : "Subjects"}
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-white" />}
            value="4.9"
            label={lang === "ar" ? "تقييم الطلاب" : "Student Rating"}
            gradient="from-yellow-500 to-amber-600"
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {paginatedHours.map((hour: any, i: number) => (
            <motion.div
              key={hour.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className={`relative rounded-2xl border transition-all overflow-hidden ${cardBg} ${cardBorder} ${cardHoverBorder} shadow-soft hover:shadow-elegant h-full`}>
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${primaryGradient}`} />
                
                {/* Day Badge */}
                <div className="pt-5 px-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeBg} text-sm font-medium`}>
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDay(hour.date)}
                  </div>
                </div>

                {/* Title */}
                <div className="px-5 mt-3">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {hour.title}
                  </h3>
                </div>

                {/* ✅ Stage & Subject - المُضافة حديثاً */}
                <div className="px-5 mt-3 space-y-2">
                  {/* Stage */}
                  {hour.stage && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className={`w-4 h-4 ${iconColor}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ar" ? "المرحلة: " : "Stage: "}
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {hour.stage}
                        </span>
                      </span>
                    </div>
                  )}
                  
                  {/* Subject */}
                  {hour.subject && (
                    <div className="flex items-center gap-2">
                      <BookOpen className={`w-4 h-4 ${iconColor}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {lang === "ar" ? "المادة: " : "Subject: "}
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {hour.subject}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Time */}
                <div className="px-5 mt-3 flex items-center gap-2">
                  <Clock8 className={`w-4 h-4 ${iconColor}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {formatTime(hour.hours_start)} - {formatTime(hour.hours_end)}
                  </span>
                </div>

                {/* Address */}
                {hour.address && (
                  <div className="px-5 mt-2 flex items-start gap-2">
                    <MapPin className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {hour.address}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {hour.phone && (
                  <div className="px-5 mt-2 flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${iconColor}`} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {hour.phone}
                    </span>
                  </div>
                )}

                {/* Note */}
                {hour.note && (
                  <div className="px-5 mt-2 pb-4 flex items-start gap-2">
                    <NotebookText className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                    <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                      {hour.note}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl ${cardBg} border ${cardBorder} text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-${isNature ? 'amber' : 'primary'}-50 dark:hover:bg-${isNature ? 'amber' : 'primary'}-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {dir === "rtl" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    currentPage === page
                      ? `bg-gradient-to-r ${primaryGradient} text-white shadow-md`
                      : `${cardBg} border ${cardBorder} text-slate-600 dark:text-slate-400 hover:bg-${isNature ? 'amber' : 'primary'}-50 dark:hover:bg-${isNature ? 'amber' : 'primary'}-900/30`
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-xl ${cardBg} border ${cardBorder} text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-${isNature ? 'amber' : 'primary'}-50 dark:hover:bg-${isNature ? 'amber' : 'primary'}-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {dir === "rtl" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 🟢 Stat Card Component
const StatCard = ({ icon, value, label, gradient }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg text-center`}
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
const CenterHoursSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-amber-50/30' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="mb-8">
          <div className={`h-4 w-48 rounded mb-4 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-12 w-64 rounded-lg animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-4 w-72 mt-2 rounded animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`p-5 rounded-2xl animate-pulse ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className={`w-12 h-12 rounded-xl mx-auto mb-3 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-8 w-16 rounded-lg mx-auto mb-2 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-3 w-20 rounded mx-auto animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`rounded-2xl p-6 animate-pulse ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className={`h-6 rounded-lg mb-4 w-32 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-8 rounded-lg mb-3 w-3/4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg mb-2 w-28 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg mb-2 w-full animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg w-3/4 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CenterHours;