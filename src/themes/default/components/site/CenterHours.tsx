/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/CenterHours.tsx

import { motion } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  ChevronRight,
  Building,
  Bell,
  Leaf,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export const CenterHours = () => {
  const { lang } = useLang();
  const { colorMode } = useTheme();
  const { centerHours, isLoading } = useSafeTeacherData();
  const { isAuthenticated, student } = useStudentAuth();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // ✅ تحديد الـ mode
  const isDark = colorMode === 'dark';
  const isNature = colorMode === 'nature';
  const isLight = colorMode === 'light';

  // ✅ دالة تنسيق الوقت
  const getTimeDisplay = (hour: any) => {
    const start = hour.hours_start || '';
    const end = hour.hours_end || '';
    
    if (start && end) {
      return `${start} - ${end}`;
    }
    if (start) {
      return start;
    }
    if (end) {
      return end;
    }
    return '';
  };

  // ✅ دالة عرض التاريخ
  const getDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    
    const weekdaysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (weekdaysAr.includes(dateStr) || weekdaysEn.includes(dateStr)) {
      return dateStr;
    }
    
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
    } catch {
      return dateStr;
    }
    
    return dateStr;
  };

  // ✅ دالة الحصول على اليوم
  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    
    const weekdaysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (weekdaysAr.includes(dateStr)) return dateStr;
    if (weekdaysEn.includes(dateStr)) {
      const map: Record<string, string> = {
        'Sunday': 'الأحد',
        'Monday': 'الإثنين',
        'Tuesday': 'الثلاثاء',
        'Wednesday': 'الأربعاء',
        'Thursday': 'الخميس',
        'Friday': 'الجمعة',
        'Saturday': 'السبت'
      };
      return map[dateStr] || dateStr;
    }
    
    return dateStr;
  };

  // ✅ تحديد الألوان حسب colorMode
  const getColors = () => {
    if (isDark) {
      return {
        bg: 'bg-gray-950',
        bgCard: 'bg-gray-900/80',
        bgCardHover: 'hover:bg-gray-800/50',
        border: 'border-gray-800',
        borderHover: 'hover:border-indigo-500/40',
        text: 'text-gray-300',
        textMuted: 'text-gray-400',
        textStrong: 'text-gray-100',
        primary: 'text-indigo-400',
        primaryBg: 'bg-indigo-500/20',
        primaryBgStrong: 'bg-indigo-500/30',
        primaryBorder: 'border-indigo-500/30',
        accent: 'bg-indigo-500/10',
        accentBg: 'bg-indigo-500/20',
        gradient: 'from-indigo-500 to-pink-500',
        noteBg: 'from-indigo-500/10 to-pink-500/10',
        noteBorder: 'border-indigo-500/20',
        noteText: 'text-indigo-400',
        noteTextMuted: 'text-indigo-300/70',
        skeleton: 'bg-gray-700',
        skeletonLight: 'bg-gray-800',
      };
    }
    
    if (isNature) {
      return {
        bg: 'bg-gradient-to-b from-emerald-50/50 via-white to-white',
        bgCard: 'bg-white/80',
        bgCardHover: 'hover:bg-emerald-50',
        border: 'border-emerald-200',
        borderHover: 'hover:border-emerald-400',
        text: 'text-gray-600',
        textMuted: 'text-gray-500',
        textStrong: 'text-gray-800',
        primary: 'text-emerald-600',
        primaryBg: 'bg-emerald-100',
        primaryBgStrong: 'bg-emerald-200',
        primaryBorder: 'border-emerald-200',
        accent: 'bg-emerald-100',
        accentBg: 'bg-emerald-100',
        gradient: 'from-emerald-500 to-emerald-600',
        noteBg: 'from-emerald-100 to-orange-100',
        noteBorder: 'border-emerald-200',
        noteText: 'text-emerald-700',
        noteTextMuted: 'text-emerald-700/70',
        skeleton: 'bg-emerald-100',
        skeletonLight: 'bg-emerald-50',
      };
    }
    
    // Light mode (default)
    return {
      bg: 'bg-gradient-to-b from-indigo-50/50 via-white to-white',
      bgCard: 'bg-white/80',
      bgCardHover: 'hover:bg-indigo-50',
      border: 'border-gray-200/80',
      borderHover: 'hover:border-indigo-400',
      text: 'text-gray-600',
      textMuted: 'text-gray-500',
      textStrong: 'text-gray-800',
      primary: 'text-indigo-600',
      primaryBg: 'bg-indigo-100',
      primaryBgStrong: 'bg-indigo-200',
      primaryBorder: 'border-indigo-200',
      accent: 'bg-indigo-50',
      accentBg: 'bg-indigo-100',
      gradient: 'from-indigo-600 to-pink-500',
      noteBg: 'from-indigo-50 to-pink-50',
      noteBorder: 'border-indigo-200',
      noteText: 'text-indigo-700',
      noteTextMuted: 'text-indigo-700/70',
      skeleton: 'bg-gray-200',
      skeletonLight: 'bg-gray-100',
    };
  };

  const colors = getColors();

  if (isLoading) {
    return <CenterHoursSkeleton colors={colors} />;
  }

  if (!centerHours || centerHours.length === 0) {
    return null;
  }

  // تجميع المواعيد حسب التاريخ
  const groupedHours = centerHours.reduce((acc: any, hour: any) => {
    const date = hour.date || 'unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(hour);
    return acc;
  }, {});

  // ترتيب التواريخ
  const sortedDates = Object.keys(groupedHours);

  const toggleDay = (date: string) => {
    if (expandedDay === date) {
      setExpandedDay(null);
    } else {
      setExpandedDay(date);
    }
  };

  return (
    <section id="center-hours" className={`relative overflow-hidden py-28 md:py-36 transition-colors duration-300 ${colors.bg}`}>
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className={`absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full blur-[120px]
            ${isNature ? 'bg-emerald-300/20' : isDark ? 'bg-indigo-500/10' : 'bg-indigo-300/20'}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container-tight relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold backdrop-blur-xl transition-colors duration-300
              ${isNature 
                ? 'border-emerald-400/20 bg-emerald-100 text-emerald-700' 
                : isDark
                ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
                : 'border-indigo-200/50 bg-indigo-50 text-indigo-600'}`}
          >
            {isNature ? <Leaf className="h-4 w-4" /> : <Building className="h-4 w-4" />}
            {lang === "ar" ? "مواعيد السنتر" : "Center Hours"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className={`mt-8 text-5xl font-black leading-tight tracking-tight md:text-6xl transition-colors duration-300 ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            {lang === "ar" ? "مواعيد الحضور" : "Attendance"}{" "}
            <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              {lang === "ar" ? "للطلاب" : "Schedule"}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className={`mt-6 text-lg max-w-2xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {lang === "ar"
              ? "اختر الموعد المناسب لك من قائمة المواعيد المتاحة"
              : "Choose the suitable time from the available schedule"}
          </motion.p>
        </div>

        {/* STATS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap items-center justify-center gap-6"
        >
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl transition-colors duration-300
            ${isNature 
              ? 'bg-white border-emerald-200' 
              : isDark
              ? 'bg-gray-900/80 border-gray-800'
              : 'bg-white/80 border-gray-200/80'}`}>
            <Calendar className={`w-4 h-4 ${isNature ? 'text-emerald-500' : isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {Object.keys(groupedHours).length} {lang === "ar" ? "أيام" : "Days"}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl transition-colors duration-300
            ${isNature 
              ? 'bg-white border-emerald-200' 
              : isDark
              ? 'bg-gray-900/80 border-gray-800'
              : 'bg-white/80 border-gray-200/80'}`}>
            <Clock className={`w-4 h-4 ${isNature ? 'text-emerald-500' : isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {centerHours.length} {lang === "ar" ? "موعد" : "Times"}
            </span>
          </div>
          {isAuthenticated && student?.type_of_attendance === "center" && (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-xl">
              <Bell className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {lang === "ar" ? "مرحباً، يمكنك اختيار موعدك" : "Welcome, choose your time"}
              </span>
            </div>
          )}
        </motion.div>

        {/* ACCORDION SCHEDULE */}
        <div className="max-w-4xl mx-auto">
          {sortedDates.map((date, idx) => {
            const hours = groupedHours[date];
            const isExpanded = expandedDay === date;
            const dayName = getDayName(date);
            const dateDisplay = getDateDisplay(date);

            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="mb-4"
              >
                <div
                  onClick={() => toggleDay(date)}
                  className={`group cursor-pointer backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 ${colors.bgCard} ${colors.border} ${colors.borderHover}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors.primaryBg}`}>
                        <Calendar className={`w-6 h-6 ${colors.primary}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold transition-colors duration-300 ${
                          isDark ? 'text-gray-100' : isNature ? 'text-emerald-800' : 'text-gray-800'
                        }`}>
                          {dayName || dateDisplay}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {dateDisplay}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.accent} ${colors.primary}`}>
                        {hours.length} {lang === "ar" ? "مواعيد" : "Times"}
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isDark ? 'text-gray-400' : 'text-gray-400'
                        } ${isExpanded ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Hours List */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 mr-0 md:mr-16 space-y-3"
                  >
                    {hours.map((hour: any, hourIdx: number) => {
                      const timeDisplay = getTimeDisplay(hour);
                      const address = hour.address || '';
                      const phone = hour.phone || '';
                      
                      return (
                        <div
                          key={hour.id || hourIdx}
                          className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${colors.bgCard} ${colors.border} ${colors.bgCardHover}`}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.primaryBg}`}>
                                  <Clock className={`w-5 h-5 ${colors.primary}`} />
                                </div>
                                <div>
                                  <h4 className={`font-semibold transition-colors duration-300 ${
                                    isDark ? 'text-gray-100' : isNature ? 'text-emerald-800' : 'text-gray-800'
                                  }`}>
                                    {hour.title || `موعد ${hourIdx + 1}`}
                                  </h4>
                                  <div className={`flex flex-wrap items-center gap-3 text-sm mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{timeDisplay || hour.hours || 'وقت غير محدد'}</span>
                                    </div>
                                    {address && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-[150px]">{address}</span>
                                      </div>
                                    )}
                                    {phone && (
                                      <div className="flex items-center gap-1">
                                        <span>📞</span>
                                        <span>{phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {hour.note && (
                                <div className={`px-3 py-1.5 rounded-full text-xs ${isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                  📌 {hour.note}
                                </div>
                              )}
                            </div>

                            {/* Stage & Subject */}
                            {(hour.stage || hour.subject) && (
                              <div className={`flex flex-wrap items-center gap-3 pt-2 border-t transition-colors duration-300 ${
                                isDark ? 'border-gray-800' : 'border-gray-200/50'
                              }`}>
                                {hour.stage && (
                                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                                    isDark 
                                      ? 'bg-blue-500/20 text-blue-400' 
                                      : isNature
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    <span>{hour.stage}</span>
                                  </div>
                                )}
                                
                                {hour.subject && (
                                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                                    isDark 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : isNature
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-green-50 text-green-600'
                                  }`}>
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>{hour.subject}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* INFO NOTE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-12 p-6 rounded-2xl border transition-colors duration-300 bg-gradient-to-r ${colors.noteBg} ${colors.noteBorder}`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.primary}`} />
            <div>
              <p className={`font-semibold mb-1 ${colors.noteText}`}>
                {lang === "ar" ? "ملاحظة هامة" : "Important Note"}
              </p>
              <p className={`text-sm ${colors.noteTextMuted}`}>
                {lang === "ar"
                  ? "يرجى التواصل مع إدارة السنتر لتأكيد الموعد قبل الحضور، والتأكد من توفر المقاعد"
                  : "Please contact the center administration to confirm the appointment before attending, and check seat availability"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Skeleton Component
const CenterHoursSkeleton = ({ colors }: { colors: any }) => {
  return (
    <section className={`py-28 transition-colors duration-300 ${colors.bg}`}>
      <div className="container-tight">
        <div className="text-center mb-14">
          <div className={`mx-auto h-10 w-40 animate-pulse rounded-full ${colors.skeleton}`} />
          <div className={`mx-auto mt-6 h-16 w-2/3 animate-pulse rounded-2xl ${colors.skeleton}`} />
          <div className={`mx-auto mt-4 h-6 w-1/2 animate-pulse rounded-xl ${colors.skeletonLight}`} />
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-2xl p-5 animate-pulse ${colors.bgCard} ${colors.border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl animate-pulse ${colors.skeleton}`} />
                <div className="flex-1">
                  <div className={`h-6 w-32 rounded-lg animate-pulse ${colors.skeleton}`} />
                  <div className={`h-4 w-24 rounded-lg animate-pulse mt-2 ${colors.skeletonLight}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CenterHours;