// src/pages/student-dashboard/components/SemestersTab.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, ChevronRight } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const SemestersTab = ({ semesters, slug, lang, isNature, isDark, cardBg }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  if (semesters.length === 0) {
    return (
      <EmptyState
        icon={<Award className="w-12 h-12" />}
        title={lang === "ar" ? "لا توجد ترمات" : "No Semesters"}
        message={lang === "ar" ? "لم تشترك في أي ترمات بعد" : "You haven't enrolled in any semesters yet"}
        isNature={isNature}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <Award className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "الترمات المشترك فيها" : "Enrolled Semesters"}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {semesters.map((semester: any, idx: number) => (
          <motion.div
            key={semester.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link to={`/semester/${semester.id}`}>
              <div className={`rounded-xl p-4 transition-all hover:-translate-y-1 cursor-pointer ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold ${isNature ? 'text-amber-700 dark:text-amber-400' : getTextColor()}`}>
                      {lang === "ar" && semester.name_ar ? semester.name_ar : semester.name}
                    </h3>
                    <p className={`text-xs ${getMutedColor()} mt-1`}>
                      {semester.courses?.length || 0} {lang === "ar" ? "كورسات" : "courses"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isNature ? 'text-amber-400' : 'text-gray-400'}`} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};