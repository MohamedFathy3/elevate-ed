// src/pages/stages/components/StageCard.tsx

import { motion } from "framer-motion";
import { BookOpen, Users, Target, Rocket, Lock, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { StageCardProps } from "../StagesPage.types";
import { useLang } from "@/i18n/LanguageContext";

export const StageCard = ({ 
  stage, 
  index, 
  lang, 
  pick, 
  isAuthenticated, 
  studentStageId,
  onNavigate,
  stageColors
}: StageCardProps) => {
  const { dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const stageName = pick(stage.name, stage.name_ar) || `Stage ${index + 1}`;
  const stageImage = stage.image?.fullUrl || stage.image?.previewUrl || null;
  const coursesCount = stage.courses_count || 0;
  const isStudentStage = isAuthenticated && stage.id === studentStageId;
  const isDisabled = isAuthenticated && !isStudentStage;
  const colorIndex = index % stageColors.length;

  const handleClick = () => {
    if (!isDisabled) {
      onNavigate(`/subjects?stage_id=${stage.id}&stage_name=${encodeURIComponent(stageName)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      whileHover={!isDisabled ? { y: -8 } : {}}
      onClick={handleClick}
      className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isDisabled ? 'opacity-60' : ''}`}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 shadow-card hover:shadow-elegant h-full">
        
        {isDisabled && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
            <Lock className="w-12 h-12 text-white/70 mb-2" />
            <p className="text-white/80 text-sm font-semibold text-center px-4">
              {lang === "ar" 
                ? "هذه المرحلة غير متاحة لك"
                : "This stage is not available for you"}
            </p>
          </div>
        )}
        
        {isStudentStage && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
              <CheckCircle className="w-3 h-3" />
              <span>{lang === "ar" ? "مرحلتي" : "My Stage"}</span>
            </div>
          </div>
        )}
        
        <div className="relative h-52 overflow-hidden">
          {stageImage ? (
            <>
              <img
                src={stageImage}
                alt={stageName}
                className={`w-full h-full object-cover transition-transform duration-700 ${!isDisabled ? 'group-hover:scale-110' : ''}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-blue-600/30`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${stageColors[colorIndex]} grid place-items-center`}>
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              {lang === "ar" ? `المرحلة ${index + 1}` : `Stage ${index + 1}`}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
              <BookOpen className="w-3 h-3" />
              <span>{coursesCount} {lang === "ar" ? "كورس" : "Courses"}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
              <Users className="w-3 h-3" />
              <span>{stage.students_count || 0} {lang === "ar" ? "طالب" : "Students"}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-xl mb-2 text-blue-600 dark:text-blue-400 transition-colors line-clamp-1">
            {stageName}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 min-h-[40px]">
            {pick(stage.description, stage.description_ar) || (lang === "ar" 
              ? `برامج تعليمية متكاملة لمرحلة ${stageName}`
              : `Integrated educational programs for ${stageName}`)}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs">
              <Target className="w-3 h-3" />
              <span>{lang === "ar" ? "منهج متكامل" : "Integrated"}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs">
              <Rocket className="w-3 h-3" />
              <span>{lang === "ar" ? "تعلم تفاعلي" : "Interactive"}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${!isDisabled ? 'text-blue-600 dark:text-blue-400 group-hover:gap-3' : 'text-gray-400'}`}>
              {lang === "ar" ? "استكشف الترم" : "Explore Semesters"}
              <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ إضافة GraduationCap المستخدم
import { GraduationCap } from "lucide-react";