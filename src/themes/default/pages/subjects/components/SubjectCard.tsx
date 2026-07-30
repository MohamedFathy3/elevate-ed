// src/pages/subjects/components/SubjectCard.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { SubjectCardProps } from "../SubjectsPage.types";

export const SubjectCard = ({ 
  subject, 
  index, 
  slug, 
  lang, 
  pick, 
  primaryGradient, 
  cardBg, 
  cardBorder, 
  cardHoverBorder 
}: SubjectCardProps) => {
  const subjectName = pick(subject.name, subject.name_ar);
  const subjectStage = subject.stage ? pick(subject.stage.name, subject.stage.name_ar) : "";
  const isActive = subject.active !== false;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border transition-all cursor-pointer
        ${cardBg} ${cardBorder} ${cardHoverBorder} shadow-sm hover:shadow-xl`}
    >
      <Link to={`/semesters?subject_id=${subject.id}&subject_name=${encodeURIComponent(subjectName)}`}>
        <div className="p-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${primaryGradient} grid place-items-center mb-4 shadow-lg transition-transform`}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {subjectName}
          </h3>

          {subjectStage && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <GraduationCap className="w-3 h-3" />
              <span>{subjectStage}</span>
            </div>
          )}

          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
              isActive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isActive 
                ? (lang === "ar" ? "نشط" : "Active") 
                : (lang === "ar" ? "غير نشط" : "Inactive")}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="inline-flex items-center gap-2 font-semibold text-sm transition-all group-hover:gap-3 text-blue-600 dark:text-blue-400">
              {lang === "ar" ? "استعراض الترمات" : "View Semesters"}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};