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
      className={`relative overflow-hidden py-28 md:py-36 ${isNature ? '' : ''}`}
    >
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
          className={`absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]
            ${isNature ? 'bg-emerald-400/20' : 'bg-primary/20'}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
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
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold backdrop-blur-xl
                ${isNature 
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-700' 
                  : 'border-primary/20 bg-primary/10 text-primary'}`}
            >
              {isNature ? <Leaf className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {lang === "ar" ? "منصة تعليمية احترافية" : "Professional Learning Platform"}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-7xl"
            >
              {pick(about?.name, about?.name_ar) || (
                <>
                  {lang === "ar" ? "تجربة تعليمية" : "Modern Learning"}{" "}
                  <span className={isNature ? 'text-emerald-600' : 'text-primary'}>
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
              className="mt-8 max-w-2xl text-lg leading-9 text-foreground/65"
            >
              {pick(about?.description, about?.description_ar) ||
                (lang === "ar"
                  ? "تعلم بطريقة احترافية حديثة مع أفضل تجربة تعليمية تفاعلية مصممة للطلاب والمعلمين."
                  : "Learn with a modern premium educational experience designed for students and teachers.")}
            </motion.p>

            {/* BUTTONS - معدل عشان يودي على register */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to={`/${slug}/register`}
                className={`group rounded-2xl px-8 py-4 font-bold text-white shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all hover:scale-105
                  ${isNature ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'}`}
              >
                {lang === "ar" ? "ابدأ الآن" : "Get Started"}
              </Link>

              <Link
                to={`/${slug}/register`}
                className={`group flex items-center gap-3 rounded-2xl border px-8 py-4 font-semibold backdrop-blur-xl transition-all hover:bg-primary/5
                  ${isNature 
                    ? 'border-emerald-200 bg-white/60 hover:border-emerald-300' 
                    : 'border-border bg-card/60 hover:border-primary/30'}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full
                  ${isNature ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                  <Play className={`h-4 w-4 fill-current ${isNature ? 'text-emerald-600' : 'text-primary'}`} />
                </div>
                {lang === "ar" ? "شاهد المنصة" : "Watch Platform"}
              </Link>
            </motion.div>

            {/* ✅ STATS - تم إزالتها */}
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
            <div className={`absolute inset-0 rounded-[40px] blur-[80px]
              ${isNature ? 'bg-emerald-400/20' : 'bg-primary/20'}`} />

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className={`absolute -right-5 top-10 z-20 rounded-3xl border p-5 shadow-2xl backdrop-blur-2xl
                ${isNature 
                  ? 'border-emerald-200 bg-white/80' 
                  : 'border-border bg-background/80'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl
                  ${isNature ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                  <Star className={`h-6 w-6 fill-current ${isNature ? 'text-emerald-600' : 'text-primary'}`} />
                </div>
                <div>
                  <h4 className="font-bold">{lang === "ar" ? "أفضل تجربة" : "Best Experience"}</h4>
                  <p className="text-sm text-foreground/60">Premium LMS UI</p>
                </div>
              </div>
            </motion.div>

            {/* MEDIA PLAYER */}
            <div className={`relative overflow-hidden rounded-[40px] border backdrop-blur-2xl
              ${isNature 
                ? 'border-emerald-200 bg-white/50' 
                : 'border-border bg-card/50'}`}>
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
                  className={`group relative overflow-hidden rounded-[32px] border p-8 backdrop-blur-2xl
                    ${isNature 
                      ? 'border-emerald-200 bg-white/60 hover:border-emerald-300' 
                      : 'border-border bg-card/60 hover:border-primary/20'}`}
                >
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100
                    ${isNature ? 'bg-emerald-400/5' : 'bg-primary/5'}`} />

                  <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl
                    ${isNature ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                    <Icon className={`h-8 w-8 ${isNature ? 'text-emerald-600' : 'text-primary'}`} />
                  </div>

                  <div className="relative z-10 mt-8">
                    <h3 className="text-2xl font-black">
                      {pick(feature.name, feature.name_ar) || "Feature"}
                    </h3>
                    <p className="mt-4 leading-8 text-foreground/60">
                      {pick(feature.description, feature.description_ar) ||
                        (lang === "ar" ? "ميزة احترافية داخل المنصة." : "Professional feature inside the platform.")}
                    </p>
                  </div>

                  <div className="absolute bottom-5 right-5 text-6xl font-black text-foreground/[0.03]">
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
    <section className={`py-32 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className={`h-10 w-40 animate-pulse rounded-full ${isNature ? 'bg-emerald-200' : 'bg-muted'}`} />
            <div className={`h-20 w-full animate-pulse rounded-3xl ${isNature ? 'bg-emerald-100' : 'bg-muted'}`} />
            <div className={`h-40 w-full animate-pulse rounded-3xl ${isNature ? 'bg-emerald-100/50' : 'bg-muted'}`} />
          </div>
          <div className={`h-[650px] animate-pulse rounded-[40px] ${isNature ? 'bg-emerald-100' : 'bg-muted'}`} />
        </div>
      </div>
    </section>
  );
};