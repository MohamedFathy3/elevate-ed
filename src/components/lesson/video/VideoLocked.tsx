/* eslint-disable @typescript-eslint/no-explicit-any */
// components/video/VideoLocked.tsx
import { Lock, FileQuestion } from 'lucide-react';

interface VideoLockedProps {
  requiredExam: any;
  requiredAssignment: any;
  onStartExam?: () => void;
  onStartAssignment?: () => void;
  lang: string;
}

export const VideoLocked = ({
  requiredExam,
  requiredAssignment,
  onStartExam,
  onStartAssignment,
  lang,
}: VideoLockedProps) => {
  const needsAssignment = !requiredExam && !!requiredAssignment;
  const requirement = needsAssignment ? requiredAssignment : requiredExam;

  return (
    <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-card">
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Lock className="w-20 h-20 text-white/30 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          {lang === "ar" ? "هذا الدرس مقفل" : "This lesson is locked"}
        </h3>
        <p className="text-white/60 text-sm mb-6 max-w-md">
          {needsAssignment
            ? (lang === "ar"
              ? "يجب اجتياز الواجب التالي لفتح هذا الدرس"
              : "You must pass the following assignment to unlock this lesson")
            : (lang === "ar"
              ? "يجب اجتياز الامتحان التالي لفتح هذا الدرس"
              : "You must pass the following exam to unlock this lesson")}
        </p>
        {requirement && (
          <button
            onClick={needsAssignment ? onStartAssignment : onStartExam}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <FileQuestion className="w-4 h-4" />
            {needsAssignment
              ? (lang === "ar" ? "ابدأ الواجب" : "Start Assignment")
              : (lang === "ar" ? "ابدأ الامتحان" : "Start Exam")}
          </button>
        )}
      </div>
    </div>
  );
};