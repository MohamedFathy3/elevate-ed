// src/themes/default/components/site/About.tsx

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useTheme } from "@/context/ThemeContext";
import { Link, useParams } from "react-router-dom";
import { FeaturesGrid } from "@/themes/default/components/site/FeaturesGrid"; // ✅ استيراد الكومبوننت

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
        {/* ... باقي الخلفية زي ما هي ... */}
      </div>

      <div className="container-tight relative z-10">
        {/* TOP - نفس الكود */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT - نفس الكود */}
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
                  ? "تعلم بطريقة احترافية حديثة مع أفضل تجربة منصة تعلمية في مصر تعليمية تفاعلية مصممة للطلاب والمعلمين."
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
                to={`/register`}
                className="group rounded-2xl px-8 py-4 font-bold text-white shadow-[0_10px_40px_rgba(16,185,129,0.25)] transition-all hover:scale-105 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                {lang === "ar" ? "ابدأ الآن" : "Get Started"}
              </Link>

              <Link
                to={`/register`}
                className="group flex items-center gap-3 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl px-8 py-4 font-semibold transition-all hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Play className="h-4 w-4 fill-current text-emerald-600 dark:text-emerald-400" />
                </div>
                {lang === "ar" ? "شاهد المنصة" : "Watch Platform"}
              </Link>
            </motion.div>
          </div>

          {/* RIGHT MEDIA (VIDEO or IMAGE) - نفس الكود */}
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
                  <h4 className="font-bold text-gray-900 dark:text-white">{lang === "ar" ? "أفضل تجربة منصة تعلمية في مصر" : "Best Experience"}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400"></p>
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

        {/* ✅ FEATURES - استخدام الكومبوننت الجديد */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-28"
          >
            <FeaturesGrid
              features={features}
              title={lang === "ar" ? "مميزات المنصة" : "Platform Features"}
              subtitle={lang === "ar" 
                ? "اكتشف المميزات التي تجعل منصتنا الخيار الأمثل للتعلم" 
                : "Discover the features that make our platform the best choice for learning"
              }
              columns={4}
              variant={isNature ? 'nature' : 'default'}
              showNumbers={true}
              showImages={true}
              imagePosition="icon"
              onFeatureClick={(feature) => {
                console.log("Feature clicked:", feature);
                // هنا تقدر تفتح مودال أو تروح لصفحة الميزة
              }}
            />
          </motion.div>
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

export default About;