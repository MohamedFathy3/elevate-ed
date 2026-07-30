/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Stage.tsx

import { useRef, useState, useEffect, useMemo } from "react";
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
  Layers3,
  Star,
  Lock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flower2,
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

// ✅ Component للصورة - خفيف وسريع
const StageImage = ({ 
  src, 
  alt, 
  className = "",
  priority = false
}: { 
  src?: string; 
  alt: string; 
  className?: string;
  priority?: boolean;
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-fuchsia-500/20 dark:from-primary/10 dark:via-primary/5 dark:to-fuchsia-500/10">
        <GraduationCap className="h-14 w-14 text-primary" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`w-full h-full object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
};

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

  // ✅ Nature Theme - مبسط جداً
  if (isNature) {
    const stageColors = [
      { gradient: "from-emerald-500 to-teal-600", icon: <GraduationCap className="w-8 h-8 text-white" /> },
      { gradient: "from-teal-500 to-cyan-600", icon: <BookOpen className="w-8 h-8 text-white" /> },
      { gradient: "from-cyan-500 to-blue-600", icon: <Award className="w-8 h-8 text-white" /> }
    ];

    return (
      <section id="stages" className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-950">
        <div className="container-tight relative z-10">
          {/* Header - بدون Animations */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-5">
              <Leaf className="w-4 h-4" />
              {lang === "ar" ? "السنوات الدراسية" : "Academic Years"}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
              {lang === "ar" ? "السنوات الدراسية" : "Academic Years"}
            </h1>
            <p className="text-emerald-700/70 dark:text-emerald-300/70 text-base md:text-lg">
              {lang === "ar"
                ? "المنصة متاحة معاك على أي جهاز « موبايلك، التابلت، اللاب، الشاشة »."
                : "On your mobile, tablet or laptop."}
            </p>
          </div>

          {/* Cards Grid - بدون Animations */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {visibleStages.map((stage: any, idx: number) => {
              const stageName = pick(stage.name, stage.name_ar);
              const isStudentStage = isAuthenticated && stage.id === studentStageId;
              const isDisabled = isAuthenticated && !isStudentStage;
              const color = stageColors[idx % stageColors.length];

              return (
                <div
                  key={stage.id}
                  onClick={() => {
                    if (!isDisabled)
                      navigate(`/subjects?stage_id=${stage.id}&stage_name=${encodeURIComponent(stageName)}`);
                  }}
                  className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg transition-shadow duration-300 h-full flex flex-col
                      ${isDisabled ? 'opacity-80' : 'hover:shadow-xl dark:hover:shadow-emerald-900/30'}`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <StageImage
                        src={stage.image?.fullUrl || stage.image?.previewUrl}
                        alt={stageName}
                        priority={idx < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {isStudentStage && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
                            <CheckCircle className="w-3 h-3" />
                            <span>{lang === "ar" ? "مرحلتي" : "My Stage"}</span>
                          </div>
                        </div>
                      )}

                      <div
                        className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${color.gradient} flex items-center justify-center shadow-lg`}
                      >
                        {color.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {stageName}
                      </h3>

                      {stage.subjects && stage.subjects.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                          {stage.subjects.slice(0, 3).map((subject: any) => (
                            <span
                              key={subject.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                            >
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              {pick(subject.name, subject.name_ar) || subject.name}
                            </span>
                          ))}
                          {stage.subjects.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                              +{stage.subjects.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
                        {lang === "ar" ? "الدخول لجميع الكورسات" : "Access all courses"}
                      </p>

                      {isDisabled ? (
                        <div className="w-full py-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-center font-semibold cursor-not-allowed">
                          {lang === "ar" ? "غير متاحة لك" : "Not available"}
                        </div>
                      ) : (
                        <div
                          className={`w-full py-2.5 rounded-xl font-semibold transition-colors duration-300 bg-gradient-to-r ${color.gradient} text-white text-center`}
                        >
                          {lang === "ar" ? "اكتشف المحتوى" : "Explore"}
                          <ArrowRight className="inline-block w-4 h-4 ml-1" />
                        </div>
                      )}
                    </div>

                    {isDisabled && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                        <Lock className="w-14 h-14 text-red-400 mb-3 drop-shadow-lg" />
                        <p className="text-white font-extrabold text-lg tracking-wide">
                          {lang === "ar" ? "❌ ليست مرحلتي" : "❌ Not my stage"}
                        </p>
                        <p className="text-white/80 text-xs mt-2 text-center px-4">
                          {lang === "ar"
                            ? "غير مسموح لك بالدخول إلى هذه المرحلة"
                            : "You don't have access to this stage"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Device Icons */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-5">
              <div className="flex flex-wrap justify-center gap-6 text-emerald-600 dark:text-emerald-400">
                {[
                  { icon: Smartphone, label: "Mobile" },
                  { icon: Tablet, label: "Tablet" },
                  { icon: Laptop, label: "Laptop" }
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Default Theme - مبسط جداً
  return (
    <section id="stages" className="relative overflow-hidden py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="container-tight relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-5 py-2 text-sm font-bold text-primary dark:text-primary backdrop-blur-xl bg-white/60 dark:bg-gray-900/60">
            <Sparkles className="h-4 w-4" />
            {lang === "ar" ? "المراحل التعليمية" : "Educational Stages"}
          </div>

          <h2 className="mt-8 text-4xl md:text-6xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            {lang === "ar" ? "اختر مرحلتك" : "Choose Your"}{" "}
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              {lang === "ar" ? "الدراسية" : "Stage"}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {lang === "ar"
              ? "استكشف جميع المراحل الدراسية والكورسات التعليمية المصممة بأفضل تجربة منصة تعلمية في مصر حديثة للطلاب."
              : "Explore all educational stages and courses with a modern premium learning experience."}
          </p>
        </div>

        {/* Stats - بدون Animations */}
        <div className="mt-12 md:mt-16 grid gap-4 md:gap-5 grid-cols-3">
          {[
            { number: stages.length, label: lang === "ar" ? "مرحلة" : "Stages", icon: Layers3 },
            { number: `${totalCourses}+`, label: lang === "ar" ? "كورس" : "Courses", icon: BookOpen },
            { number: "4.9", label: lang === "ar" ? "تقييم" : "Rating", icon: Star },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl md:rounded-[32px] border border-gray-200 dark:border-gray-800 p-5 md:p-7 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl md:text-4xl font-black text-primary dark:text-primary">{item.number}</h3>
                    <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  </div>
                  <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl md:rounded-3xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary">
                    <Icon className="h-5 w-5 md:h-7 md:w-7" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Swiper - مع تحسين الصور */}
        <div className="mt-16 md:mt-20 relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary shadow-lg flex items-center justify-center -ml-4 md:-ml-6 hover:bg-primary hover:text-white hidden lg:flex"
          >
            <PrevIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary shadow-lg flex items-center justify-center -mr-4 md:-mr-6 hover:bg-primary hover:text-white hidden lg:flex"
          >
            <NextIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <Swiper
            onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={false}
            grabCursor={true}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
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
                  <div
                    className={`group relative ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleCardClick(s.id, stageName);
                      }
                    }}
                  >
                    <div className={`relative overflow-hidden rounded-2xl md:rounded-[36px] border border-gray-200 dark:border-gray-800 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 ${!isDisabled ? 'hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl' : ''}`}>
                      {isDisabled && (
                        <div className="absolute inset-0 z-20 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl md:rounded-[36px] pointer-events-none">
                          <Lock className="w-10 h-10 md:w-12 md:h-12 text-white/70 mb-2" />
                          <p className="text-white/80 text-xs md:text-sm font-semibold text-center px-4">
                            {lang === "ar" ? "هذه المرحلة غير متاحة لك" : "This stage is not available for you"}
                          </p>
                        </div>
                      )}

                      {isStudentStage && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-green-500 text-white text-[10px] md:text-xs font-bold shadow-lg">
                            <CheckCircle className="w-2 h-2 md:w-3 md:h-3" />
                            <span>{lang === "ar" ? "مرحلتي" : "My Stage"}</span>
                          </div>
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative h-[200px] md:h-[320px] overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <StageImage
                          src={image}
                          alt={stageName}
                          priority={i < 3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute left-4 top-4">
                          <div className="rounded-full border border-white/10 bg-white/10 dark:bg-black/30 px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-white backdrop-blur-xl">
                            {lang === "ar" ? "مرحلة تعليمية" : "Educational Stage"}
                          </div>
                        </div>

                        <div className="absolute bottom-4 left-4 rounded-xl md:rounded-2xl border border-white/10 bg-white/10 dark:bg-black/30 px-3 py-2 md:px-4 md:py-3 backdrop-blur-2xl">
                          <div className="flex items-center gap-2 md:gap-3 text-white">
                            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-white/10">
                              <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                            <div>
                              <p className="text-base md:text-lg font-black">{coursesCount}+</p>
                              <p className="text-[8px] md:text-xs text-white/70">{lang === "ar" ? "كورسات" : "Courses"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-xl md:text-3xl text-[#2266bf] dark:text-white ${!isDisabled ? 'group-hover:text-primary dark:group-hover:text-primary' : ''}`}>
                              {stageName}
                            </h3>

                            {s.subjects && s.subjects.length > 0 && (
                              <div className="mt-2 md:mt-3 flex flex-wrap gap-1">
                                {s.subjects.slice(0, 4).map((subject: any) => (
                                  <span
                                    key={subject.id}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                                    {pick(subject.name, subject.name_ar) || subject.name}
                                  </span>
                                ))}
                                {s.subjects.length > 4 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    +{s.subjects.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex-shrink-0">
                            <GraduationCap className="h-5 w-5 md:h-6 md:w-6" />
                          </div>
                        </div>

                        <div className="mt-6 md:mt-8">
                          <div className={`inline-flex items-center gap-2 md:gap-3 text-base md:text-lg font-bold ${!isDisabled ? 'text-primary dark:text-primary' : 'text-gray-400 dark:text-gray-600'}`}>
                            {lang === "ar" ? "استكشف الترم" : "Explore Semesters"}
                            <div className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full ${!isDisabled ? 'bg-primary/10 dark:bg-primary/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              <Arrow className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Actions */}
        <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-5">
          {stages.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-xl md:rounded-2xl px-6 md:px-8 py-3 md:py-4 font-bold text-white shadow-lg transition-all bg-gradient-to-r from-primary to-accent hover:shadow-xl"
            >
              {showAll
                ? lang === "ar" ? "عرض أقل" : "Show Less"
                : lang === "ar" ? "عرض كل المراحل" : "View All Stages"}
            </button>
          )}

          <Link
            to={`/stages`}
            className="group flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 px-6 md:px-8 py-3 md:py-4 font-bold text-gray-700 dark:text-gray-300 backdrop-blur-xl transition-all hover:border-primary/30 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10"
          >
            <span className="h-4 w-4 md:h-5 md:w-5 text-primary">▶</span>
            {lang === "ar" ? "استعراض جميع المراحل" : "Browse All Stages"}
            <Arrow className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-primary dark:text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Skeleton Component - بدون Animations
const StageSkeleton = ({ isNature }: { isNature: boolean }) => {
  const bgClass = isNature 
    ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/30 dark:via-gray-950 dark:to-emerald-950/30'
    : 'bg-white dark:bg-gray-950';
  
  const borderClass = isNature 
    ? 'border-emerald-200 dark:border-emerald-800'
    : 'border-gray-200 dark:border-gray-800';
  
  const pulseClass = isNature
    ? 'bg-emerald-100/60 dark:bg-emerald-900/30'
    : 'bg-gray-200/60 dark:bg-gray-800/30';

  return (
    <section className={`py-20 md:py-28 ${bgClass}`}>
      <div className="container-tight">
        <div className="mx-auto mb-12 md:mb-16 max-w-3xl text-center">
          <div className={`mx-auto h-10 w-48 rounded-full ${pulseClass}`} />
          <div className={`mx-auto mt-6 h-16 md:h-20 w-full rounded-3xl ${pulseClass}`} />
          <div className={`mx-auto mt-6 h-6 md:h-8 w-2/3 rounded-2xl ${pulseClass}`} />
        </div>
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`overflow-hidden rounded-2xl md:rounded-3xl border ${borderClass} bg-white/80 dark:bg-gray-900/40`}>
              <div className={`h-48 md:h-64 ${pulseClass}`} />
              <div className="p-5 md:p-6">
                <div className={`h-6 md:h-8 w-2/3 rounded-2xl ${pulseClass}`} />
                <div className={`mt-3 md:mt-4 h-12 md:h-16 rounded-2xl ${pulseClass}`} />
                <div className="mt-4 md:mt-5 flex gap-3">
                  <div className={`h-6 md:h-8 w-16 md:w-20 rounded-full ${pulseClass}`} />
                  <div className={`h-6 md:h-8 w-16 md:w-20 rounded-full ${pulseClass}`} />
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