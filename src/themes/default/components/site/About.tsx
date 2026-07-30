// src/themes/default/components/site/About.tsx

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";
import parse from 'html-react-parser';

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

// ✅ Lazy Loading للـ FeaturesGrid
const FeaturesGrid = lazy(() => 
  import("@/themes/default/components/site/FeaturesGrid").then(m => ({ 
    default: m.FeaturesGrid 
  }))
);

// ✅ Skeleton للـ FeaturesGrid
const FeaturesGridSkeleton = () => (
  <div className="mt-28">
    <div className="text-center mb-12">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto mt-3" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ))}
    </div>
  </div>
);

// ✅ Component للصورة/الفيديو - محسن
const AboutMedia = ({ 
  mediaUrl, 
  isVideo, 
  fallbackImage, 
  lang 
}: { 
  mediaUrl?: string; 
  isVideo: boolean; 
  fallbackImage: string; 
  lang: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ تحسين الصورة
  const optimizedImage = mediaUrl?.includes('web-lec.com') 
    ? `${mediaUrl}?w=800&q=80&fm=webp`
    : mediaUrl;

  // ✅ Intersection Observer للفيديو
  useEffect(() => {
    if (!videoRef.current || !isVideo || videoError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isVideo, videoError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (isVideo && mediaUrl && !videoError) {
    return (
      <div className="relative group overflow-hidden rounded-[40px] bg-black/5 dark:bg-black/20">
        <video
          ref={videoRef}
          src={mediaUrl}
          className="w-full h-[650px] object-cover"
          poster={fallbackImage}
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={() => setIsLoaded(true)}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}

        {/* Video Controls - تظهر عند ال hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
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

        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-green-500/80 backdrop-blur-xl text-white text-xs font-semibold flex items-center gap-1">
          <Play className="w-3 h-3 fill-white" />
          {lang === "ar" ? "تشغيل تلقائي" : "Auto Play"}
        </div>
      </div>
    );
  }

  // ✅ Image
  return (
    <div className="relative overflow-hidden rounded-[40px] bg-gray-100 dark:bg-gray-800">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <img
        src={optimizedImage || fallbackImage}
        alt="about"
        width={800}
        height={650}
        loading="lazy"
        decoding="async"
        className="w-full h-[650px] object-cover transition-opacity duration-500"
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
          setIsLoaded(true);
        }}
      />
    </div>
  );
};

export const About = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { features, about, pick, isLoading } = useSafeTeacherData();
  const isNature = theme === 'nature';

  if (isLoading) {
    return <AboutSkeleton isNature={isNature} />;
  }

  if (!about && !features.length) {
    return null;
  }

  // ✅ البيانات
  const aboutDescriptionHTML = pick(about?.description, about?.description_ar) || 
    (lang === "ar"
      ? "تعلم بطريقة احترافية حديثة مع أفضل تجربة منصة تعلمية في مصر تعليمية تفاعلية مصممة للطلاب والمعلمين."
      : "Learn with a modern premium educational experience designed for students and teachers.");

  const mediaUrl = about?.image?.fullUrl || about?.imageUrl;
  const isVideo = mediaUrl?.endsWith('.mp4') || mediaUrl?.includes('video') || about?.image?.mimeType?.includes('video');
  const fallbackImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80";

  const Icon = isNature ? Leaf : Sparkles;

  return (
    <section id="about" className="relative overflow-hidden py-28 md:py-36 bg-white dark:bg-gray-950">
      
      {/* ✅ Background - مبسط من غير حركات */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl ${
          isNature ? 'bg-emerald-400/10 dark:bg-emerald-400/5' : 'bg-primary/10 dark:bg-primary/5'
        }`} />
        <div className={`absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl ${
          isNature ? 'bg-emerald-300/10 dark:bg-emerald-300/5' : 'bg-primary/10 dark:bg-primary/5'
        }`} />
      </div>

      <div className="container-tight relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold backdrop-blur-xl ${
              isNature 
                ? 'border-emerald-200/30 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                : 'border-primary/20 bg-primary/5 text-primary'
            }`}>
              <Icon className="h-4 w-4" />
              {lang === "ar" ? "منصة تعليمية احترافية" : "Professional Learning Platform"}
            </div>

            {/* Title */}
            <h2 className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-7xl text-gray-900 dark:text-white">
              {pick(about?.name, about?.name_ar) || (
                <>
                  {lang === "ar" ? "تجربة تعليمية" : "Modern Learning"}{" "}
                  <span className={isNature ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}>
                    {lang === "ar" ? "بمستوى جديد" : "Experience"}
                  </span>
                </>
              )}
            </h2>

            {/* Description */}
            <div className="mt-8 max-w-2xl text-lg leading-9 text-gray-600 dark:text-gray-400">
              {parse(aboutDescriptionHTML)}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/register"
                className={`group rounded-2xl px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 ${
                  isNature 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/25'
                    : 'bg-primary hover:bg-primary/90 shadow-primary/25'
                }`}
              >
                {lang === "ar" ? "ابدأ الآن" : "Get Started"}
              </Link>

              <Link
                to="/register"
                className={`group flex items-center gap-3 rounded-2xl border px-8 py-4 font-semibold transition-all hover:shadow-md ${
                  isNature 
                    ? 'border-emerald-200/50 dark:border-emerald-800/50 bg-white/60 dark:bg-gray-900/60 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30 text-slate-800 dark:text-slate-100'
                    : 'border-primary/20 bg-white/60 dark:bg-gray-900/60 hover:bg-primary/5 text-slate-800 dark:text-slate-100'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isNature ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-primary/10'
                }`}>
                  <Play className={`h-4 w-4 fill-current ${
                    isNature ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                  }`} />
                </div>
                {lang === "ar" ? "شاهد المنصة" : "Watch Platform"}
              </Link>
            </div>
          </div>

          {/* RIGHT MEDIA */}
          <div className="relative">
            {/* Glow */}
            <div className={`absolute inset-0 rounded-[40px] blur-[80px] ${
              isNature ? 'bg-emerald-400/20 dark:bg-emerald-400/10' : 'bg-primary/20 dark:bg-primary/10'
            }`} />

            {/* Media */}
            <AboutMedia
              mediaUrl={mediaUrl}
              isVideo={!!isVideo}
              fallbackImage={fallbackImage}
              lang={lang}
            />

            {/* Floating Card - ثابت من غير حركة */}
            <div className={`absolute -right-5 top-10 z-20 rounded-3xl border shadow-2xl p-5 backdrop-blur-2xl ${
              isNature 
                ? 'border-emerald-200/50 dark:border-emerald-800/50 bg-white/80 dark:bg-gray-900/80'
                : 'border-primary/20 bg-white/80 dark:bg-gray-900/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isNature ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-primary/10'
                }`}>
                  <Star className={`h-6 w-6 fill-current ${
                    isNature ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                  }`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                     {parse(about?.sub_title, about?.sub_title) || (
                <>
                  {lang === "ar" ? "تجربة تعليمية" : "Modern Learning"}{" "}
                  <span className={isNature ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}>
                    {lang === "ar" ? "بمستوى جديد" : "Experience"}
                  </span>
                </>
              )}
                  </h4>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FEATURES - Lazy Loading */}
        {features.length > 0 && (
          <div className="mt-28">
            <Suspense fallback={<FeaturesGridSkeleton />}>
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
                }}
              />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  );
};

// ✅ Skeleton محسن
const AboutSkeleton = ({ isNature }: { isNature: boolean }) => {
  const bgClass = isNature ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-gray-200 dark:bg-gray-800';
  const bgLight = isNature ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-gray-100 dark:bg-gray-700';

  return (
    <section className="py-32 bg-white dark:bg-gray-950">
      <div className="container-tight">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className={`h-10 w-40 animate-pulse rounded-full ${bgClass}`} />
            <div className={`h-20 w-full animate-pulse rounded-3xl ${bgClass}`} />
            <div className={`h-40 w-full animate-pulse rounded-3xl ${bgLight}`} />
            <div className="flex gap-4">
              <div className={`h-14 w-32 animate-pulse rounded-2xl ${bgClass}`} />
              <div className={`h-14 w-40 animate-pulse rounded-2xl ${bgLight}`} />
            </div>
          </div>
          <div className={`h-[650px] animate-pulse rounded-[40px] ${bgClass}`} />
        </div>
      </div>
    </section>
  );
};

export default About;