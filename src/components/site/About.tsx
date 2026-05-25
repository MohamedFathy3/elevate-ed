/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/About.tsx

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";

import {
  Sparkles,
  GraduationCap,
  Rocket,
  BrainCircuit,
  ShieldCheck,
  Star,
  Play,
} from "lucide-react";

const FEATURES_ICONS = [
  GraduationCap,
  Rocket,
  BrainCircuit,
  ShieldCheck,
];

export const About = () => {
  const { lang } = useLang();
  const { features, about, pick, isLoading } =
    useSafeTeacherData();

  if (isLoading) {
    return <AboutSkeleton />;
  }

  if (!about && !features.length) {
    return null;
  }

  return (
    <section
      id="about"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />

        {/* Grid */}
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
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-bold text-primary backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" />

              {lang === "ar"
                ? "منصة تعليمية احترافية"
                : "Professional Learning Platform"}
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
                  {lang === "ar"
                    ? "تجربة تعليمية"
                    : "Modern Learning"}{" "}
                  <span className="text-primary">
                    {lang === "ar"
                      ? "بمستوى جديد"
                      : "Experience"}
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
              {pick(
                about?.description,
                about?.description_ar
              ) ||
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
              <button className="group rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-[0_10px_40px_rgba(124,58,237,0.35)] transition-all hover:scale-105">
                {lang === "ar"
                  ? "ابدأ الآن"
                  : "Get Started"}
              </button>

              <button className="group flex items-center gap-3 rounded-2xl border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-primary/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Play className="h-4 w-4 fill-primary text-primary" />
                </div>

                {lang === "ar"
                  ? "شاهد المنصة"
                  : "Watch Platform"}
              </button>
            </motion.div>

            {/* STATS */}
            <div className="mt-14 grid grid-cols-3 gap-5">
              {[
                {
                  number: "10K+",
                  label:
                    lang === "ar"
                      ? "طالب"
                      : "Students",
                },
                {
                  number: "120+",
                  label:
                    lang === "ar"
                      ? "دورة"
                      : "Courses",
                },
                {
                  number: "4.9",
                  label:
                    lang === "ar"
                      ? "تقييم"
                      : "Rating",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border border-border bg-card/50 p-6 text-center backdrop-blur-xl"
                >
                  <h3 className="text-3xl font-black text-primary">
                    {item.number}
                  </h3>

                  <p className="mt-2 text-sm text-foreground/60">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-[40px] bg-primary/20 blur-[80px]" />

            {/* Floating Card */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -right-5 top-10 z-20 rounded-3xl border border-border bg-background/80 p-5 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Star className="h-6 w-6 fill-primary text-primary" />
                </div>

                <div>
                  <h4 className="font-bold">
                    {lang === "ar"
                      ? "أفضل تجربة"
                      : "Best Experience"}
                  </h4>

                  <p className="text-sm text-foreground/60">
                    Premium LMS UI
                  </p>
                </div>
              </div>
            </motion.div>

            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-[40px] border border-border bg-card/50 p-4 backdrop-blur-2xl">
              <img
                src={
                  about?.image?.fullUrl ||
                  about?.imageUrl ||
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                }
                alt="about"
                className="h-[650px] w-full rounded-[32px] object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* FEATURES */}
        {features.length > 0 && (
          <div className="mt-28 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature: any, i: number) => {
              const Icon =
                FEATURES_ICONS[
                  i % FEATURES_ICONS.length
                ];

              return (
                <motion.div
                  key={feature.id}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  className="group relative overflow-hidden rounded-[32px] border border-border bg-card/60 p-8 backdrop-blur-2xl"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-primary/5" />
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-8">
                    <h3 className="text-2xl font-black">
                      {pick(
                        feature.name,
                        feature.name_ar
                      ) || "Feature"}
                    </h3>

                    <p className="mt-4 leading-8 text-foreground/60">
                      {pick(
                        feature.description,
                        feature.description_ar
                      ) ||
                        (lang === "ar"
                          ? "ميزة احترافية داخل المنصة."
                          : "Professional feature inside the platform.")}
                    </p>
                  </div>

                  {/* Number */}
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

const AboutSkeleton = () => {
  return (
    <section className="py-32">
      <div className="container-tight">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="h-10 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-20 w-full animate-pulse rounded-3xl bg-muted" />
            <div className="h-40 w-full animate-pulse rounded-3xl bg-muted" />
          </div>

          <div className="h-[650px] animate-pulse rounded-[40px] bg-muted" />
        </div>
      </div>
    </section>
  );
};