// pages/SubjectsPage.tsx
import { useSearchParams, useParams } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSubjects } from "@/hooks/useSubjects";
import { useTeacher } from "@/context/TeacherContext";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const SubjectsPage = () => {
  const { lang } = useLang();
  const { slug } = useParams();
  const { teacher } = useTeacher();
  const [searchParams] = useSearchParams();
  const stageId = searchParams.get('stage_id');
  const stageName = searchParams.get('stage_name');
  
  const { data: subjects, isLoading } = useSubjects(
    stageId ? parseInt(stageId) : undefined,
    teacher?.id
  );

  if (isLoading) {
    return <SubjectsSkeleton />;
  }

  return (
    <div className="container-tight py-32">
      <div className="mb-8">
        <Link to={`/${slug}`} className="text-primary hover:underline inline-flex items-center gap-1 mb-4">
          <ChevronRight className="w-4 h-4" />
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <h1 className="text-4xl md:text-5xl font-black">
          {stageName || (lang === "ar" ? "المواد الدراسية" : "Subjects")}
        </h1>
        <p className="text-foreground/60 mt-2">
          {lang === "ar" ? "اختر المادة لاستعراض الترمات والكورسات" : "Choose a subject to view semesters and courses"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects?.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all cursor-pointer hover:shadow-elegant"
          >
            <Link to={`/${slug}/semesters?subject_id=${subject.id}&subject_name=${encodeURIComponent(subject.name)}`}>
              <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {lang === "ar" && subject.name_ar ? subject.name_ar : subject.name}
              </h3>
              <p className="text-sm text-foreground/60">
                {lang === "ar" ? "استعراض الترمات والكورسات" : "View semesters and courses"}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SubjectsSkeleton = () => (
  <div className="container-tight py-32">
    <div className="mb-8">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
      <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  </div>
);