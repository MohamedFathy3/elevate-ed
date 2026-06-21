// components/lesson/LessonPartsList.tsx
import { motion } from 'framer-motion';
import { Video, Play, Eye, PlayCircle } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { LessonPart } from '@/hooks/useLessonParts';

interface LessonPartsListProps {
  parts: LessonPart[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const LessonPartsList = ({ parts, selectedIndex, onSelect }: LessonPartsListProps) => {
  const { lang } = useLang();

  if (parts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {lang === "ar" ? "أجزاء الدرس" : "Lesson Parts"}
        </h3>
        <span className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
          {parts.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
        {parts.map((part, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full text-left rounded-xl transition-all overflow-hidden border-2 ${
              selectedIndex === idx 
                ? 'border-blue-500 dark:border-blue-400 shadow-md shadow-blue-500/20 bg-blue-50 dark:bg-blue-950/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-900'
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <img 
                src={part.imageUrl || "/default-course.jpg"} 
                alt={part.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    selectedIndex === idx 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <p className={`font-medium text-sm truncate ${
                    selectedIndex === idx 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {lang === "ar" ? part.title_ar : part.title}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <PlayCircle className="w-3 h-3" />
                  {lang === "ar" ? "فيديو تعليمي" : "Educational video"}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                selectedIndex === idx 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }`}>
                {selectedIndex === idx ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};