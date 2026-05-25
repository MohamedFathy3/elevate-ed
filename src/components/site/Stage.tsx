/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Stage.tsx

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentAuth } from "@/context/StudentAuthContext";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  Trophy,
  Layers3,
  PlayCircle,
  Star,
  Lock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

// تعريف أيقونة PlayCircle مؤقتاً
const PlayCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const Stage = () => {
  const { lang, dir } = useLang();
  const { stages, pick, isLoading, slug } = useSafeTeacherData();
  const { student, isAuthenticated } = useStudentAuth();
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);
  const [showAll, setShowAll] = useState(false);
  const [studentStageId, setStudentStageId] = useState<number | null>(null);

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  useEffect(() => {
    if (isAuthenticated && student?.stage_id) {
      setStudentStageId(student.stage_id);
    }
  }, [isAuthenticated, student]);

  if (isLoading) {
    return <StageSkeleton />;
  }

  if (!stages.length) {
    return null;
  }

  const studentStage = stages.find((s: any) => s.id === studentStageId);
  const otherStages = stages.filter((s: any) => s.id !== studentStageId);
  const orderedStages = studentStage ? [studentStage, ...otherStages] : stages;
  const visibleStages = showAll ? orderedStages : orderedStages.slice(0, 6);

  const totalCourses = stages.reduce((acc: number, stage: any) => acc + (stage.courses_count || 0), 0);
  const totalStudents = stages.reduce((acc: number, stage: any) => acc + (stage.students_count || 0), 0);

  // ✅ دالة معالجة الضغط على الكارد
  const handleCardClick = (stageId: number, stageName: string) => {
    console.log("🎯 Card clicked:", stageId, stageName);
    navigate(`/${slug}/subjects?stage_id=${stageId}&stage_name=${encodeURIComponent(stageName)}`);
  };

  return (
    <section id="stages" className="relative overflow-hidden py-28 md:py-36">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container-tight relative z-10">
        {/* TOP SECTION - نفس الكود السابق */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-bold text-primary backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4" />
            {lang === "ar" ? "المراحل التعليمية" : "Educational Stages"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-7xl"
          >
            {lang === "ar" ? "اختر مرحلتك" : "Choose Your"}{" "}
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              {lang === "ar" ? "الدراسية" : "Stage"}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-foreground/60"
          >
            {lang === "ar"
              ? "استكشف جميع المراحل الدراسية والكورسات التعليمية المصممة بأفضل تجربة حديثة للطلاب."
              : "Explore all educational stages and courses with a modern premium learning experience."}
          </motion.p>
        </div>

        {/* STATS SECTION - نفس الكود السابق */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-5 md:grid-cols-4"
        >
          {[
            { number: stages.length, label: lang === "ar" ? "مرحلة" : "Stages", icon: Layers3 },
            { number: `${totalCourses}+`, label: lang === "ar" ? "كورس" : "Courses", icon: BookOpen },
            { number: `${totalStudents}+`, label: lang === "ar" ? "طالب" : "Students", icon: Users },
            { number: "4.9", label: lang === "ar" ? "تقييم" : "Rating", icon: Star },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group rounded-[32px] border border-border bg-card/50 p-7 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-black text-primary">{item.number}</h3>
                    <p className="mt-2 text-sm text-foreground/60">{item.label}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* STAGES SWIPER */}
        <div className="mt-20 relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all -ml-6 hidden lg:flex"
          >
            <PrevIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all -mr-6 hidden lg:flex"
          >
            <NextIcon className="w-5 h-5" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
            modules={[Navigation, Autoplay, EffectCoverflow]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={false}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 2.5, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="px-4"
          >
            {visibleStages.map((s: any, i: number) => {
              const image = s.image?.fullUrl || s.image?.previewUrl;
              const stageName = pick(s.name, s.name_ar) || `Stage ${i + 1}`;
              const coursesCount = s.courses_count || Math.floor(Math.random() * 20) + 5;
              const isStudentStage = isAuthenticated && s.id === studentStageId;
              const isDisabled = isAuthenticated && !isStudentStage;

              return (
                <SwiperSlide key={s.id}>
                  {({ isActive }: { isActive: boolean }) => (
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.08, 0.5) }}
                      whileHover={!isDisabled ? { y: -12 } : {}}
                      className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isDisabled ? 'opacity-60' : ''}`}
                    >
                      {/* ✅ الكارد كامل - الـ onClick هنا */}
                      <div 
                        className={`relative overflow-hidden rounded-[36px] border border-border bg-card/60 backdrop-blur-2xl transition-all duration-500 ${
                          !isDisabled ? 'hover:border-primary/30 hover:shadow-[0_20px_80px_rgba(124,58,237,0.18)] cursor-pointer' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDisabled) {
                            console.log("🎯 Card clicked:", s.id, stageName);
                            navigate(`/${slug}/subjects?stage_id=${s.id}&stage_name=${encodeURIComponent(stageName)}`);
                          }
                        }}
                      >
                        {/* Disabled Overlay */}
                        {isDisabled && (
                          <div 
                            className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-[36px] pointer-events-none"
                          >
                            <Lock className="w-12 h-12 text-white/70 mb-2" />
                            <p className="text-white/80 text-sm font-semibold text-center px-4">
                              {lang === "ar" 
                                ? "هذه المرحلة غير متاحة لك"
                                : "This stage is not available for you"}
                            </p>
                          </div>
                        )}

                        {/* Student Stage Badge */}
                        {isStudentStage && (
                          <div className="absolute top-5 right-5 z-10">
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
                              <CheckCircle className="w-3 h-3" />
                              <span>{lang === "ar" ? "مرحلتي" : "My Stage"}</span>
                            </div>
                          </div>
                        )}

                        {/* IMAGE */}
                        <div className="relative h-[320px] overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={stageName}
                              className={`h-full w-full object-cover transition-transform duration-700 ${!isDisabled ? 'group-hover:scale-110' : ''}`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/5 to-fuchsia-500/20">
                              <div className="flex h-28 w-28 items-center justify-center rounded-[30px] bg-primary text-white shadow-2xl">
                                <GraduationCap className="h-14 w-14" />
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                          {/* Top Badge */}
                          <div className="absolute left-5 top-5">
                            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl">
                              {lang === "ar" ? "مرحلة تعليمية" : "Educational Stage"}
                            </div>
                          </div>

                          {/* Floating Courses */}
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-2xl"
                          >
                            <div className="flex items-center gap-3 text-white">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-lg font-black">{coursesCount}+</p>
                                <p className="text-xs text-white/70">{lang === "ar" ? "كورسات" : "Courses"}</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-7">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-3xl font-black transition-colors group-hover:text-primary">
                                {stageName}
                              </h3>
                              <p className="mt-3 line-clamp-2 leading-8 text-foreground/60">
                                {pick(s.description, s.description_ar) ||
                                  (lang === "ar"
                                    ? "برامج تعليمية احترافية ومناهج متطورة."
                                    : "Professional educational programs.")}
                              </p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                          </div>

                          {/* FEATURES */}
                          <div className="mt-7 flex flex-wrap gap-3">
                            {[
                              lang === "ar" ? "دعم مباشر" : "Live Support",
                              lang === "ar" ? "شرح فيديو" : "Video Lessons",
                              lang === "ar" ? "اختبارات" : "Exams",
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs font-medium text-foreground/60 backdrop-blur-xl"
                              >
                                {item}
                              </div>
                            ))}
                          </div>

                          {/* BUTTON */}
                          <div className="mt-8">
                            <div className={`group/button inline-flex items-center gap-3 text-lg font-bold ${!isDisabled ? 'text-primary' : 'text-foreground/30'}`}>
                              {lang === "ar" ? "استكشف المواد" : "Explore Subjects"}
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${!isDisabled ? 'bg-primary/10 group-hover/button:bg-primary group-hover/button:text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <Arrow className="h-5 w-5 transition-transform group-hover/button:translate-x-1 rtl:group-hover/button:-translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ACTIONS */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-5">
          {stages.length > 6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-[0_15px_50px_rgba(124,58,237,0.3)] transition-all"
            >
              {showAll
                ? lang === "ar" ? "عرض أقل" : "Show Less"
                : lang === "ar" ? "عرض كل المراحل" : "View All Stages"}
            </motion.button>
          )}

          <Link
            to={`/${slug}/stages`}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card/60 px-8 py-4 font-bold backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-primary/5"
          >
            <PlayCircleIcon className="h-5 w-5 text-primary" />
            {lang === "ar" ? "استعراض جميع المراحل" : "Browse All Stages"}
            <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const StageSkeleton = () => {
  return (
    <section className="py-32">
      <div className="container-tight">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto mt-6 h-20 w-full animate-pulse rounded-3xl bg-muted" />
          <div className="mx-auto mt-6 h-8 w-2/3 animate-pulse rounded-2xl bg-muted" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-[36px] border border-border bg-card/60">
              <div className="h-[320px] animate-pulse bg-muted" />
              <div className="p-7">
                <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-muted" />
                <div className="mt-5 h-24 animate-pulse rounded-2xl bg-muted" />
                <div className="mt-7 flex gap-3">
                  <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
                  <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};