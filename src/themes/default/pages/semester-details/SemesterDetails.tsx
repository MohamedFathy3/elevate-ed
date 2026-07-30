// src/pages/semester-details/SemesterDetails.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";

// ✅ Components
import { SemesterHeader } from './components/SemesterHeader';
import { CourseSection } from './components/CourseSection';
import { StatCard } from './components/StatCard';
import { SemesterSkeleton } from './components/SemesterSkeleton';

// ✅ Hooks
import { useSemesterCourses } from "@/hooks/useCourses";
import { useTeacher } from "@/context/TeacherContext";

export const SemesterDetails = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug, semesterId } = useParams();
  const { isAuthenticated, student } = useStudentAuth();
  const { pick } = useTeacher();
  const navigate = useNavigate();
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  
  // ✅ جلب الكورسات
  const { data: coursesData, isLoading } = useSemesterCourses(parseInt(semesterId || '0'));
  
  // ✅ ✅ ✅ فلترة في الـ Frontend: بس اللي semester_id = null
  const allCourses = coursesData?.data || [];
  
  // ✅ فلترة: بس اللي semester_id = null
  const semesterCourses = allCourses.filter((course: any) => {
    // ✅ أهم شرط: semester_id === null
    return course.semester_id === null;
  });
  
  // ✅ إحصائيات
  const totalStudents = semesterCourses.reduce((acc: number, c: any) => acc + (c.count_student || 0), 0);
  
  // ✅ اسم الترم من أول كورس
  const semester = semesterCourses?.[0]?.semester || null;
  const semesterName = pick(semester?.name, semester?.name_ar) || `Semester ${semesterId}`;

  // ✅ الألوان
  const statColors = isNature 
    ? [
        "from-amber-500 to-orange-600",
        "from-amber-600 to-orange-700",
      ]
    : [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
      ];
  
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";

  if (isLoading) {
    return <SemesterSkeleton isNature={isNature} />;
  }

  return (
    <div className={`min-h-screen pt-28 pb-20 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        {/* Header */}
        <SemesterHeader
          semesterName={semesterName}
          lang={lang}
          isNature={isNature}
          totalCourses={semesterCourses.length}
        />
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* <StatCard 
            icon={<BookOpen className="w-5 h-5" />}
            label={lang === "ar" ? "الكورسات" : "Courses"}
            value={semesterCourses.length}
            color={statColors[0]}
            isNature={isNature}
          /> */}
          {/* <StatCard 
            icon={<Users className="w-5 h-5" />}
            label={lang === "ar" ? "عدد الطلاب" : "Students"}
            value={totalStudents}
            color={statColors[1]}
            isNature={isNature}
          /> */}
        </div>
        
        {/* Courses List */}
        {/* {semesterCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full grid place-items-center
              ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <BookOpen className={`w-12 h-12 ${isNature ? 'text-amber-400' : 'text-foreground/30'}`} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === "ar" ? "لا توجد كورسات" : "No courses found"}
            </h3>
            <p className="text-foreground/60">
              {lang === "ar" 
                ? "لا توجد كورسات في هذا الترم حالياً"
                : "No courses available in this semester"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {semesterCourses.map((course: any, idx: number) => (
              <CourseSection
                key={course.id}
                course={course}
                index={idx}
                slug={slug!}
                lang={lang}
                pick={pick}
                isAuthenticated={isAuthenticated}
                studentId={student?.id}
                navigate={navigate}
                isNature={isNature}
                isDark={isDark}
                primaryGradient={primaryGradient}
              />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SemesterDetails;