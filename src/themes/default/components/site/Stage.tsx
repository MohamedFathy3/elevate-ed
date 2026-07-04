/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Stage.tsx

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  Layers3,
  PlayCircle,
  Star,
  Lock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flower2,
  TreePine,
  Mountain,
  Compass,
  Globe2,
  Bird,
  Waves,
  Sunrise,
  Award,
  Smartphone,
  Tablet,
  Laptop
} from "lucide-react";

import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// أيقونة PlayCircle
const PlayCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// أيقونات طبيعية للمراحل
const natureIcons = [TreePine, Mountain, Compass, Globe2, Bird, Waves, Sunrise, Flower2];

export const Stage = () => {
  const { lang, dir } = useLang();
  const { theme } = useTheme();
  const { stages, pick, isLoading, slug } = useSafeTeacherData();
  const { student, isAuthenticated } = useStudentAuth();
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);
  const [showAll, setShowAll] = useState(false);
  const [studentStageId, setStudentStageId] = useState<number | null>(null);

  const isNature = theme === 'nature';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  // أيقونات حسب الثيم
  const BadgeIcon = isNature ? Leaf : Sparkles;
  const StageIcon = isNature ? Flower2 : GraduationCap;

  // ألوان حسب الثيم
  const primaryColor = isNature ? 'emerald' : 'primary';
  const gradientFrom = isNature ? 'from-emerald-500' : 'from-primary';
  const gradientTo = isNature ? 'to-teal-600' : 'to-fuchsia-500';

  useEffect(() => {
    if (isAuthenticated && student?.stage_id) {
      setStudentStageId(student.stage_id);
    }
  }, [isAuthenticated, student]);

  const handleCardClick = (stageId: number, stageName: string) => {
  navigate(`/subjects?stage_id=${stageId}&stage_name=${encodeURIComponent(stageName)}`);
  };

  if (isLoading) {
    return <StageSkeleton isNature={isNature} />;
  }

  if (!stages.length) {
    return null;
  }

  const studentStage = stages.find((s: any) => s.id === studentStageId);
  const otherStages = stages.filter((s: any) => s.id !== studentStageId);
  const orderedStages = studentStage ? [studentStage, ...otherStages] : stages;
  const visibleStages = showAll ? orderedStages : orderedStages.slice(0, 20);

  const totalCourses = stages.reduce((acc: number, stage: any) => acc + (stage.courses_count || 0), 0);
  const totalStudents = stages.reduce((acc: number, stage: any) => acc + (stage.students_count || 0), 0);

  if (isNature) {
    const stageColors = [
      { gradient: "from-emerald-500 to-teal-600", icon: <GraduationCap className="w-8 h-8 text-white" />, image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop" },
      { gradient: "from-teal-500 to-cyan-600", icon: <BookOpen className="w-8 h-8 text-white" />, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop" },
      { gradient: "from-cyan-500 to-blue-600", icon: <Award className="w-8 h-8 text-white" />, image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=250&fit=crop" }
    ];
    if (!stages.length) {
      return null;
    }

    return (
      <section id="stages" className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-950">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-teal-200/20 dark:bg-teal-900/20 blur-3xl animate-pulse" />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], x: [0, (Math.random() - 0.5) * 50, 0], rotate: [0, 360] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
              className="absolute opacity-10 dark:opacity-5"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            >
              <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
          ))}
        </div>

        <div className="container-tight relative z-10">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-5"
            >
              <Leaf className="w-4 h-4" />
              {lang === "ar" ? "السنوات الدراسية" : "Academic Years"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 dark:text-emerald-100 mb-4"
            >
              {lang === "ar" ? "السنوات الدراسية" : "Academic Years"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-700/70 dark:text-emerald-300/70 text-lg"
            >
              {lang === "ar"
                ? "المنصه متاحه علي موبايالك او التابلت أو اللابتوب الخاص بيك."
                : "On your mobile, tablet or laptop. The platform is available on:"}
            </motion.p>
          </div>

          {/* Stages Cards - Nature Theme */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {visibleStages.map((stage: any, idx: number) => {
              const stageName = pick(stage.name, stage.name_ar);
              const isStudentStage = isAuthenticated && stage.id === studentStageId;
              const isDisabled = isAuthenticated && !isStudentStage;
              const color = stageColors[idx % stageColors.length];

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: isDisabled ? 0 : -8 }}
                  onClick={() => {
                    if (!isDisabled)
                      navigate(`/subjects?stage_id=${stage.id}&stage_name=${encodeURIComponent(stageName)}`);
                  }}
                  className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 h-full flex flex-col
                      ${isDisabled ? 'opacity-80 grayscale-[0.1]' : 'hover:shadow-2xl dark:hover:shadow-emerald-900/30'}`}
                  >
                    {/* صورة المرحلة */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={stage.image?.fullUrl || stage.image?.previewUrl || color.image}
                        alt={stageName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* شارة "مرحلتي" */}
                      {isStudentStage && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
                            <CheckCircle className="w-3 h-3" />
                            <span>{lang === "ar" ? "مرحلتي" : "My Stage"}</span>
                          </div>
                        </div>
                      )}

                      {/* أيقونة متحركة */}
                      <div
                        className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${color.gradient} flex items-center justify-center shadow-lg`}
                      >
                        {color.icon}
                      </div>
                    </div>

                    {/* محتوى الكارد */}
                    <div className="p-6 text-center flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {stageName}
                      </h3>

                      {/* ✅ عرض المواد في الثيم الطبيعي */}
                      {stage.subjects && stage.subjects.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                          {stage.subjects.slice(0, 3).map((subject: any) => (
                            <span
                              key={subject.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                            >
                              <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                              {pick(subject.name, subject.name_ar) || subject.name}
                            </span>
                          ))}
                          {stage.subjects.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400">
                              +{stage.subjects.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
                        {lang === "ar" ? "الدخول لجميع الكورسات" : "Access all courses"}
                      </p>

                      {/* زر مختلف للمراحل غير المتاحة */}
                      {isDisabled ? (
                        <div className="w-full py-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-center font-semibold cursor-not-allowed">
                          {lang === "ar" ? "غير متاحة لك" : "Not available"}
                        </div>
                      ) : (
                        <button
                          className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r ${color.gradient} text-white hover:shadow-lg hover:scale-105`}
                        >
                          {lang === "ar" ? "اكتشف المحتوى" : "Explore"}
                          <ArrowRight className="inline-block w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>

                    {/* الطبقة العلوية للمراحل غير المتاحة */}
                    {isDisabled && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                        <Lock className="w-14 h-14 text-red-400 mb-3 drop-shadow-lg animate-pulse" />
                        <p className="text-white font-extrabold text-lg tracking-wide">
                          {lang === "ar" ? "❌ ليست مرحلتي" : "❌ Not my stage"}
                        </p>
                        <p className="text-white/80 text-xs mt-2 text-center px-4">
                          {lang === "ar"
                            ? "غير مسموح لك بالدخول إلى هذه المرحلة"
                            : "You don't have access to this stage"}
                        </p>
                        <div className="mt-3 w-12 h-0.5 rounded-full bg-red-400/50" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA + Device Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center gap-5">
              <div className="flex flex-wrap justify-center gap-6 text-emerald-600 dark:text-emerald-400">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Mobile</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Tablet className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Tablet</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Laptop</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ✅ الثيم العادي (default) - مع عرض المواد
  return (
    <section id="stages" className="relative overflow-hidden py-28 md:py-36 bg-white dark:bg-gray-950">
      <div className="container-tight relative z-10">
        {/* TOP SECTION */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-5 py-2 text-sm font-bold text-primary dark:text-primary backdrop-blur-xl bg-white/60 dark:bg-gray-900/60"
          >
            <Sparkles className="h-4 w-4" />
            {lang === "ar" ? "المراحل التعليمية" : "Educational Stages"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-7xl text-gray-900 dark:text-white"
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
            className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-gray-600 dark:text-gray-400"
          >
            {lang === "ar"
              ? "استكشف جميع المراحل الدراسية والكورسات التعليمية المصممة بأفضل تجربة منصة تعلمية في مصر حديثة للطلاب."
              : "Explore all educational stages and courses with a modern premium learning experience."}
          </motion.p>
        </div>

        {/* STATS SECTION - Default */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-5 md:grid-cols-3"
        >
          {[
            { number: stages.length, label: lang === "ar" ? "مرحلة" : "Stages", icon: Layers3 },
            { number: `${totalCourses}+`, label: lang === "ar" ? "كورس" : "Courses", icon: BookOpen },
            { number: "4.9", label: lang === "ar" ? "تقييم" : "Rating", icon: Star },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group rounded-[32px] border border-gray-200 dark:border-gray-800 p-7 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-4xl font-black text-primary dark:text-primary">{item.number}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* STAGES SWIPER - Default */}
        <div className="mt-20 relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary shadow-lg flex items-center justify-center transition-all -ml-6 hover:bg-primary hover:text-white hidden lg:flex"
          >
            <PrevIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary shadow-lg flex items-center justify-center transition-all -mr-6 hover:bg-primary hover:text-white hidden lg:flex"
          >
            <NextIcon className="w-5 h-5" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={false}
            grabCursor={true}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.08, 0.5) }}
                    whileHover={!isDisabled ? { y: -12 } : {}}
                    className={`group relative ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleCardClick(s.id, stageName);
                      }
                    }}
                  >
                    <div className={`relative overflow-hidden rounded-[36px] border border-gray-200 dark:border-gray-800 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 transition-all duration-500 ${!isDisabled ? 'hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-2xl' : ''}`}>
                      {/* Disabled Overlay */}
                      {isDisabled && (
                        <div className="absolute inset-0 z-20 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[36px] pointer-events-none">
                          <Lock className="w-12 h-12 text-white/70 mb-2" />
                          <p className="text-white/80 text-sm font-semibold text-center px-4">
                            {lang === "ar" ? "هذه المرحلة غير متاحة لك" : "This stage is not available for you"}
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
                          <>
                            <img
                              src={image}
                              alt={stageName}
                              className={`h-full w-full object-cover transition-transform duration-700 ${!isDisabled ? 'group-hover:scale-110' : ''}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-fuchsia-500/20 dark:from-primary/10 dark:via-primary/5 dark:to-fuchsia-500/10">
                            <div className="flex h-28 w-28 items-center justify-center rounded-[30px] bg-primary text-white shadow-2xl">
                              <GraduationCap className="h-14 w-14" />
                            </div>
                          </div>
                        )}

                        <div className="absolute left-5 top-5">
                          <div className="rounded-full border border-white/10 bg-white/10 dark:bg-black/30 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl">
                            {lang === "ar" ? "مرحلة تعليمية" : "Educational Stage"}
                          </div>
                        </div>

                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 px-4 py-3 backdrop-blur-2xl"
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

                      {/* ✅ CONTENT مع عرض المواد */}
                      <div className="p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-3xl text-[#2266bf] dark:text-white transition-colors ${!isDisabled ? 'group-hover:text-primary dark:group-hover:text-primary' : ''}`}>
                              {stageName}
                            </h3>

                            {/* ✅ عرض المواد (Subjects) */}
                            {s.subjects && s.subjects.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {s.subjects.slice(0, 4).map((subject: any) => (
                                  <span
                                    key={subject.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 dark:bg-primary/60" />
                                    {pick(subject.name, subject.name_ar) || subject.name}
                                  </span>
                                ))}
                                {s.subjects.length > 4 && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    +{s.subjects.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white flex-shrink-0`}>
                            <GraduationCap className="h-6 w-6" />
                          </div>
                        </div>

                        {/* BUTTON */}
                        <div className="mt-8">
                          <div className={`group/button inline-flex items-center gap-3 text-lg font-bold ${!isDisabled ? 'text-primary dark:text-primary' : 'text-gray-400 dark:text-gray-600'}`}>
                            {lang === "ar" ? "استكشف الترم" : "Explore Semesters"}
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${!isDisabled ? 'bg-primary/10 dark:bg-primary/20 group-hover/button:bg-primary group-hover/button:text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              <Arrow className="h-5 w-5 transition-transform group-hover/button:translate-x-1 rtl:group-hover/button:-translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
              className="rounded-2xl px-8 py-4 font-bold text-white shadow-lg transition-all bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:scale-105"
            >
              {showAll
                ? lang === "ar" ? "عرض أقل" : "Show Less"
                : lang === "ar" ? "عرض كل المراحل" : "View All Stages"}
            </motion.button>
          )}

          <Link
            to={`/stages`}
            className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 px-8 py-4 font-bold text-gray-700 dark:text-gray-300 backdrop-blur-xl transition-all hover:border-primary/30 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10"
          >
            <PlayCircleIcon className="h-5 w-5 text-primary dark:text-primary" />
            {lang === "ar" ? "استعراض جميع المراحل" : "Browse All Stages"}
            <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-primary dark:text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Skeleton Component
const StageSkeleton = ({ isNature }: { isNature: boolean }) => {
  if (isNature) {
    return (
      <section className="py-32 bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/30 dark:via-gray-950 dark:to-emerald-950/30">
        <div className="container-tight">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mx-auto h-10 w-48 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-800" />
            <div className="mx-auto mt-6 h-20 w-full animate-pulse rounded-3xl bg-emerald-100 dark:bg-emerald-900" />
            <div className="mx-auto mt-6 h-8 w-2/3 animate-pulse rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/50" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-white/80 dark:bg-gray-900/40">
                <div className="h-64 animate-pulse bg-emerald-100 dark:bg-emerald-900" />
                <div className="p-6">
                  <div className="h-8 w-2/3 animate-pulse rounded-2xl bg-emerald-100 dark:bg-emerald-900" />
                  <div className="mt-4 h-16 animate-pulse rounded-2xl bg-emerald-50 dark:bg-emerald-900/50" />
                  <div className="mt-5 flex gap-3">
                    <div className="h-8 w-20 animate-pulse rounded-full bg-emerald-100 dark:bg-emerald-900" />
                    <div className="h-8 w-20 animate-pulse rounded-full bg-emerald-100 dark:bg-emerald-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-white dark:bg-gray-950">
      <div className="container-tight">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="mx-auto mt-6 h-20 w-full animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800" />
          <div className="mx-auto mt-6 h-8 w-2/3 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-[36px] border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60">
              <div className="h-[320px] animate-pulse bg-gray-200 dark:bg-gray-800" />
              <div className="p-7">
                <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="mt-5 h-24 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="mt-7 flex gap-3">
                  <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stage;