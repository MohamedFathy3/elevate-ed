/* eslint-disable @typescript-eslint/no-explicit-any */
// components/lesson/LessonSidebar/RequiredExamCard.tsx

import { motion } from 'framer-motion';
import { FileQuestion, Award, Clock, HelpCircle, Play, CheckCircle, XCircle, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

interface RequiredExamCardProps {
  exam: any;
  onStartExam: () => void;
  lang: string;
  examIndex?: number;
  totalExams?: number;
  isLocked?: boolean;
  attempts?: number;
  maxAttempts?: number;
  isPassed?: boolean;
  isActive?: boolean;
}

export const RequiredExamCard = ({ 
  exam, 
  onStartExam, 
  lang,
  examIndex = 0,
  totalExams = 1,
  isLocked = false,
  attempts = 0,
  maxAttempts = 3,
  isPassed = false,
  isActive = false
}: RequiredExamCardProps) => {
  if (!exam) return null;

  const isRtl = lang === 'ar';
  
  // ✅ تحديد حالة الامتحان
  const getExamStatus = () => {
    if (isPassed) return { 
      label: isRtl ? '✅ تم الاجتياز' : '✅ Passed', 
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
    };
    if (isLocked) return { 
      label: isRtl ? '🔒 مقفول' : '🔒 Locked', 
      color: 'text-gray-500 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
    };
    if (isActive) return { 
      label: isRtl ? '⏳ ينتظر الاجتياز' : '⏳ Waiting', 
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
    };
    return { 
      label: isRtl ? `المحاولة ${attempts + 1}/${maxAttempts}` : `Attempt ${attempts + 1}/${maxAttempts}`, 
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
    };
  };

  const status = getExamStatus();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-2xl border p-5 transition-all ${status.bg} ${
        isActive && !isPassed ? 'ring-2 ring-amber-500/50' : ''
      }`}
    >
      {/* Header مع رقم الامتحان */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPassed 
              ? 'bg-green-500/20' 
              : isLocked 
                ? 'bg-gray-500/20' 
                : isActive
                  ? 'bg-amber-500/20 animate-pulse'
                  : 'bg-amber-500/20'
          }`}>
            {isPassed ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : isLocked ? (
              <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : isActive ? (
              <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
            ) : (
              <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {isRtl ? `الامتحان ${examIndex + 1}` : `Exam ${examIndex + 1}`}
            </h3>
            {totalExams > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRtl 
                  ? `من ${totalExams}` 
                  : `of ${totalExams}`}
              </p>
            )}
          </div>
        </div>
        
        {/* ✅ حالة الامتحان */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isPassed 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
            : isLocked 
              ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400' 
              : isActive
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 animate-pulse'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
        }`}>
          {status.label}
        </span>
      </div>

      {/* معلومات الامتحان */}
      <div className="mb-3">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{exam.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {exam.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            {exam.questions?.length || 0} {isRtl ? "سؤال" : "questions"}
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            {exam.total_marks} {isRtl ? "درجة" : "marks"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {exam.duration_minutes} {isRtl ? "دقيقة" : "min"}
          </span>
        </div>
      </div>

      {/* ✅ رسالة عند القفل */}
      {isLocked && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-950/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Lock className="w-3 h-3" />
            {isRtl 
              ? `🔒 يجب اجتياز الامتحان السابق أولاً`
              : `🔒 Must pass previous exam first`}
          </p>
        </div>
      )}

      {/* ✅ رسالة عند النجاح */}
      {isPassed && (
        <div className="mb-3 p-2 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            {isRtl 
              ? `✅ تم اجتياز الامتحان بنجاح!`
              : `✅ Exam passed successfully!`}
          </p>
        </div>
      )}

      {/* ✅ زر البدء */}
      {!isPassed && !isLocked && (
        <button
          onClick={onStartExam}
          className={`w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
            isActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isActive ? (
            <>
              <Play className="w-4 h-4" />
              {isRtl ? "ابدأ الامتحان" : "Start Exam"}
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              {isRtl ? "مقفول" : "Locked"}
            </>
          )}
        </button>
      )}

      {/* ✅ زر العرض عند النجاح (معطل) */}
      {isPassed && (
        <button
          disabled
          className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default"
        >
          <CheckCircle className="w-4 h-4" />
          {isRtl ? "تم الاجتياز ✓" : "Passed ✓"}
        </button>
      )}
    </motion.div>
  );
};