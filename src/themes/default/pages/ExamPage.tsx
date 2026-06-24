/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/ExamPage.tsx - ✅ النسخة النهائية المُعاد هيكلتها
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useExamQuestions, useExamDetails, useExamResult } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ استيراد المكونات المُقسّمة
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionCard } from "@/components/exam/QuestionCard/QuestionCard";
import { ExamSkeleton } from "@/components/exam/ExamSkeleton";
import { ExitWarningModal } from "@/components/exam/ExitWarningModal";

// ✅ استيراد الـ Hooks
import { useExamAnswers } from "@/hooks/useExamAnswers";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamSubmission } from "@/hooks/useExamSubmission";

const ExamPage = () => {
  const { lang } = useLang();
  const { slug, examId, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const examIdNum = parseInt(examId || '0');
  
  // ✅ Data fetching
  const { data: examDetails, isLoading: detailsLoading } = useExamDetails(examIdNum);
  const { data: questionsData, isLoading: questionsLoading } = useExamQuestions(examIdNum);
  const { data: resultData } = useExamResult(examIdNum, student?.id || 0);
  
  // ✅ State
  const [submitted, setSubmitted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  
  // ✅ Hooks
  const { answers, essayImages, setAnswer, addEssayImage, removeEssayImage, getAnsweredCount } = useExamAnswers();
  const { submit, isPending } = useExamSubmission(examIdNum, student?.id || 0, answers);
  const { timeLeft, formatTime } = useExamTimer(
    examDetails?.data?.duration_minutes,
    () => handleAutoSubmit()
  );
  
  const exam = examDetails?.data;
  const questions = questionsData?.data || [];
  const totalQuestions = questions.length;
  const answeredCount = getAnsweredCount();
  const hasResult = resultData?.status === true && resultData?.data?.length > 0;
  const currentLessonId = lessonId || exam?.course_detail_id?.id;
  
  // ✅ Check if already submitted
  useEffect(() => {
    if (hasResult && !submitted) {
      toast.info(lang === "ar" ? "📝 لقد قمت بحل هذا الامتحان مسبقاً" : "📝 You have already taken this exam");
      setTimeout(() => {
        if (currentLessonId) navigate(`/lesson/${currentLessonId}`);
        else navigate(`/dashboard`);
      }, 1500);
    }
  }, [hasResult, submitted]);

  // ✅ Handlers
  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      toast.warning(
        lang === "ar" 
          ? `⚠️ الرجاء الإجابة على جميع الأسئلة (${answeredCount}/${totalQuestions})`
          : `⚠️ Please answer all questions (${answeredCount}/${totalQuestions})`
      );
      return;
    }

    submit(
      () => {
        setSubmitted(true);
        toast.success(lang === "ar" ? "🎉 تم حفظ النتيجة بنجاح!" : "🎉 Result saved successfully!");
        setTimeout(() => {
          if (currentLessonId) navigate(`/lesson/${currentLessonId}`);
          else navigate(`/dashboard`);
        }, 2000);
      },
      (error) => {
        console.error("Submit error:", error);
        toast.error(lang === "ar" ? "حدث خطأ في تسليم الامتحان" : "Error submitting exam");
      }
    );
  };

  const handleAutoSubmit = () => {
    if (!submitted && !hasResult && answeredCount > 0) {
      toast.warning(lang === "ar" ? "⏰ انتهى الوقت! يتم تسليم الإجابات تلقائياً." : "⏰ Time's up! Submitting automatically.");
      handleSubmit();
    } else if (!submitted && !hasResult && answeredCount === 0) {
      toast.error(lang === "ar" ? "❌ انتهى الوقت دون إجابة!" : "❌ Time's up with no answers!");
      setTimeout(() => {
        if (currentLessonId) navigate(`/lesson/${currentLessonId}`);
        else navigate(`/dashboard`);
      }, 2000);
    }
  };

  // ✅ Prevent copy
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      if (!submitted && !hasResult) {
        e.preventDefault();
        toast.warning(lang === "ar" ? "النسخ غير مسموح أثناء الامتحان" : "Copying is not allowed during exam");
      }
    };
    document.addEventListener('copy', preventCopy);
    return () => document.removeEventListener('copy', preventCopy);
  }, [submitted, hasResult]);

  if (detailsLoading || questionsLoading) return <ExamSkeleton lang={lang} />;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* ✅ Exit Warning Modal */}
        <AnimatePresence>
          {showExitWarning && (
            <ExitWarningModal
              onContinue={() => setShowExitWarning(false)}
              onLeave={() => {
                setShowExitWarning(false);
                navigate(-1);
              }}
              lang={lang}
            />
          )}
        </AnimatePresence>

        {/* ✅ Header */}
        <ExamHeader
          title={exam?.title || ''}
          description={exam?.description}
          image={exam?.image?.fullUrl}
          totalQuestions={totalQuestions}
          totalMarks={exam?.total_marks || 0}
          duration={exam?.duration_minutes}
          answeredCount={answeredCount}
          onBack={() => {
            if (answeredCount > 0 && !submitted && !hasResult) {
              setShowExitWarning(true);
            } else {
              navigate(-1);
            }
          }}
        />

        {/* ✅ Timer & Progress */}
        <div className="flex justify-between items-center mb-6">
          {timeLeft !== null && !submitted && !hasResult && (
            <ExamTimer timeLeft={timeLeft} formatTime={formatTime} />
          )}
          {!submitted && !hasResult && totalQuestions > 0 && (
            <div className="flex-1 ml-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* ✅ Questions */}
        <div className="space-y-4">
          {questions.map((q: any, idx: number) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              value={answers[q.id]}
              onChange={(val: any) => setAnswer(q.id, val)}
              lang={lang}
              disabled={submitted || hasResult}
              onEssayImageUpload={(imageId: number) => addEssayImage(q.id, imageId)}
              onRemoveEssayImage={(imageId: number) => removeEssayImage(q.id, imageId)}
              essayImages={essayImages[q.id] || []}
            />
          ))}
        </div>

        {/* ✅ Submit Button */}
        {!submitted && !hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={handleSubmit}
              disabled={isPending || answeredCount < totalQuestions}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>{lang === "ar" ? "تسليم الامتحان" : "Submit Exam"}</span>
                  <Shield className="w-5 h-5 opacity-50" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* ✅ Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-foreground/30 mt-8 flex items-center justify-center gap-1"
        >
          <Shield className="w-3 h-3" />
          {lang === "ar" 
            ? "بياناتك آمنة ومشفرة • يمنع النسخ أثناء الامتحان"
            : "Your data is secure and encrypted • Copying is prohibited during exam"}
        </motion.p>
      </div>
    </div>
  );
};

export default ExamPage;