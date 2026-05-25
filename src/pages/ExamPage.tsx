/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/ExamPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useExamQuestions, useSubmitExam, useExamResult, useExamDetails } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion } from "framer-motion";
import { 
  Clock, ArrowLeft, ArrowRight, Loader2, CheckCircle, 
  XCircle, AlertCircle, FileQuestion, Award, TrendingUp,
  Send
} from "lucide-react";
import { toast } from "sonner";

const ExamPage = () => {
  const { lang, dir } = useLang();
  const { slug, examId, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const { data: examDetails, isLoading: detailsLoading } = useExamDetails(parseInt(examId || '0'));
  const { data: questionsData, isLoading: questionsLoading } = useExamQuestions(parseInt(examId || '0'));
  const { mutate: submitExam, isPending: submitting } = useSubmitExam();
  const { data: resultData, refetch: refetchResult } = useExamResult(
    parseInt(examId || '0'), 
    student?.id || 0
  );
  
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const exam = examDetails?.data;
  const questions = questionsData?.data || [];
  const totalQuestions = questions.length;
  const hasResult = resultData?.status === true && resultData?.data?.length > 0;
  const currentLessonId = lessonId || exam?.course_detail_id?.id;
  
  // إعداد المؤقت
  useEffect(() => {
    if (exam?.duration_minutes && !submitted && !hasResult) {
      setTimeLeft(exam.duration_minutes * 60);
    }
  }, [exam, submitted, hasResult]);
  
  // عد تنازلي
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted || hasResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, submitted, hasResult]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  // ✅ بعد نجاح التسجيل، يروح للدرس
  const handleSubmit = () => {
    if (Object.keys(answers).length < totalQuestions) {
      toast.warning(`الرجاء الإجابة على جميع الأسئلة (${Object.keys(answers).length}/${totalQuestions})`);
      return;
    }
    
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      answer: Array.isArray(answer) ? answer.join(',') : answer.toString(),
    }));
    
    submitExam({
      examId: parseInt(examId || '0'),
      answers: formattedAnswers,
    }, {
      onSuccess: () => {
        setSubmitted(true);
        // ✅ إعادة تحميل النتيجة
        setTimeout(() => {
          refetchResult();
        }, 500);
        // ✅ تأخير ثم التوجيه للدرس
        setTimeout(() => {
          toast.success(lang === "ar" ? "تم حفظ النتيجة! جاري العودة للدرس..." : "Result saved! Returning to lesson...");
          // التوجيه لصفحة الدرس
          if (currentLessonId) {
            navigate(`/${slug}/lesson/${currentLessonId}`);
          } else {
            navigate(`/${slug}/dashboard`);
          }
        }, 2000);
      }
    });
  };
  
  const handleAutoSubmit = () => {
    if (!submitted && !hasResult && Object.keys(answers).length > 0) {
      toast.warning("انتهى الوقت المحدد للامتحان! يتم تسليم الإجابات تلقائياً.");
      handleSubmit();
    } else if (!submitted && !hasResult && Object.keys(answers).length === 0) {
      toast.error("انتهى الوقت دون إجابة! سيتم تسجيل صفر.");
      // توجيه للدرس بعد ثانيتين
      setTimeout(() => {
        if (currentLessonId) {
          navigate(`/${slug}/lesson/${currentLessonId}`);
        } else {
          navigate(`/${slug}/dashboard`);
        }
      }, 2000);
    }
  };
  
  // ✅ إذا كان الامتحان قد تم حله مسبقاً، يروح للدرس مباشرة
  useEffect(() => {
    if (hasResult && !submitted) {
      toast.info(lang === "ar" ? "لقد قمت بحل هذا الامتحان مسبقاً" : "You have already taken this exam");
      setTimeout(() => {
        if (currentLessonId) {
          navigate(`/${slug}/lesson/${currentLessonId}`);
        } else {
          navigate(`/${slug}/dashboard`);
        }
      }, 1500);
    }
  }, [hasResult, submitted]);
  
  if (detailsLoading || questionsLoading) {
    return <ExamSkeleton />;
  }
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              <Arrow className="w-4 h-4" />
              {lang === "ar" ? "العودة" : "Back"}
            </button>
            
            <div className="flex items-center gap-3">
              {/* Timer */}
              {timeLeft !== null && !submitted && !hasResult && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${
                  timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              
              {/* Progress */}
              <div className="text-sm text-foreground/50">
                {Object.keys(answers).length}/{totalQuestions} {lang === "ar" ? "تمت الإجابة" : "answered"}
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mt-4">{exam?.title}</h1>
          <p className="text-foreground/60 mt-2">{exam?.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1 text-foreground/50">
              <FileQuestion className="w-4 h-4" />
              <span>{totalQuestions} {lang === "ar" ? "أسئلة" : "questions"}</span>
            </div>
            <div className="flex items-center gap-1 text-foreground/50">
              <Award className="w-4 h-4" />
              <span>{exam?.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
            </div>
          </div>
        </div>
        
        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q: any, idx: number) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              value={answers[q.id]}
              onChange={(answer: any) => handleAnswer(q.id, answer)}
              lang={lang}
            />
          ))}
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < totalQuestions || hasResult}
            className="px-8 py-4 rounded-xl gradient-primary text-white font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {lang === "ar" ? "تسليم الامتحان" : "Submit Exam"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🟢 Question Card Component
const QuestionCard = ({ question, index, value, onChange, lang }: any) => {
  const [expanded, setExpanded] = useState(false);
  const questionText = lang === "ar" && question.question_ar ? question.question_ar : question.question;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <div 
        className="p-5 cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary grid place-items-center text-white text-sm font-bold flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="font-medium">{questionText}</p>
            {question.image?.fullUrl && (
              <img src={question.image.fullUrl} alt="question" className="mt-3 max-h-40 rounded-lg" />
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-foreground/40">
              <span>{question.mark} {lang === "ar" ? "درجة" : "marks"}</span>
              <span className="capitalize">{question.question_type === 'true_false' ? (lang === "ar" ? "صح/خطأ" : "True/False") : question.question_type === 'multiple_choice' ? (lang === "ar" ? "اختيار من متعدد" : "Multiple Choice") : (lang === "ar" ? "مقالي" : "Essay")}</span>
            </div>
          </div>
          <div className="text-foreground/30">
            {value !== undefined ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-foreground/20" />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-5 pt-0 border-t border-border mt-2">
          {question.question_type === 'true_false' && (
            <div className="flex gap-4">
              <button
                onClick={() => onChange('true')}
                className={`px-6 py-2 rounded-xl transition-all ${value === 'true' ? 'gradient-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {lang === "ar" ? "صحيح" : "True"}
              </button>
              <button
                onClick={() => onChange('false')}
                className={`px-6 py-2 rounded-xl transition-all ${value === 'false' ? 'gradient-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {lang === "ar" ? "خطأ" : "False"}
              </button>
            </div>
          )}
          
          {question.question_type === 'multiple_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => onChange(opt.id)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-all ${value === opt.id ? 'gradient-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  {opt.option_text}
                </button>
              ))}
            </div>
          )}
          
          {question.question_type === 'essay' && (
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-secondary border border-border focus:border-primary/50 outline-none resize-y"
              rows={5}
              placeholder={lang === "ar" ? "اكتب إجابتك هنا..." : "Write your answer here..."}
            />
          )}
        </div>
      )}
    </motion.div>
  );
};

// 🟢 Skeleton
const ExamSkeleton = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 animate-pulse" />
        <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-2xl p-5 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;