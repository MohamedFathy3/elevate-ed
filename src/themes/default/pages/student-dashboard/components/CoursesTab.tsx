// src/pages/student-dashboard/components/CoursesTab.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const CoursesTab = ({ courses, slug, lang, isNature, isDark, cardBg }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد كورسات" : "No Courses"}
        message={lang === "ar" ? "لم تشترك في أي كورسات بعد" : "You haven't enrolled in any courses yet"}
        actionLink={`/courses`}
        actionText={lang === "ar" ? "تصفح الكورسات" : "Browse Courses"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <BookOpen className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "كورساتي" : "My Courses"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course: any, idx: number) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link to={`/courses/${course.id}`}>
              <div className={`rounded-xl p-4 transition-all hover:-translate-y-1 cursor-pointer ${cardBg}`}>
                <img
                  src={course.image?.fullUrl || course.imageUrl || "/default-course.jpg"}
                  alt={course.title}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/default-course.jpg"; }}
                />
                <h3 className={`font-bold line-clamp-1 ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
                  {lang === "ar" && course.title_ar ? course.title_ar : course.title}
                </h3>
                <p className={`text-xs ${getMutedColor()} mt-1 flex items-center gap-2`}>
                  <Clock className="w-3 h-3" />
                  {course.details?.length || 0} {lang === "ar" ? "دروس" : "lessons"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};