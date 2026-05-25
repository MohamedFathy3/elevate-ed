/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/StagesPage.tsx
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { GraduationCap, Sparkles, ArrowRight, ArrowLeft, BookOpen, Trophy, Users, Clock, Calendar, ChevronRight, Star, Award, Target, Rocket } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const StagesPage = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { stages, pick, isLoading, teacher } = useSafeTeacherData();
  const navigate = useNavigate();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // إحصائيات إضافية
  const totalCourses = stages.reduce((acc, stage) => acc + (stage.courses_count || 0), 0);
  const totalStudents = stages.reduce((acc, stage) => acc + (stage.students_count || 0), 0);
  
  if (isLoading) {
    return <StagesPageSkeleton />;
  }

  if (!stages.length) {
    return <EmptyStagesPage slug={slug!} lang={lang} />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />
        </div>
      </div>

      <div className="container-tight relative">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold text-sm mb-5 backdrop-blur-sm"
          >
            <GraduationCap className="w-4 h-4" />
            {lang === "ar" ? "جميع المراحل الدراسية" : "All Educational Stages"}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-6xl lg:text-7xl tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {lang === "ar" ? "اختر مرحلتك الدراسية" : "Choose Your Educational Stage"}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-foreground/60 text-lg max-w-2xl mx-auto"
          >
            {lang === "ar" 
              ? "نقدم برامج تعليمية متكاملة تناسب جميع المراحل الدراسية، من الابتدائية حتى الثانوية"
              : "We offer integrated educational programs suitable for all educational stages, from primary to secondary"}
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-primary">{stages.length}</div>
            <div className="text-xs text-foreground/50">{lang === "ar" ? "مرحلة دراسية" : "Educational Stages"}</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl gradient-accent grid place-items-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-accent">{totalCourses}+</div>
            <div className="text-xs text-foreground/50">{lang === "ar" ? "كورس تعليمي" : "Educational Courses"}</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 grid place-items-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-orange-500">{totalStudents}+</div>
            <div className="text-xs text-foreground/50">{lang === "ar" ? "طالب مسجل" : "Enrolled Students"}</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 grid place-items-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-emerald-500">100%</div>
            <div className="text-xs text-foreground/50">{lang === "ar" ? "رضا الطلاب" : "Satisfaction Rate"}</div>
          </div>
        </motion.div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stages.map((stage: any, i: number) => {
            const stageName = pick(stage.name, stage.name_ar) || `Stage ${i + 1}`;
            const stageImage = stage.image?.fullUrl || stage.image?.previewUrl || null;
            const coursesCount = stage.courses_count || Math.floor(Math.random() * 30) + 10;
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/${slug}/subjects?stage_id=${stage.id}&stage_name=${encodeURIComponent(stageName)}`)}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 shadow-card hover:shadow-elegant h-full">
                  {/* Image Section */}
                  <div className="relative h-52 overflow-hidden">
                    {stageImage ? (
                      <>
                        <img
                          src={stageImage}
                          alt={stageName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-accent/30">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-2xl gradient-primary grid place-items-center">
                            <GraduationCap className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                        {lang === "ar" ? `المرحلة ${i + 1}` : `Stage ${i + 1}`}
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                        <BookOpen className="w-3 h-3" />
                        <span>{coursesCount} {lang === "ar" ? "كورس" : "Courses"}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                        <Users className="w-3 h-3" />
                        <span>{stage.students_count || Math.floor(Math.random() * 500) + 100} {lang === "ar" ? "طالب" : "Students"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {stageName}
                    </h3>
                    
                    <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 min-h-[40px]">
                      {pick(stage.description, stage.description_ar) || (lang === "ar" 
                        ? `برامج تعليمية متكاملة لمرحلة ${stageName}`
                        : `Integrated educational programs for ${stageName}`)}
                    </p>
                    
                    {/* Features Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/5 text-primary text-xs">
                        <Target className="w-3 h-3" />
                        <span>{lang === "ar" ? "منهج متكامل" : "Integrated Curriculum"}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/5 text-accent text-xs">
                        <Rocket className="w-3 h-3" />
                        <span>{lang === "ar" ? "تعلم تفاعلي" : "Interactive Learning"}</span>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                        {lang === "ar" ? "استكشف المواد" : "Explore Subjects"}
                        <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="gradient-primary rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {lang === "ar" ? "مستعد تبدأ رحلة التعلم؟" : "Ready to start learning?"}
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              {lang === "ar" 
                ? "سجل الآن وابدأ رحلتك التعليمية مع أفضل المعلمين"
                : "Sign up now and start your learning journey with the best teachers"}
            </p>
            <Link
              to={`/${slug}/register`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              {lang === "ar" ? "سجل الآن" : "Register Now"}
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 🟢 Skeleton Component
const StagesPageSkeleton = () => {
  const { lang } = useLang();
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 animate-pulse" />
          <div className="h-12 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mt-4 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-card animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto mb-3" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-52 bg-gray-200 dark:bg-gray-700" />
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🟢 Empty State
const EmptyStagesPage = ({ slug, lang }: { slug: string; lang: string }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
          <GraduationCap className="w-16 h-16 text-foreground/30" />
        </div>
        <h1 className="text-2xl font-bold mb-3">
          {lang === "ar" ? "لا توجد مراحل دراسية" : "No Stages Found"}
        </h1>
        <p className="text-foreground/60 mb-6">
          {lang === "ar" 
            ? "لم يتم إضافة أي مراحل دراسية بعد"
            : "No educational stages have been added yet"}
        </p>
        <Link
          to={`/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
};