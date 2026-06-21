/* eslint-disable @typescript-eslint/no-explicit-any */
// components/lesson/LessonLocked.tsx
import { Lock, FileQuestion } from 'lucide-react';

interface LessonLockedProps {
  requiredExam: any;
  onStartExam: () => void;
  lang: string;
}

export const LessonLocked = ({ requiredExam, onStartExam, lang }: LessonLockedProps) => {
  return (
    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8 text-center rounded-2xl">
      <Lock className="w-20 h-20 text-white/30 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">
        {lang === "ar" ? "هذا الدرس مقفل" : "This lesson is locked"}
      </h3>
      <p className="text-white/60 text-sm mb-6 max-w-md">
        {lang === "ar" 
          ? "يجب اجتياز الامتحان التالي لفتح هذا الدرس"
          : "You must pass the following exam to unlock this lesson"}
      </p>
      {requiredExam && (
        <button
          onClick={onStartExam}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <FileQuestion className="w-4 h-4" />
          {lang === "ar" ? "ابدأ الامتحان" : "Start Exam"}
        </button>
      )}
    </div>
  );
};