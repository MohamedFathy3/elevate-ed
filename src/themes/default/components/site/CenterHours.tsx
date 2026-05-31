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
  ChevronLeft,
  Building,
  Users,
  Bell,
  Leaf,
  Sun,
  Moon,
} from "lucide-react";

export const CenterHours = () => {
  const { lang } = useLang();
  const { theme, colorMode } = useTheme();
  const { centerHours, isLoading } = useSafeTeacherData();
  const { isAuthenticated, student } = useStudentAuth();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';

  if (isLoading) {
    return <CenterHoursSkeleton isNature={isNature} />;
  }

  if (!centerHours || centerHours.length === 0) {
    return null;
  }

  // تجميع المواعيد حسب التاريخ
  const groupedHours = centerHours.reduce((acc: any, hour: any) => {
    const date = hour.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(hour);
    return acc;
  }, {});

  // ترتيب التواريخ
  const sortedDates = Object.keys(groupedHours).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // أيام الأسبوع
  const weekdaysAr: Record<string, string> = {
    Saturday: "السبت",
    Sunday: "الأحد",
    Monday: "الإثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
  };

  const weekdaysEn: Record<string, string> = {
    Saturday: "Saturday",
    Sunday: "Sunday",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return lang === "ar" ? weekdaysAr[dayName] : weekdaysEn[dayName];
  };

  const toggleDay = (date: string) => {
    if (expandedDay === date) {
      setExpandedDay(null);
    } else {
      setExpandedDay(date);
    }
  };

  // الألوان حسب الثيم
  const accentColor = isNature ? 'amber' : 'accent';
  const gradientFrom = isNature ? 'from-amber-500' : 'from-accent';
  const gradientTo = isNature ? 'to-orange-500' : 'to-pink-500';
  const bgColor = isNature ? 'bg-cream' : 'bg-background';

  return (
    <section id="center-hours" className={`relative overflow-hidden py-28 md:py-36 ${bgColor}`}>
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
            ${isNature ? 'bg-amber-300/20' : 'bg-accent/20'}`}
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
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold backdrop-blur-xl
              ${isNature 
                ? 'border-amber-400/20 bg-amber-100 text-amber-700' 
                : 'border-accent/20 bg-accent/10 text-accent'}`}
          >
            {isNature ? <Leaf className="h-4 w-4" /> : <Building className="h-4 w-4" />}
            {lang === "ar" ? "مواعيد السنتر" : "Center Hours"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-6xl"
          >
            {lang === "ar" ? "مواعيد الحضور" : "Attendance"}{" "}
            <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
              {lang === "ar" ? "للطلاب" : "Schedule"}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-lg text-foreground/60 max-w-2xl mx-auto"
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
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl
            ${isNature 
              ? 'bg-white border-amber-200' 
              : 'bg-card/50 border-border'}`}>
            <Calendar className={`w-4 h-4 ${isNature ? 'text-amber-500' : 'text-accent'}`} />
            <span className="text-sm font-medium">
              {Object.keys(groupedHours).length} {lang === "ar" ? "أيام" : "Days"}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl
            ${isNature 
              ? 'bg-white border-amber-200' 
              : 'bg-card/50 border-border'}`}>
            <Clock className={`w-4 h-4 ${isNature ? 'text-amber-500' : 'text-accent'}`} />
            <span className="text-sm font-medium">
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
            const formattedDate = new Date(date).toLocaleDateString(
              lang === "ar" ? "ar-EG" : "en-US",
              { month: "long", day: "numeric" }
            );

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
                  className={`group cursor-pointer backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300
                    ${isNature 
                      ? 'bg-white/80 border-amber-200 hover:border-amber-400' 
                      : 'bg-card/60 border-border hover:border-accent/40'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                        ${isNature 
                          ? 'bg-amber-100' 
                          : 'bg-accent/10'}`}>
                        <Calendar className={`w-6 h-6 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isNature ? 'text-amber-800' : ''}`}>{dayName}</h3>
                        <p className="text-sm text-foreground/50">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${isNature 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-accent/10 text-accent'}`}>
                        {hours.length} {lang === "ar" ? "مواعيد" : "Times"}
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-foreground/40 transition-transform duration-300 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
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
                    className="mt-3 ml-16 space-y-3"
                  >
                    {hours.map((hour: any, hourIdx: number) => (
                      <div
                        key={hour.id}
                        className={`backdrop-blur-sm border rounded-xl p-4 transition-all
                          ${isNature 
                            ? 'bg-white/80 border-amber-100 hover:bg-amber-50' 
                            : 'bg-card/40 border-border hover:bg-accent/5'}`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                              ${isNature 
                                ? 'bg-amber-100' 
                                : 'bg-accent/10'}`}>
                              <Clock className={`w-5 h-5 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
                            </div>
                            <div>
                              <h4 className={`font-semibold ${isNature ? 'text-amber-800' : ''}`}>{hour.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-foreground/50 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{hour.hours}</span>
                              </div>
                            </div>
                          </div>
                          {hour.note && (
                            <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs">
                              📌 {hour.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
          className={`mt-12 p-6 rounded-2xl border
            ${isNature 
              ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200' 
              : 'bg-gradient-to-r from-accent/10 to-pink-500/10 border-accent/20'}`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isNature ? 'text-amber-600' : 'text-accent'}`} />
            <div>
              <p className={`font-semibold mb-1 ${isNature ? 'text-amber-800' : ''}`}>
                {lang === "ar" ? "ملاحظة هامة" : "Important Note"}
              </p>
              <p className={`text-sm ${isNature ? 'text-amber-700/70' : 'text-foreground/60'}`}>
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
const CenterHoursSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <section className={`py-28 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="text-center mb-14">
          <div className={`mx-auto h-10 w-40 animate-pulse rounded-full ${isNature ? 'bg-amber-200' : 'bg-muted'}`} />
          <div className={`mx-auto mt-6 h-16 w-2/3 animate-pulse rounded-2xl ${isNature ? 'bg-amber-100' : 'bg-muted'}`} />
          <div className={`mx-auto mt-4 h-6 w-1/2 animate-pulse rounded-xl ${isNature ? 'bg-amber-50' : 'bg-muted'}`} />
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-2xl p-5 animate-pulse
              ${isNature ? 'bg-white border border-amber-200' : 'bg-card/60'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-muted'}`} />
                <div className="flex-1">
                  <div className={`h-6 w-32 rounded-lg animate-pulse ${isNature ? 'bg-amber-100' : 'bg-muted'}`} />
                  <div className={`h-4 w-24 rounded-lg animate-pulse mt-2 ${isNature ? 'bg-amber-50' : 'bg-muted'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};