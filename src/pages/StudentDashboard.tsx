/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/StudentDashboard.tsx
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useStudentProfile, useStudentLearning, useCurrentStudent } from "@/hooks/useStudent";
import { BookOpen, Clock, Award, Calendar, ChevronRight, User, Phone, Mail, GraduationCap, FileQuestion, ClipboardList, CheckCircle, XCircle, TrendingUp, Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const StudentDashboard = () => {
  const { lang } = useLang();
  const { slug } = useParams();
  const { student, logout, isAuthenticated } = useCurrentStudent();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useStudentProfile();
  const { data: learning, isLoading: learningLoading, refetch: refetchLearning } = useStudentLearning();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = Cookies.get('student_token');
    if (token) {
      refetchProfile();
      refetchLearning();
    }
  }, []);

  // ✅ استخراج البيانات من learning.data (المصدر الصحيح)
  const learningData = learning?.data || {};
  const profileData = profile?.data || {};
  
  // ✅ دمج البيانات - الأهم من learning.data
  const studentInfo = learningData?.student || profileData?.student || student;
  const semesters = learningData?.semesters || profileData?.semesters || [];
  const courses = learningData?.courses || profileData?.courses || [];
  const lessons = learningData?.lessons || profileData?.lessons || [];
  
  // ✅ استخراج الامتحانات والواجبات من learning.data.student
  const examsList = learningData?.student?.exams || profileData?.student?.exams || [];
  const assignmentsList = learningData?.student?.assignments || profileData?.student?.assignments || [];

  console.log("🔍 Dashboard Debug:", {
    learningExists: !!learning,
    learningDataKeys: Object.keys(learningData),
    hasStudentExams: !!learningData?.student?.exams,
    examsCount: examsList.length,
    assignmentsCount: assignmentsList.length,
    semestersCount: semesters.length,
    coursesCount: courses.length,
    lessonsCount: lessons.length,
    firstExam: examsList[0]
  });

  if (profileLoading || learningLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated && !studentInfo) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 grid place-items-center">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            {lang === "ar" ? "الرجاء تسجيل الدخول" : "Please login"}
          </h2>
          <Link to={`/${slug}/login`} className="text-primary hover:underline">
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black">
            {lang === "ar" ? `مرحباً، ${studentInfo?.name || "Student"}` : `Welcome, ${studentInfo?.name || "Student"}`}
          </h1>
          <p className="text-foreground/60 mt-2">
            {lang === "ar" ? "استمر في رحلتك التعليمية" : "Continue your learning journey"}
          </p>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label={lang === "ar" ? "الكورسات" : "Courses"}
            value={courses.length}
            color="from-blue-500 to-indigo-600"
          />
          <StatCard
            icon={<FileQuestion className="w-5 h-5" />}
            label={lang === "ar" ? "الامتحانات" : "Exams"}
            value={examsList.length}
            color="from-orange-500 to-red-600"
          />
          <StatCard
            icon={<ClipboardList className="w-5 h-5" />}
            label={lang === "ar" ? "الواجبات" : "Assignments"}
            value={assignmentsList.length}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            label={lang === "ar" ? "إجمالي الدرجات" : "Total Marks"}
            value={[...examsList, ...assignmentsList].reduce((sum, item) => sum + (item.student_mark || 0), 0)}
            color="from-purple-500 to-pink-600"
          />
        </div>
        
        {/* Student Info Section */}
        {studentInfo && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {lang === "ar" ? "معلومات الطالب" : "Student Information"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                <Phone className="w-5 h-5 text-foreground/50" />
                <div>
                  <p className="text-xs text-foreground/50">{lang === "ar" ? "رقم الهاتف" : "Phone"}</p>
                  <p className="font-medium">{studentInfo?.phone || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                <Mail className="w-5 h-5 text-foreground/50" />
                <div>
                  <p className="text-xs text-foreground/50">{lang === "ar" ? "ولي الأمر" : "Parent"}</p>
                  <p className="font-medium">{studentInfo?.phone_parent || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                <GraduationCap className="w-5 h-5 text-foreground/50" />
                <div>
                  <p className="text-xs text-foreground/50">{lang === "ar" ? "كود ولي الأمر" : "Parent Code"}</p>
                  <p className="font-medium">{studentInfo?.code_parent || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ✅ Exams Section - الامتحانات */}
        {examsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-primary" />
              {lang === "ar" ? "الامتحانات التي قمت بها" : "Completed Exams"}
            </h2>
            <div className="space-y-3">
              {examsList.map((examItem: any, idx: number) => (
                <ExamResultCard
                  key={examItem.exam?.id || idx}
                  examItem={examItem}
                  lang={lang}
                  slug={slug!}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* ✅ Assignments Section - الواجبات */}
        {assignmentsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-accent" />
              {lang === "ar" ? "الواجبات التي قمت بها" : "Completed Assignments"}
            </h2>
            <div className="space-y-3">
              {assignmentsList.map((assignmentItem: any, idx: number) => (
                <AssignmentResultCard
                  key={assignmentItem.exam?.id || idx}
                  assignmentItem={assignmentItem}
                  lang={lang}
                  slug={slug!}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* My Semesters Section */}
        {semesters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {lang === "ar" ? "الترمات المشترك فيها" : "Enrolled Semesters"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {semesters.map((semester: any) => (
                <SemesterCard key={semester.id} semester={semester} slug={slug} lang={lang} />
              ))}
            </div>
          </div>
        )}
        
        {/* My Courses Section */}
        {courses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {lang === "ar" ? "كورساتي" : "My Courses"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course: any) => (
                <CourseCard key={course.id} course={course} slug={slug} lang={lang} />
              ))}
            </div>
          </div>
        )}
        
        {/* My Lessons Section */}
        {lessons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {lang === "ar" ? "الدروس المتاحة" : "Available Lessons"}
            </h2>
            <div className="space-y-3">
              {lessons.slice(0, 10).map((lesson: any) => (
                <LessonCard key={lesson.id} lesson={lesson} slug={slug} lang={lang} />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {courses.length === 0 && lessons.length === 0 && semesters.length === 0 && examsList.length === 0 && assignmentsList.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
              <BookOpen className="w-12 h-12 text-foreground/30" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === "ar" ? "لم تشترك في أي كورسات بعد" : "No courses enrolled yet"}
            </h3>
            <p className="text-foreground/60 mb-4">
              {lang === "ar" ? "قم بشراء كورسات للبدء في رحلة التعلم" : "Purchase courses to start your learning journey"}
            </p>
            <Link
              to={`/${slug}/courses`}
              className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
            >
              {lang === "ar" ? "استعرض الكورسات" : "Browse Courses"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        
        {/* Logout Button */}
        <div className="text-center pt-8 border-t border-border">
          <button
            onClick={logout}
            className="px-6 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            {lang === "ar" ? "تسجيل الخروج" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🟢 Exam Result Card Component مع تفاصيل كاملة
const ExamResultCard = ({ examItem, lang, slug }: any) => {
  const [expanded, setExpanded] = useState(false);
  const exam = examItem.exam;
  const studentMark = examItem.student_mark || 0;
  const totalMarks = exam?.total_marks || 0;
  const percentage = totalMarks > 0 ? (studentMark / totalMarks) * 100 : 0;
  const passed = percentage >= 50;
  const questions = examItem.questions || [];
  const correctCount = questions.filter((q: any) => q.is_correct === true).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <FileQuestion className={`w-4 h-4 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h3 className="font-bold">{exam?.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {passed ? (lang === "ar" ? "ناجح" : "Passed") : (lang === "ar" ? "راسب" : "Failed")}
            </span>
            <span className="text-xs text-foreground/50">{exam?.type === 'exam' ? (lang === "ar" ? "امتحان" : "Exam") : (lang === "ar" ? "واجب" : "Assignment")}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className="text-lg font-bold">{studentMark}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className="text-lg font-bold">{totalMarks}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className="text-lg font-bold">{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "الإجابات الصحيحة" : "Correct Answers"}</p>
              <p className="text-lg font-bold">{correctCount}/{questions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold"
          >
            {expanded ? (lang === "ar" ? "إخفاء" : "Hide") : (lang === "ar" ? "تفاصيل" : "Details")}
          </button>
          <Link
            to={`/${slug}/exam/${exam?.id}`}
            className="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            {lang === "ar" ? "عرض النتيجة" : "View Result"}
          </Link>
        </div>
      </div>
      
      {/* Expanded Questions Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border"
        >
          <h4 className="font-semibold mb-3 text-sm">
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard key={q.id} question={q} index={idx} lang={lang} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// 🟢 Question Detail Component
const QuestionDetailCard = ({ question, index, lang }: any) => {
  const isCorrect = question.is_correct === true;
  const isEssay = question.correct_answer === null;
  
  return (
    <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : isEssay ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : isEssay ? <Clock className="w-4 h-4 text-yellow-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{index + 1}. {question.question}</p>
          <div className="mt-1 text-xs space-y-1">
            <p><span className="text-foreground/50">{lang === "ar" ? "إجابتك:" : "Your answer:"}</span> {question.student_answer || "-"}</p>
            {question.correct_answer && (
              <p><span className="text-foreground/50">{lang === "ar" ? "الإجابة الصحيحة:" : "Correct answer:"}</span> <span className="text-green-600">{question.correct_answer}</span></p>
            )}
            <p><span className="text-foreground/50">{lang === "ar" ? "الدرجة:" : "Mark:"}</span> {question.mark_obtained || 0}/{question.mark}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🟢 Assignment Result Card Component
const AssignmentResultCard = ({ assignmentItem, lang, slug }: any) => {
  const [expanded, setExpanded] = useState(false);
  const assignment = assignmentItem.exam;
  const studentMark = assignmentItem.student_mark || 0;
  const totalMarks = assignment?.total_marks || 0;
  const percentage = totalMarks > 0 ? (studentMark / totalMarks) * 100 : 0;
  const questions = assignmentItem.questions || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-card rounded-xl border border-accent/30 p-4 hover:border-accent transition-all"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-bold">{assignment?.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
              {lang === "ar" ? "واجب" : "Assignment"}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm mt-3">
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "درجتك" : "Your Score"}</p>
              <p className="text-lg font-bold">{studentMark}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "الدرجة الكلية" : "Total Marks"}</p>
              <p className="text-lg font-bold">{totalMarks}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-xs text-foreground/50">{lang === "ar" ? "النسبة" : "Percentage"}</p>
              <p className="text-lg font-bold">{percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold"
          >
            {expanded ? (lang === "ar" ? "إخفاء" : "Hide") : (lang === "ar" ? "تفاصيل" : "Details")}
          </button>
          <Link
            to={`/${slug}/exam/${assignment?.id}`}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-pink-500 text-white text-sm font-semibold flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            {lang === "ar" ? "عرض التفاصيل" : "View Details"}
          </Link>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border"
        >
          <h4 className="font-semibold mb-3 text-sm">
            {lang === "ar" ? "تفاصيل الأسئلة" : "Question Details"}
          </h4>
          <div className="space-y-3">
            {questions.map((q: any, idx: number) => (
              <QuestionDetailCard key={q.id} question={q} index={idx} lang={lang} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white shadow-lg`}
  >
    <div className="flex items-center justify-between">
      {icon}
      <span className="text-2xl font-black">{value}</span>
    </div>
    <p className="text-sm opacity-90 mt-2">{label}</p>
  </motion.div>
);

const SemesterCard = ({ semester, slug, lang }: any) => (
  <Link to={`/${slug}/semester/${semester.id}`}>
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">
            {lang === "ar" && semester.name_ar ? semester.name_ar : semester.name}
          </h3>
          <p className="text-xs text-foreground/50 mt-1">
            {semester.courses?.length || 0} {lang === "ar" ? "كورسات" : "courses"}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-foreground/30" />
      </div>
    </motion.div>
  </Link>
);

const CourseCard = ({ course, slug, lang }: any) => (
  <Link to={`/${slug}/courses/${course.id}`}>
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all cursor-pointer"
    >
      <img
        src={course.image?.fullUrl || course.imageUrl || "/default-course.jpg"}
        alt={course.title}
        className="w-full h-32 object-cover rounded-lg mb-3"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/default-course.jpg";
        }}
      />
      <h3 className="font-bold line-clamp-1">
        {lang === "ar" && course.title_ar ? course.title_ar : course.title}
      </h3>
      <p className="text-xs text-foreground/50 mt-1">
        {course.details?.length || 0} {lang === "ar" ? "دروس" : "lessons"}
      </p>
    </motion.div>
  </Link>
);

const LessonCard = ({ lesson, slug, lang }: any) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-semibold">
          {lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
        </h3>
        <p className="text-xs text-foreground/50">
          {lesson.course?.title}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-foreground/40">
          <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
          <span>{lesson.lession_time}</span>
        </div>
      </div>
      <Link
        to={`/${slug}/lesson/${lesson.id}`}
        className="px-4 py-2 rounded-lg gradient-primary text-white text-sm ml-3"
      >
        {lang === "ar" ? "مشاهدة" : "Watch"}
      </Link>
    </div>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen pt-32 pb-20">
    <div className="container-tight">
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

export default StudentDashboard;