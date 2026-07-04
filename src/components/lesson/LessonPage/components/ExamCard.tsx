/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle, Lock, Play } from "lucide-react";

interface ExamCardProps {
  exam: any;
  examIndex: number;
  totalExams: number;
  isActive: boolean;
  isPassed: boolean;
  isFailed: boolean;
  isLocked: boolean;
  isHidden: boolean;
  isWaitingResult: boolean;
  onStart: () => void;
  lang: string;
}

export const ExamCard = ({ 
  exam, 
  examIndex, 
  isActive, 
  isPassed, 
  isFailed, 
  isLocked, 
  isHidden, 
  isWaitingResult, 
  onStart, 
  lang 
}: ExamCardProps) => {
  const isRtl = lang === 'ar';
  
  if (isHidden) return null;
  
  let status = '';
  let bgColor = '';
  let icon = null;
  
  if (isWaitingResult) {
    status = isRtl ? '⏳ جاري انتظار النتيجة' : '⏳ Waiting for result';
    bgColor = 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/50';
    icon = <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />;
  } else if (isPassed) {
    status = isRtl ? '✅ نجح' : '✅ Passed';
    bgColor = 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    icon = <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
  } else if (isFailed) {
    status = isRtl ? '❌ فشل' : '❌ Failed';
    bgColor = 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
    icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
  } else if (isActive) {
    status = isRtl ? '⏳ ينتظر' : '⏳ Pending';
    bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 ring-2 ring-amber-500/50';
    icon = <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />;
  } else {
    status = isRtl ? '⏳ ينتظر' : '⏳ Pending';
    bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 ring-2 ring-amber-500/50';
    icon = <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-2xl border p-5 transition-all ${bgColor}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPassed ? 'bg-green-500/20' : 
            isFailed ? 'bg-red-500/20' : 
            isWaitingResult ? 'bg-blue-500/20' :
            (isActive || !isLocked) ? 'bg-amber-500/20' : 
            'bg-gray-500/20'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {isRtl ? `الامتحان ${examIndex + 1}` : `Exam ${examIndex + 1}`}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {exam.title}
            </p>
          </div>
        </div>
        
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isPassed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 
          isFailed ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
          isWaitingResult ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 animate-pulse' :
          (isActive || !isLocked) ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 animate-pulse' : 
          'bg-gray-100 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400'
        }`}>
          {status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>📝 {exam.total_marks} درجة</span>
        <span>🎯 {exam.total_must_pass_marks} درجة للنجاح</span>
        <span>⏱️ {exam.duration_minutes} دقيقة</span>
        {isWaitingResult && (
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            ⏳ جاري تصحيح الإجابات...
          </span>
        )}
        {isFailed && (
          <span className="text-red-600 dark:text-red-400 font-semibold">
            ❌ حصلت على {exam.total || 0} من {exam.total_must_pass_marks || 0}
          </span>
        )}
        {isPassed && (
          <span className="text-green-600 dark:text-green-400 font-semibold">
            ✅ حصلت على {exam.total || 0} من {exam.total_must_pass_marks || 0}
          </span>
        )}
      </div>

      {isWaitingResult && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 cursor-not-allowed">
          <Loader2 className="w-4 h-4 animate-spin" />
          {isRtl ? "⏳ جاري انتظار النتيجة..." : "⏳ Waiting for result..."}
        </div>
      )}

      {!isWaitingResult && !isPassed && !isFailed && (isActive || !isLocked) && (
        <button
          onClick={onStart}
          className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all"
        >
          <Play className="w-4 h-4" />
          {isRtl ? "ابدأ الامتحان" : "Start Exam"}
        </button>
      )}

      {!isWaitingResult && isPassed && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          {isRtl ? "✅ تم الاجتياز" : "✅ Passed"}
        </div>
      )}

      {!isWaitingResult && isFailed && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          <XCircle className="w-4 h-4" />
          {isRtl ? "❌ لم تجتز" : "❌ Failed"}
        </div>
      )}

      {!isWaitingResult && isLocked && !isActive && !isPassed && !isFailed && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <Lock className="w-4 h-4" />
          {isRtl ? "🔒 مقفول" : "🔒 Locked"}
        </div>
      )}
    </motion.div>
  );
};