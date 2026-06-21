/* eslint-disable @typescript-eslint/no-explicit-any */
// components/lesson/RequiredExamCard.tsx
import { motion } from 'framer-motion';
import { FileQuestion, Award, Clock, HelpCircle, Play } from 'lucide-react';

interface RequiredExamCardProps {
  exam: any;
  onStartExam: () => void;
  lang: string;
}

export const RequiredExamCard = ({ exam, onStartExam, lang }: RequiredExamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          {lang === "ar" ? "الامتحان المطلوب" : "Required Exam"}
        </h3>
      </div>

      <div className="mb-4">
        <p className="font-semibold text-gray-900 dark:text-white">{exam.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exam.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span><HelpCircle className="w-3 h-3 inline" /> {exam.questions?.length || 0} {lang === "ar" ? "سؤال" : "questions"}</span>
          <span><Award className="w-3 h-3 inline" /> {exam.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
          <span><Clock className="w-3 h-3 inline" /> {exam.duration_minutes} {lang === "ar" ? "دقيقة" : "min"}</span>
        </div>
      </div>

      <button
        onClick={onStartExam}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
      >
        <Play className="w-4 h-4" />
        {lang === "ar" ? "ابدأ الامتحان" : "Start Exam"}
      </button>
    </motion.div>
  );
};