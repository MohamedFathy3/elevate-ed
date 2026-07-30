// src/pages/student-dashboard/components/LessonsTab.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const LessonsTab = ({ lessons, slug, lang, isNature, isDark, cardBg }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  if (lessons.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد دروس" : "No Lessons"}
        message={lang === "ar" ? "لم يتم إضافة أي دروس بعد" : "No lessons have been added yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <Clock className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "الدروس المتاحة" : "Available Lessons"}
        </h2>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson: any, idx: number) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ x: 5 }}
            className={`rounded-xl p-4 transition-all ${cardBg}`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex-1">
                <h3 className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
                  {lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
                </h3>
                <p className={`text-xs ${getMutedColor()}`}>
                  {lesson.course?.title || (lang === "ar" ? "بدون كورس" : "No course")}
                </p>
                <div className={`flex items-center gap-3 mt-2 text-xs ${getMutedColor()}`}>
                  <span>{lesson.lession_date ? new Date(lesson.lession_date).toLocaleDateString() : '-'}</span>
                  <span>{lesson.lession_time || '-'}</span>
                </div>
              </div>
              <Link
                to={`/lesson/${lesson.id}`}
                className={`px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap
                  ${isNature 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-gradient-to-r from-primary to-accent'}`}
              >
                {lang === "ar" ? "مشاهدة" : "Watch"}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};