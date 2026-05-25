/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/CenterHours.tsx

import { motion } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentAuth } from "@/context/StudentAuthContext";
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
} from "lucide-react";

export const CenterHours = () => {
  const { lang } = useLang();
  const { centerHours, isLoading } = useSafeTeacherData();
  const { isAuthenticated, student } = useStudentAuth();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  if (isLoading) {
    return <CenterHoursSkeleton />;
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

  // أيام الأسبوع بالعربية
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

  return (
    <section id="center-hours" className="relative overflow-hidden py-28 md:py-36">
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
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]"
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
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2 text-sm font-bold text-accent backdrop-blur-xl"
          >
            <Building className="h-4 w-4" />
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
            <span className="bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent">
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
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-card/50 border border-border backdrop-blur-xl">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">
              {Object.keys(groupedHours).length} {lang === "ar" ? "أيام" : "Days"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-card/50 border border-border backdrop-blur-xl">
            <Clock className="w-4 h-4 text-accent" />
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
                  className="group cursor-pointer bg-card/60 backdrop-blur-xl border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{dayName}</h3>
                        <p className="text-sm text-foreground/50">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
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
                        className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-accent/5 transition-all"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{hour.title}</h4>
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
          className="mt-12 p-6 bg-gradient-to-r from-accent/10 to-pink-500/10 rounded-2xl border border-accent/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">
                {lang === "ar" ? "ملاحظة هامة" : "Important Note"}
              </p>
              <p className="text-sm text-foreground/60">
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

const CenterHoursSkeleton = () => {
  return (
    <section className="py-28">
      <div className="container-tight">
        <div className="text-center mb-14">
          <div className="mx-auto h-10 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto mt-6 h-16 w-2/3 animate-pulse rounded-2xl bg-muted" />
          <div className="mx-auto mt-4 h-6 w-1/2 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card/60 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1">
                  <div className="h-6 w-32 rounded-lg bg-muted" />
                  <div className="h-4 w-24 rounded-lg bg-muted mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};