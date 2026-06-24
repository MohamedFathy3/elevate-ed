// components/site/Hero.tsx
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, ArrowRight, ArrowLeft, Lightbulb, Atom, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ تعريف الـ Type للـ Home data
interface HomeData {
  title?: string;
  title_ar?: string;
  sub_title?: string;
  sub_title_ar?: string;
  description?: string;
  description_ar?: string;
  imageUrl?: string;
  image?: {
    fullUrl?: string;
  };
}

export const Hero = () => {
  const { dir, lang } = useLang();
  const { teacher, slug, pick, isLoading } = useTeacher();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // ✅ Safe access with proper typing
  const home = teacher?.website?.home as HomeData || {};
  
  // ✅ Fallback values لو البيانات مش موجودة
  const heroTitle = pick(home.title, home.title_ar) || teacher?.name || (lang === "ar" ? "مرحباً بك" : "Welcome");
  const heroSubTitle = pick(home.sub_title, home.sub_title_ar) || (lang === "ar" ? "تعلم مع أفضل المعلمين" : "Learn with the best teachers");
  const heroDescription = pick(home.description, home.description_ar) || (lang === "ar" 
    ? "انضم إلينا اليوم وابدأ رحلتك التعليمية" 
    : "Join us today and start your learning journey");
  const heroImage = home.imageUrl || home.image?.fullUrl || teacher?.website?.home?.image?.fullUrl || "/default-hero.jpg";
  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");

  // ✅ لو لسه بيجيب البيانات
  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden gradient-hero-bg">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Animated decorative elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[5%] w-32 h-32 rounded-full border-2 border-primary/15 hidden md:block"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[3%] w-24 h-24 hidden md:block"
      >
        <Atom className="w-full h-full text-primary/15" strokeWidth={1} />
      </motion.div>

      <div className="container-tight relative grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 text-primary font-semibold text-sm"
          >
            <Sparkles className="w-4 h-4" fill="currentColor" />
            {lang === "ar" ? "أهلاً بك في" : "Welcome to"}
          </motion.div>

          <h1 className="font-display font-black tracking-tight text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="block text-gradient-rainbow"
            >
              {heroTitle}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg md:text-xl text-foreground/70 leading-relaxed max-w-xl"
          >
            {heroSubTitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 p-5 md:p-6 rounded-3xl  border  shadow-soft max-w-xl bg-[#d5dbe273]"
          >
           <div className="flex gap-4 py-5">
  <div className="shrink-0 w-5 h-9 rounded-full  grid place-items-center shadow-soft">
    <CheckCircle2 className="w-5 h-5 text-white" />
  </div>

  <p className="min-w-0 break-words text-sm  leading-relaxed">
    {heroDescription}
  </p>
</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to={`/register`}
              className="group inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-2xl gradient-accent text-white font-bold text-base md:text-lg shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5" fill="white" />
              <span>{lang === "ar" ? "سجّل دلوقتي" : "Register Now"}</span>
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              to={`/courses`}
              className="group inline-flex items-center gap-3 px-6 shadow-glow  md:px-8 py-4 md:py-5 rounded-2xl  text-white font-bold text-base md:text-lg shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="shadow-glow ">              {lang === "ar" ? "تصفح الكورسات" : "Browse Courses"}
</span>
            </Link>
          </motion.div>
        </div>

        {/* Right side - Image with animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative aspect-square max-w-lg mx-auto w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-primary/25"
          >
            <span className="absolute -top-2 left-1/2 w-4 h-4 rounded-full gradient-accent shadow-glow" />
            <span className="absolute top-1/2 -right-2 w-3 h-3 rounded-full bg-[hsl(var(--cyan))] shadow-glow" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border-2 border-[hsl(var(--pink))]/30"
          >
            <span className="absolute -bottom-1.5 left-1/3 w-3 h-3 rounded-full bg-[hsl(var(--pink))] shadow-glow" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full border border-primary/15"
          />

          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-16 rounded-full gradient-primary blur-2xl"
          />

          <div className="absolute inset-16 rounded-full  shadow-glow overflow-hidden">
            {heroImage ? (
              <img
                src={heroImage}
                alt={teacherName}
                className="w-full h-full object-cover"
              
              />
            ) : (
              <div className="w-full h-full gradient-primary grid place-items-center">
                <span className="text-white text-4xl font-bold">
                  {teacherName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-2 md:right-0 w-16 h-16 rounded-2xl  shadow-card grid place-items-center"
          >
            <Zap className="w-7 h-7 text-accent" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-12 left-2 md:left-0 w-16 h-16 rounded-2xl  shadow-card grid place-items-center"
          >
            <Lightbulb className="w-7 h-7 text-amber-400" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 left-0 md:-left-4 w-14 h-14 rounded-2xl gradient-primary shadow-card grid place-items-center"
          >
            <Atom className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// 🟢 Skeleton component for loading state
const HeroSkeleton = () => {
  const { lang } = useLang();
  
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden gradient-hero-bg">
      <div className="container-tight relative grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />
          <div className="h-16 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 w-3/4" />
          <div className="h-16 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 w-2/3" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 w-1/2" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-3xl mb-8" />
          <div className="flex gap-3">
            <div className="h-14 w-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="h-14 w-36 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </div>
        <div className="animate-pulse">
          <div className="aspect-square rounded-full bg-gray-200 dark:bg-gray-700 mx-auto max-w-lg" />
        </div>
      </div>
    </section>
  );
};