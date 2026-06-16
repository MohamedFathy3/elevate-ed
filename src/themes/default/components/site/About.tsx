/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/About.tsx

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useTheme } from "@/context/ThemeContext";
import { Link, useParams } from "react-router-dom";

import {
  Sparkles,
  GraduationCap,
  Rocket,
  BrainCircuit,
  ShieldCheck,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Leaf,
  Flower2,
  Trees,
  BookOpen,
  PenTool,
  Lightbulb,
  Compass,
} from "lucide-react";

const FEATURES_ICONS = [
  GraduationCap,
  Rocket,
  BrainCircuit,
  ShieldCheck,
];

const NATURE_FEATURES_ICONS = [
  Leaf,
  Flower2,
  Trees,
  Sparkles,
];

export const About = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { slug } = useParams();
  const { features, about, pick, isLoading } = useSafeTeacherData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const isNature = theme === 'nature';

  // مراقبة ظهور الفيديو في الشاشة
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current && !videoError) {
            setIsInView(true);
            videoRef.current.play().catch((err) => {
              console.log("Auto-play was prevented:", err);
              setIsPlaying(false);
            });
          } else if (!entry.isIntersecting && videoRef.current) {
            setIsInView(false);
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoError]);

  if (isLoading) {
    return <AboutSkeleton isNature={isNature} />;
  }

  if (!about && !features.length) {
    return null;
  }

  const mediaUrl = about?.image?.fullUrl || about?.imageUrl;
  const isVideo = mediaUrl?.endsWith('.mp4') || mediaUrl?.includes('video') || about?.image?.mimeType?.includes('video');
  const fallbackImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section 
      id="about" 
      className="relative overflow-hidden py-28 md:py-36 bg-white dark:bg-gray-950"
    >
      {/* ✅ الخلفية المتحركة - طبيعة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* بقع ضبابية متحركة */}
        <motion.div
          animate={{
            x: [0, 100, -80, 50, 0],
            y: [0, -60, 40, -80, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-400/5 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -80, 60, -100, 0],
            y: [0, 50, -70, 30, 0],
            scale: [1, 0.8, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, 60, -100, 80, 0],
            y: [0, -80, 50, -60, 0],
            scale: [1, 1.3, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 4,
          }}
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl"
        />

        {/* ✅ كتب متحركة */}
        <motion.div
          animate={{
            y: [0, -30, 0, 30, 0],
            rotate: [0, 5, -5, 8, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 opacity-20 dark:opacity-10"
        >
          <BookOpen className="w-24 h-24 text-emerald-600 dark:text-emerald-400" strokeWidth={1} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 40, 0, -40, 0],
            rotate: [0, -8, 6, -10, 0],
            scale: [1, 0.9, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-40 left-20 opacity-20 dark:opacity-10"
        >
          <BookOpen className="w-32 h-32 text-blue-500 dark:text-blue-400" strokeWidth={1} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -25, 0, 25, 0],
            rotate: [0, 10, -8, 12, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/3 left-1/4 opacity-15 dark:opacity-8"
        >
          <PenTool className="w-20 h-20 text-amber-500 dark:text-amber-400" strokeWidth={1} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 35, 0, -35, 0],
            rotate: [0, -12, 8, -15, 0],
            scale: [1, 0.85, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-1/3 right-1/4 opacity-15 dark:opacity-8"
        >
          <Lightbulb className="w-16 h-16 text-yellow-500 dark:text-yellow-400" strokeWidth={1} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0, 20, 0],
            rotate: [0, 15, -12, 18, 0],
            scale: [1, 1.15, 0.85, 1.1, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-2/3 right-1/3 opacity-10 dark:opacity-5"
        >
          <Compass className="w-28 h-28 text-indigo-500 dark:text-indigo-400" strokeWidth={1} />
        </motion.div>

        {/* ✅ نقط متحركة */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, -200],
              x: [null, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 200],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut",
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-400 dark:from-emerald-300 dark:via-blue-300 dark:to-amber-300"
          />
        ))}

        {/* ✅ نقط ذهبية */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`gold-${i}`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -80, -150],
              x: [null, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 180],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
            className="absolute w-1 h-1 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 dark:bg-yellow-300 dark:shadow-yellow-300/30"
          />
        ))}

        {/* ✅ أوراق متطايرة */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: [null, -200, -400],
              x: [null, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
              rotate: [null, Math.random() * 720, Math.random() * 1080],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeOut",
            }}
            className="absolute"
          >
            <Leaf className="w-4 h-4 text-emerald-400/40 dark:text-emerald-300/20" />
          </motion.div>
        ))}

        {/* ✅ دوائر متحدة المركز */}
        <motion.div
          animate={{
            scale: [1, 1.5, 2, 1.5, 1],
            opacity: [0.2, 0.1, 0.05, 0.1, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-emerald-400/20 dark:border-emerald-400/10"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1.6, 1.3, 1],
            opacity: [0.15, 0.08, 0.04, 0.08, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full border border-blue-400/20 dark:border-blue-400/10"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1.4, 1.2, 1],
            opacity: [0.1, 0.06, 0.03, 0.06, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full border border-amber-400/20 dark:border-amber-400/10"
        />

        {/* ✅ Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 60, -40, 80, 0],
            y: [0, -40, 30, -60, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400/20 to-blue-400/20 dark:from-emerald-400/10 dark:to-blue-400/10 blur-2xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 30, -70, 0],
            y: [0, 30, -40, 50, 0],
            scale: [1, 0.8, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-amber-400/20 to-pink-400/20 dark:from-amber-400/10 dark:to-pink-400/10 blur-2xl"
        />
      </div>

      <div className="container-tight relative z-10">
        {/* TOP */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-xl px-5 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400"
            >
              <Leaf className="h-4 w-4" />
              {lang === "ar" ? "منصة تعليمية احترافية" : "Professional Learning Platform"}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-7xl text-gray-900 dark:text-white"
            >
              {pick(about?.name, about?.name_ar) || (
                <>
                  {lang === "ar" ? "تجربة تعليمية" : "Modern Learning"}{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {lang === "ar" ? "بمستوى جديد" : "Experience"}
                  </span>
                </>
              )}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg leading-9 text-gray-600 dark:text-gray-400"
            >
              {pick(about?.description, about?.description_ar) ||
                (lang === "ar"
                  ? "تعلم بطريقة احترافية حديثة مع أفضل تجربة تعليمية تفاعلية مصممة للطلاب والمعلمين."
                  : "Learn with a modern premium educational experience designed for students and teachers.")}
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to={`/${slug}/register`}
                className="group rounded-2xl px-8 py-4 font-bold text-white shadow-[0_10px_40px_rgba(16,185,129,0.25)] transition-all hover:scale-105 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                {lang === "ar" ? "ابدأ الآن" : "Get Started"}
              </Link>

              <Link
                to={`/${slug}/register`}
                className="group flex items-center gap-3 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl px-8 py-4 font-semibold transition-all hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Play className="h-4 w-4 fill-current text-emerald-600 dark:text-emerald-400" />
                </div>
                {lang === "ar" ? "شاهد المنصة" : "Watch Platform"}
              </Link>
            </motion.div>
          </div>

          {/* RIGHT MEDIA (VIDEO or IMAGE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-[40px] blur-[80px] bg-emerald-400/20 dark:bg-emerald-400/10" />

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-5 top-10 z-20 rounded-3xl border border-emerald-200/50 dark:border-emerald-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
                  <Star className="h-6 w-6 fill-current text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{lang === "ar" ? "أفضل تجربة" : "Best Experience"}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Premium LMS UI</p>
                </div>
              </div>
            </motion.div>

            {/* MEDIA PLAYER */}
            <div className="relative overflow-hidden rounded-[40px] border border-emerald-200/30 dark:border-emerald-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-2xl">
              {isVideo && mediaUrl && !videoError ? (
                <div className="relative group">
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    className="w-full rounded-[32px] object-cover"
                    poster={fallbackImage}
                    loop
                    muted={isMuted}
                    playsInline
                    autoPlay={true}
                    onError={() => setVideoError(true)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-[32px]">
                    <button
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-10 h-10 text-white" />
                      ) : (
                        <Play className="w-10 h-10 text-white ml-1" />
                      )}
                    </button>
                  </div>
                  
                  {/* Mute Button */}
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                  
                  {/* AutoPlay Indicator */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-green-500/80 backdrop-blur-xl text-white text-xs font-semibold flex items-center gap-1">
                    <Play className="w-3 h-3 fill-white" />
                    {lang === "ar" ? "تشغيل تلقائي" : "Auto Playing"}
                  </div>
                  
                  {/* Video Indicator */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl text-white text-xs font-semibold">
                    {lang === "ar" ? "فيديو تعريفي" : "Intro Video"}
                  </div>
                </div>
              ) : (
                <img
                  src={mediaUrl || fallbackImage}
                  alt="about"
                  className="h-[650px] w-full rounded-[32px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-[32px]" />
            </div>
          </motion.div>
        </div>

        {/* FEATURES */}
        {features.length > 0 && (
          <div className="mt-28 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature: any, i: number) => {
              const DefaultIcon = FEATURES_ICONS[i % FEATURES_ICONS.length];
              const NatureIcon = NATURE_FEATURES_ICONS[i % NATURE_FEATURES_ICONS.length];
              const Icon = isNature ? NatureIcon : DefaultIcon;
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-[32px] border border-emerald-200/30 dark:border-emerald-800/30 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 hover:border-emerald-300/50 dark:hover:border-emerald-700/50 transition-all"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-emerald-400/5 dark:bg-emerald-400/10" />

                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 dark:bg-emerald-900/50">
                    <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="relative z-10 mt-8">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      {pick(feature.name, feature.name_ar) || "Feature"}
                    </h3>
                    <p className="mt-4 leading-8 text-gray-600 dark:text-gray-400">
                      {pick(feature.description, feature.description_ar) ||
                        (lang === "ar" ? "ميزة احترافية داخل المنصة." : "Professional feature inside the platform.")}
                    </p>
                  </div>

                  <div className="absolute bottom-5 right-5 text-6xl font-black text-gray-200/30 dark:text-gray-800/30">
                    0{i + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

// Skeleton Component
const AboutSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <section className="py-32 bg-white dark:bg-gray-950">
      <div className="container-tight">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="h-10 w-40 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-900/30" />
            <div className="h-20 w-full animate-pulse rounded-3xl bg-emerald-100 dark:bg-emerald-900/20" />
            <div className="h-40 w-full animate-pulse rounded-3xl bg-emerald-100/50 dark:bg-emerald-900/10" />
          </div>
          <div className="h-[650px] animate-pulse rounded-[40px] bg-emerald-100 dark:bg-emerald-900/20" />
        </div>
      </div>
    </section>
  );
};