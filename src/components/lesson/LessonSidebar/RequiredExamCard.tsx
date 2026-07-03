/* eslint-disable @typescript-eslint/no-explicit-any */
// components/lesson/RequiredExamCard.tsx
import { motion } from 'framer-motion';
import { FileQuestion, Award, Clock, HelpCircle, Play, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

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
  isPassed = false
}: RequiredExamCardProps) => {
  if (!exam) return null;

  // ✅ تعريف isRtl مرة واحدة فقط
  const isRtl = lang === 'ar';
  const progress = Math.min((attempts / maxAttempts) * 100, 100);
  const remainingAttempts = maxAttempts - attempts;

  // ✅ تحديد حالة الامتحان
  const getExamStatus = () => {
    if (isPassed) return { 
      label: isRtl ? '✅ تم الاجتياز' : '✅ Passed', 
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
    };
    if (isLocked) return { 
      label: isRtl ? '🔒 مقفول' : '🔒 Locked', 
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
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
      className={`rounded-2xl border p-6 transition-all ${status.bg}`}
    >
      {/* Header مع رقم الامتحان */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPassed 
              ? 'bg-green-500/20' 
              : isLocked 
                ? 'bg-red-500/20' 
                : 'bg-amber-500/20'
          }`}>
            {isPassed ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : isLocked ? (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : (
              <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {isRtl ? "الامتحان المطلوب" : "Required Exam"}
            </h3>
            {totalExams > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRtl 
                  ? `الامتحان ${examIndex + 1} من ${totalExams}` 
                  : `Exam ${examIndex + 1} of ${totalExams}`}
              </p>
            )}
          </div>
        </div>
        
        {/* ✅ حالة الامتحان */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isPassed 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
            : isLocked 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
        }`}>
          {status.label}
        </span>
      </div>

      {/* معلومات الامتحان */}
      <div className="mb-4">
        <p className="font-semibold text-gray-900 dark:text-white">{exam.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {exam.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
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

      {/* ✅ شريط التقدم للمحاولات */}
      {!isPassed && !isLocked && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400">
              {isRtl ? "المحاولات المتبقية" : "Remaining attempts"}
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {remainingAttempts} / {maxAttempts}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full ${
                progress >= 100 ? 'bg-red-500' : 'bg-amber-500'
              }`}
            />
          </div>
          {attempts > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              {isRtl 
                ? `⚠️ محاولة ${attempts} من ${maxAttempts}، متبقي ${remainingAttempts} محاولات`
                : `⚠️ Attempt ${attempts} of ${maxAttempts}, ${remainingAttempts} remaining`}
            </p>
          )}
        </div>
      )}

      {/* ✅ رسالة عند القفل */}
      {isLocked && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {isRtl 
              ? `❌ لقد استنفذت جميع المحاولات (${maxAttempts}). يرجى التواصل مع المدرس`
              : `❌ You have used all ${maxAttempts} attempts. Please contact the teacher`}
          </p>
        </div>
      )}

      {/* ✅ زر البدء */}
      {!isPassed && (
        <button
          onClick={onStartExam}
          disabled={isLocked}
          className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isLocked 
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLocked ? (
            <>
              <XCircle className="w-4 h-4" />
              {isRtl ? "الامتحان مقفول" : "Exam Locked"}
            </>
          ) : isPassed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              {isRtl ? "تم الاجتياز ✓" : "Passed ✓"}
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {isRtl ? "ابدأ الامتحان" : "Start Exam"}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* ✅ عرض نتيجة النجاح */}
      {isPassed && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {isRtl 
              ? `✅ تم اجتياز الامتحان بنجاح!`
              : `✅ Exam passed successfully!`}
            {examIndex < totalExams - 1 && (
              <span className="text-amber-600 dark:text-amber-400">
                {isRtl 
                  ? `⏳ انتقل إلى الامتحان التالي (${examIndex + 2}/${totalExams})`
                  : `⏳ Move to next exam (${examIndex + 2}/${totalExams})`}
              </span>
            )}
            {examIndex === totalExams - 1 && (
              <span className="text-emerald-600 dark:text-emerald-400">
                🎉 {isRtl ? "تم اجتياز جميع الامتحانات!" : "All exams passed!"}
              </span>
            )}
          </p>
        </div>
      )}
    </motion.div>
  );
};