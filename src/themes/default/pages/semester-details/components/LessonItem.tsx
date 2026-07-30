// src/pages/semester-details/components/LessonItem.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LessonItemProps } from "../SemesterDetails.types";

export const LessonItem = ({ 
  lesson, 
  index, 
  slug, 
  lang, 
  isAuthenticated, 
  isNature, 
  isDark 
}: LessonItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  const lessonTitle = lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;
  const isPurchased = isAuthenticated;
  const isFree = parseFloat(String(lesson.price || 0)) === 0;
  const canWatch = isPurchased || isFree;
  
  const handleWatch = () => {
    navigate(`/lesson/${lesson.id}`);
  };
  
  const numberBg = isNature 
    ? (isDark ? 'bg-amber-700' : 'bg-amber-600') 
    : 'bg-primary/10';
  const hoverBg = isNature 
    ? (isDark ? 'hover:bg-amber-800/30' : 'hover:bg-amber-50') 
    : 'hover:bg-primary/5';
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  
  return (
    <div className={`rounded-xl border overflow-hidden ${cardBg} ${cardBorder}`}>
      <div 
        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${hoverBg}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0
            ${numberBg} ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-primary'}`}>
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-medium truncate">{lessonTitle}</h5>
            <div className="flex items-center gap-2 text-xs text-foreground/40">
              <span>{new Date(lesson.lession_date || '').toLocaleDateString()}</span>
              <span>{lesson.lession_time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isFree && !isPurchased && (
            <span className={`text-sm font-bold ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
              {parseFloat(String(lesson.price || 0)).toFixed(2)}
            </span>
          )}
          
          {canWatch && (
            <button
              onClick={(e) => { e.stopPropagation(); handleWatch(); }}
              className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1
                ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'gradient-primary'}`}
            >
              <PlayCircle className="w-3 h-3" />
              <span className="hidden sm:inline">{lang === "ar" ? "مشاهدة" : "Watch"}</span>
            </button>
          )}
          
          {!canWatch && !isFree && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1
              ${isNature 
                ? 'bg-amber-100 text-amber-500 dark:bg-amber-800 dark:text-amber-500' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground/40'}`}>
              <Lock className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 pt-0 border-t" 
            style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}
          >
            <p className="text-sm text-foreground/60 line-clamp-3">
              {lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};