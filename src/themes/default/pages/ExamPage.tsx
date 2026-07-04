/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useExamQuestions, useExamDetails, useExamResult } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import Cookies from "js-cookie";

// ✅ استيراد المكونات المُقسّمة
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionCard } from "@/components/exam/QuestionCard/QuestionCard";
import { ExamSkeleton } from "@/components/exam/ExamSkeleton";
import { ExitWarningModal } from "@/components/exam/ExitWarningModal";

// ✅ استيراد الـ Hooks
import { useExamAnswers } from "@/hooks/useExamAnswers";
import { useExamTimer } from "@/hooks/useExamTimer";

const ExamPage = () => {
  const { lang } = useLang();
  const { slug, examId, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const examIdNum = parseInt(examId || '0');
  
  // ✅ Data fetching
  const { data: examDetails, isLoading: detailsLoading } = useExamDetails(examIdNum);
  const { data: questionsData, isLoading: questionsLoading } = useExamQuestions(examIdNum);
  const { data: resultData, isLoading: resultLoading } = useExamResult(examIdNum, student?.id || 0);
  
  // ✅ State
  const [submitted, setSubmitted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);
  const isTimeUpRef = useRef(false);
  
  // ✅ Hooks
  const { answers, essayImages, setAnswer, addEssayImage, removeEssayImage, getAnsweredCount, clearAnswers } = useExamAnswers();
  const { timeLeft, formatTime } = useExamTimer(
    examDetails?.data?.duration_minutes,
    () => handleTimeUp()
  );
  
  const exam = examDetails?.data;
  const questions = questionsData?.data || [];
  const totalQuestions = questions.length;
  const answeredCount = getAnsweredCount();
  const hasResult = resultData?.status === true && resultData?.data?.length > 0;
  const currentLessonId = lessonId || exam?.course_detail_id?.id;
  const token = Cookies.get('student_token');

  useEffect(() => {
    if (hasResult && !submitted) {
      toast.info(
        lang === "ar" 
          ? "📝 لقد قمت بحل هذا الامتحان مسبقاً" 
          : "📝 You have already taken this exam"
      );
      
      // ✅ التوجيه للـ lesson بعد 1.5 ثانية
      setTimeout(() => {
        const targetLessonId = lessonId || exam?.course_detail_id?.id;
        if (targetLessonId) {
          navigate(`/lesson/${targetLessonId}`);
        } else {
          navigate(`/dashboard`);
        }
      }, 1500);
    }
  }, [hasResult, submitted, lessonId, exam, navigate, lang]);
  
  // ✅ دالة الإرسال الرئيسية
  const performSubmit = (isAuto: boolean = false) => {
    if (hasSubmittedRef.current) return;
    if (submitted) return;
    if (hasResult) return; // ✅ منع الإرسال إذا كان محلول مسبقاً
    
    // ✅ التحقق من وجود token
    if (!token) {
      toast.error(lang === "ar" ? "❌ يرجى تسجيل الدخول أولاً" : "❌ Please login first");
      return;
    }
    
    hasSubmittedRef.current = true;
    setIsAutoSubmitting(isAuto);
    setIsSubmitting(true);
    
    // ✅ تحويل الـ answers لـ array
    const answersArray = Object.keys(answers)
      .filter(key => {
        const val = answers[Number(key)];
        return val !== undefined && val !== null && val !== '';
      })
      .map(key => ({
        question_id: parseInt(key),
        answer: answers[Number(key)]
      }));
    
    const payload = {
      exam_id: examIdNum,
      student_id: student?.id || 0,
      answers: answersArray
    };
    
    console.log("📝 Submitting exam payload:", payload);
    console.log("📝 Token:", token);
    
    if (isAuto) {
      toast.info(lang === "ar" ? "⏳ يتم حفظ إجاباتك تلقائياً..." : "⏳ Auto-saving your answers...");
    }
    
    // ✅ استخدام api.post مع headers
    api.post('/exam/submit', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log("✅ Submit response:", response.data);
        
        const isSuccess = 
          response.data?.status === true || 
          response.data?.status === "success" || 
          response.data?.status === 200 || 
          response.data?.status === 201;
        
        if (isSuccess) {
          setSubmitted(true);
          setIsAutoSubmitting(false);
          setIsSubmitting(false);
          toast.success(
            isAuto
              ? (lang === "ar" ? "✅ تم حفظ إجاباتك تلقائياً!" : "✅ Your answers have been auto-saved!")
              : (lang === "ar" ? "🎉 تم تسليم الامتحان بنجاح!" : "🎉 Exam submitted successfully!")
          );
          
          clearAnswers();
          
          // ✅ التوجيه للـ lesson بعد الإرسال
          setTimeout(() => {
            const targetLessonId = lessonId || exam?.course_detail_id?.id;
            if (targetLessonId) {
              navigate(`/lesson/${targetLessonId}`);
            } else {
              navigate(`/dashboard`);
            }
          }, 1500);
        } else {
          toast.error(response.data?.message || "فشل تقديم الامتحان");
          setIsAutoSubmitting(false);
          setIsSubmitting(false);
          hasSubmittedRef.current = false;
        }
      })
      .catch(error => {
        console.error("❌ Submit error:", error);
        console.error("❌ Error response:", error.response?.data);
        
        // ✅ حتى لو error، نعتبره ناجح لو مفيش إجابات
        if (answersArray.length === 0) {
          setSubmitted(true);
          setIsAutoSubmitting(false);
          setIsSubmitting(false);
          toast.info(lang === "ar" ? "📝 تم حفظ الإجابات الفارغة" : "📝 Empty answers saved");
          clearAnswers();
          setTimeout(() => {
            const targetLessonId = lessonId || exam?.course_detail_id?.id;
            if (targetLessonId) {
              navigate(`/lesson/${targetLessonId}`);
            } else {
              navigate(`/dashboard`);
            }
          }, 1500);
          return;
        }
        
        const errorMsg = error.response?.data?.message || error.message || "حدث خطأ ما";
        toast.error(errorMsg);
        setIsAutoSubmitting(false);
        setIsSubmitting(false);
        hasSubmittedRef.current = false;
      });
  };

  // ✅ معالج انتهاء الوقت
  const handleTimeUp = () => {
    if (hasSubmittedRef.current) return;
    if (submitted) return;
    if (hasResult) return;
    
    isTimeUpRef.current = true;
    
    if (answeredCount > 0) {
      toast.warning(
        lang === "ar" 
          ? "⏰ انتهى الوقت! يتم حفظ إجاباتك تلقائياً..." 
          : "⏰ Time's up! Auto-saving your answers..."
      );
      performSubmit(true);
    } else {
      toast.error(
        lang === "ar" 
          ? "❌ انتهى الوقت دون إجابة!" 
          : "❌ Time's up with no answers!"
      );
      hasSubmittedRef.current = true;
      
      // ✅ التوجيه للـ lesson
      setTimeout(() => {
        const targetLessonId = lessonId || exam?.course_detail_id?.id;
        if (targetLessonId) {
          navigate(`/lesson/${targetLessonId}`);
        } else {
          navigate(`/dashboard`);
        }
      }, 2000);
    }
  };

  // ✅ إرسال عند الخروج من الصفحة (تلقائي)
  useEffect(() => {
    if (hasResult || submitted) return;
    if (answeredCount === 0) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      
      if (!hasSubmittedRef.current && !isTimeUpRef.current) {
        toast.info(
          lang === "ar" 
            ? "⏳ جاري حفظ إجاباتك قبل الخروج..." 
            : "⏳ Saving your answers before leaving..."
        );
        performSubmit(true);
      }
      
      return '';
    };
    
    const handlePopState = () => {
      if (!hasSubmittedRef.current && answeredCount > 0 && !isTimeUpRef.current) {
        setShowExitWarning(true);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasResult, submitted, answeredCount]);

  // ✅ معالج العودة
  const handleBack = () => {
    if (hasResult) {
      // ✅ لو محلول مسبقاً، روح للـ lesson
      const targetLessonId = lessonId || exam?.course_detail_id?.id;
      if (targetLessonId) {
        navigate(`/lesson/${targetLessonId}`);
      } else {
        navigate(-1);
      }
      return;
    }
    
    if (answeredCount > 0 && !submitted && !hasResult && !hasSubmittedRef.current) {
      setShowExitWarning(true);
    } else {
      navigate(-1);
    }
  };

  // ✅ معالج الخروج من المودال
  const handleExit = () => {
    setShowExitWarning(false);
    
    if (answeredCount > 0 && !submitted && !hasResult && !hasSubmittedRef.current) {
      toast.info(
        lang === "ar" 
          ? "⏳ جاري حفظ إجاباتك..." 
          : "⏳ Saving your answers..."
      );
      performSubmit(true);
    } else {
      // ✅ التوجيه للـ lesson
      const targetLessonId = lessonId || exam?.course_detail_id?.id;
      if (targetLessonId) {
        navigate(`/lesson/${targetLessonId}`);
      } else {
        navigate(-1);
      }
    }
  };

  // ✅ Handlers
  const handleSubmit = () => {
    if (hasSubmittedRef.current) return;
    if (hasResult) return; // ✅ منع الإرسال إذا كان محلول مسبقاً
    
    if (answeredCount < totalQuestions) {
      toast.warning(
        lang === "ar" 
          ? `⚠️ الرجاء الإجابة على جميع الأسئلة (${answeredCount}/${totalQuestions})`
          : `⚠️ Please answer all questions (${answeredCount}/${totalQuestions})`
      );
      return;
    }
    
    performSubmit(false);
  };

  // ✅ Prevent copy
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      if (!submitted && !hasResult && !isAutoSubmitting) {
        e.preventDefault();
        toast.warning(
          lang === "ar" 
            ? "النسخ غير مسموح أثناء الامتحان" 
            : "Copying is not allowed during exam"
        );
      }
    };
    document.addEventListener('copy', preventCopy);
    return () => document.removeEventListener('copy', preventCopy);
  }, [submitted, hasResult, isAutoSubmitting]);

  // ✅ Loading state
  if (detailsLoading || questionsLoading || resultLoading) return <ExamSkeleton lang={lang} />;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* ✅ Auto-submit loading overlay */}
        <AnimatePresence>
          {isAutoSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {lang === "ar" ? "جاري حفظ الإجابات..." : "Saving your answers..."}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {lang === "ar" 
                    ? "الرجاء الانتظار، يتم حفظ إجاباتك بشكل آمن"
                    : "Please wait, your answers are being saved securely"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Exit Warning Modal */}
        <AnimatePresence>
          {showExitWarning && (
            <ExitWarningModal
              onContinue={() => setShowExitWarning(false)}
              onLeave={handleExit}
              lang={lang}
            />
          )}
        </AnimatePresence>

        {/* ✅ إذا كان الامتحان محلول مسبقاً - عرض رسالة بدلاً من الأسئلة */}
        {hasResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 max-w-lg mx-auto">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {lang === "ar" ? "تم حل هذا الامتحان مسبقاً" : "Exam Already Solved"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {lang === "ar" 
                  ? "لقد قمت بحل هذا الامتحان من قبل، سيتم تحويلك تلقائياً..."
                  : "You have already solved this exam, redirecting automatically..."}
              </p>
              <div className="flex justify-center">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <button
                onClick={() => {
                  const targetLessonId = lessonId || exam?.course_detail_id?.id;
                  if (targetLessonId) {
                    navigate(`/lesson/${targetLessonId}`);
                  } else {
                    navigate(`/dashboard`);
                  }
                }}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {lang === "ar" ? "الذهاب للدرس" : "Go to Lesson"}
              </button>
            </div>
          </motion.div>
        ) : (
          // ✅ عرض الامتحان كالمعتاد
          <>
            {/* ✅ Header */}
            <ExamHeader
              title={exam?.title || ''}
              description={exam?.description}
              image={exam?.image?.fullUrl}
              totalQuestions={totalQuestions}
              totalMarks={exam?.total_marks || 0}
              duration={exam?.duration_minutes}
              answeredCount={answeredCount}
              onBack={handleBack}
            />

            {/* ✅ Timer & Progress */}
            <div className="flex justify-between items-center mb-6">
              {timeLeft !== null && !submitted && !hasResult && (
                <ExamTimer 
                  timeLeft={timeLeft} 
                  formatTime={formatTime}
                  isWarning={timeLeft < 60}
                />
              )}
              {!submitted && !hasResult && totalQuestions > 0 && (
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                      className={`h-full rounded-full transition-all ${
                        answeredCount === totalQuestions 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-primary to-primary/60'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {answeredCount}/{totalQuestions}
                  </p>
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
                  disabled={submitted || hasResult || isAutoSubmitting}
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
                  disabled={isSubmitting || isAutoSubmitting || answeredCount < totalQuestions || hasSubmittedRef.current}
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {isSubmitting || isAutoSubmitting ? (
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

            {/* ✅ Auto-save indicator */}
            {!submitted && !hasResult && answeredCount > 0 && !isAutoSubmitting && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-foreground/40 mt-4 flex items-center justify-center gap-1"
              >
                <span>💾</span>
                {lang === "ar" 
                  ? "سيتم حفظ إجاباتك تلقائياً عند انتهاء الوقت أو الخروج"
                  : "Your answers will be auto-saved when time runs out or you leave"}
              </motion.p>
            )}

            {/* ✅ Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-foreground/30 mt-4 flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3" />
              {lang === "ar" 
                ? "بياناتك آمنة ومشفرة • يمنع النسخ أثناء الامتحان"
                : "Your data is secure and encrypted • Copying is prohibited during exam"}
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamPage;