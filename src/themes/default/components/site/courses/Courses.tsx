/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/courses/Courses.tsx

import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DefaultCourseCard } from "./DefaultCourseCard";
import { NatureCarousel } from "./NatureCarousel";
import { CourseSkeleton } from "./CourseSkeleton";

export const Courses = ({ limit = 4 }: { limit?: number }) => {
  const { lang, dir } = useLang();
  const { theme } = useTheme();
  const { featured_courses, slug, pick, isLoading } = useSafeTeacherData();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const isDark = document.documentElement.classList.contains('dark');
  const isNature = theme === 'nature';
  const allCourses = Array.isArray(featured_courses) ? featured_courses : [];
  const displayCourses = limit ? allCourses.slice(0, limit) : allCourses;
  const validCourses = displayCourses.filter((course: any) => course && typeof course === 'object');

  if (isLoading) {
    return <CourseSkeleton isNature={isNature} isDark={isDark} />;
  }

  if (!validCourses.length) {
    return null;
  }

  if (isNature) {
    return <NatureCarousel courses={validCourses} pick={pick} slug={slug} lang={lang} Arrow={Arrow} dir={dir} isDark={isDark} />;
  }

  return (
    <section id="courses" className="py-24 md:py-32 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background بسيط */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 opacity-10 dark:opacity-5">
          <BookOpen className="w-32 h-32 text-blue-500 drop-shadow-2xl" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-10 opacity-10 dark:opacity-5">
          <BookOpen className="w-40 h-40 text-emerald-500 drop-shadow-2xl" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 left-5 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-5 w-56 h-56 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-5 backdrop-blur-sm">
            <BookOpen className="w-4 h-4" />
            {lang === "ar" ? "الكورسات المرشحة" : "Latest Courses"}
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance leading-[1.1]">
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              {lang === "ar" ? "اكتشف محتوى يساعدك تتفوق" : "Discover content that helps you excel"}
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {validCourses.map((course: any, i: number) => (
            <DefaultCourseCard
              key={course?.id || i}
              course={course}
              index={i}
              slug={slug}
              pick={pick}
              lang={lang}
              Arrow={Arrow}
              isDark={isDark}
            />
          ))}
        </div>

        {limit && allCourses.length > limit && (
          <div className="text-center mt-12">
            <Link
              to={`/courses`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all group"
            >
              <Sparkles className="w-4 h-4" />
              {lang === "ar" ? "جميع الكورسات" : "All Courses"}
              <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Courses;