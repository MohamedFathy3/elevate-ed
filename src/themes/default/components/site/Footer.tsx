// Ultra Modern Footer - يدعم الثيمات والوضع الليلي

import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  Zap,
  Leaf,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacher } from "@/context/TeacherContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useTheme } from "@/context/ThemeContext";

export const Footer = () => {
  const { lang } = useLang();
  const { theme, colorMode } = useTheme();
  const { teacher, slug, pick } = useSafeTeacher();
  const { isAuthenticated } = useStudentAuth();

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const footer = teacher?.website?.footer || {};

  // الألوان حسب الثيم والوضع
  const getBgColor = () => {
    if (isNature) {
      return isDark ? 'bg-amber-950/90' : 'bg-cream';
    }
    return isDark ? 'bg-black' : 'bg-white';
  };

  const getTextColor = () => {
    if (isNature) {
      return isDark ? 'text-amber-200' : 'text-amber-900';
    }
    return isDark ? 'text-white' : 'text-gray-900';
  };

  const getMutedColor = () => {
    if (isNature) {
      return isDark ? 'text-amber-400/60' : 'text-amber-700/60';
    }
    return isDark ? 'text-white/50' : 'text-gray-600';
  };

  const getBorderColor = () => {
    if (isNature) {
      return isDark ? 'border-amber-800' : 'border-amber-200';
    }
    return isDark ? 'border-white/10' : 'border-gray-200';
  };

  const getGlowColor = () => {
    if (isNature) {
      return isDark ? 'bg-amber-400/20' : 'bg-amber-500/20';
    }
    return isDark ? 'bg-white/10' : 'bg-primary/10';
  };

  const footerName =
    pick(footer.name, footer.name_ar) ||
    (lang === "ar" ? "منصة تعليمية" : "Learning Platform");

  const description =
    pick(footer.description, footer.description_ar) ||
    (lang === "ar"
      ? "تعلم بشكل احترافي مع أفضل تجربة تعليمية"
      : "Learn professionally with a premium experience");

  const socials = [
    {
      icon: Facebook,
      href: footer.facebook_link,
    },
    {
      icon: Instagram,
      href: footer.instagram_link,
    },
    {
      icon: Youtube,
      href: footer.youtube_link,
    },
    {
      icon: MessageCircle,
      href: footer.whatsapp_link,
    },
  ].filter((x) => x.href);

  // تحديد الوجهة حسب حالة المستخدم
  const ctaLink = isAuthenticated ? `/${slug}/courses` : `/${slug}/register`;
  const ctaText = isAuthenticated 
    ? (lang === "ar" ? "استعرض الكورسات" : "Browse Courses")
    : (lang === "ar" ? "ابدأ الآن" : "Start Now");

  return (
    <footer className={`relative overflow-hidden border-t ${getBorderColor()} ${getBgColor()} ${getTextColor()}`}>
      {/* Background */}
      <div className="absolute inset-0">
        {/* Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className={`absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px] ${getGlowColor()}`}
        />

        {/* Grid */}
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:60px_60px]
          ${isNature ? (isDark ? 'opacity-20' : 'opacity-30') : 'opacity-30'}`} />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="container-tight relative z-10">
        {/* TOP CTA */}
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className={`relative mt-24 overflow-hidden rounded-[40px] border p-10 backdrop-blur-2xl md:p-20
            ${getBorderColor()} ${isNature ? (isDark ? 'bg-amber-900/30' : 'bg-white/80') : (isDark ? 'bg-white/[0.03]' : 'bg-gray-50')}`}
        >
          {/* Animated Border */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute -right-24 -top-24 h-72 w-72 rounded-full border ${getBorderColor()}`}
          />

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute -bottom-24 -left-24 h-96 w-96 rounded-full border ${getBorderColor()}`}
          />

          {/* Floating Particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
              }}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Sparkles className={`h-3 w-3 ${getMutedColor()}`} />
            </motion.div>
          ))}

          <div className="relative z-10 text-center">
            {/* Logo */}
            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.1,
              }}
              className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border backdrop-blur-xl
                ${getBorderColor()} ${isNature ? (isDark ? 'bg-amber-800/50' : 'bg-amber-100') : (isDark ? 'bg-white/5' : 'bg-gray-100')}`}
            >
              {isNature ? (
                <Leaf className={`h-10 w-10 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
              ) : (
                <Zap className={`h-10 w-10 ${isDark ? 'text-white' : 'text-primary'}`} />
              )}
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl"
            >
              {isAuthenticated 
                ? (lang === "ar" ? "واصل رحلة التعلم" : "Continue Your Learning Journey")
                : (lang === "ar" ? "ابدأ التعلم بمستوى جديد" : "Enter The Future Of Learning")}
            </motion.h2>

            {/* Desc */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mx-auto mt-8 max-w-2xl text-lg leading-8 ${getMutedColor()}`}
            >
              {description}
            </motion.p>

            {/* Button */}
            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="mt-12"
            >
              <Link
                to={ctaLink}
                className={`group inline-flex items-center gap-4 rounded-full border px-10 py-5 text-lg font-bold transition-all
                  ${isNature 
                    ? (isDark 
                        ? 'border-amber-700 bg-amber-600 text-white hover:shadow-[0_0_60px_rgba(245,158,11,0.35)]' 
                        : 'border-amber-300 bg-amber-500 text-white hover:shadow-[0_0_60px_rgba(245,158,11,0.35)]')
                    : (isDark 
                        ? 'border-white/10 bg-white text-black hover:shadow-[0_0_60px_rgba(255,255,255,0.35)]' 
                        : 'border-gray-200 bg-black text-white hover:shadow-[0_0_60px_rgba(0,0,0,0.15)]')}`}
              >
                {ctaText}
                <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* FOOTER CONTENT */}
        <div className="grid gap-16 py-24 md:grid-cols-3">
          {/* LEFT */}
          <div>
            <Link to={`/${slug}`} className="inline-flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-[22px] border backdrop-blur-xl
                ${getBorderColor()} ${isNature ? (isDark ? 'bg-amber-800/50' : 'bg-amber-100') : (isDark ? 'bg-white/5' : 'bg-gray-100')}`}>
                {isNature ? (
                  <Leaf className={`h-7 w-7 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
                ) : (
                  <Zap className={`h-7 w-7 ${isDark ? 'text-white' : 'text-primary'}`} />
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black">{footerName}</h3>
                <p className={getMutedColor()}>Premium LMS</p>
              </div>
            </Link>

            <p className={`mt-8 max-w-sm leading-8 ${getMutedColor()}`}>
              {description}
            </p>

            {/* Social */}
            <div className="mt-10 flex gap-4">
              {socials.map((social, i) => {
                const Icon = social.icon;

                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{
                      y: -10,
                      scale: 1.08,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className={`group flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur-xl transition-all
                      ${getBorderColor()} ${isNature 
                        ? (isDark ? 'bg-amber-900/50 hover:bg-amber-600 hover:text-white' : 'bg-amber-100 hover:bg-amber-500 hover:text-white') 
                        : (isDark ? 'bg-white/[0.04] hover:bg-white hover:text-black' : 'bg-gray-100 hover:bg-black hover:text-white')}`}
                  >
                    <Icon className="h-5 w-5 transition-transform group-hover:scale-125" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* CENTER - Quick Links */}
          <div>
            <h4 className="mb-8 text-xl font-bold">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>

            <ul className="space-y-5">
              {[
                {
                  label: lang === "ar" ? "الرئيسية" : "Home",
                  href: `/${slug}`,
                },
                {
                  label: lang === "ar" ? "الكورسات" : "Courses",
                  href: `/${slug}/courses`,
                },
                {
                  label: lang === "ar" ? "المراحل" : "Stages",
                  href: `/${slug}#stages`,
                },
                {
                  label: lang === "ar" ? "الكتب" : "Books",
                  href: `/${slug}#books`,
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{
                    x: 10,
                  }}
                >
                  <Link
                    to={item.href}
                    className={`group flex items-center gap-3 text-lg transition-all ${getMutedColor()} hover:${isNature ? 'text-amber-600' : 'text-primary'}`}
                  >
                    <span className={`h-[6px] w-[6px] rounded-full transition-all group-hover:w-5
                      ${isNature ? 'bg-amber-500' : (isDark ? 'bg-white/40' : 'bg-gray-400')}`} />
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* RIGHT - Contact */}
          <div>
            <h4 className="mb-8 text-xl font-bold">
              {lang === "ar" ? "تواصل معنا" : "Contact"}
            </h4>

            <div className="space-y-5">
              {footer.email && (
                <motion.a
                  whileHover={{
                    scale: 1.03,
                  }}
                  href={`mailto:${footer.email}`}
                  className={`block rounded-3xl border p-6 backdrop-blur-xl transition-all
                    ${getBorderColor()} ${isNature ? (isDark ? 'bg-amber-900/30 hover:bg-amber-800/50' : 'bg-amber-50 hover:bg-amber-100') : (isDark ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'bg-gray-50 hover:bg-gray-100')}`}
                >
                  <p className={`mb-2 text-sm ${getMutedColor()}`}>Email</p>
                  <p className="text-lg font-medium">{footer.email}</p>
                </motion.a>
              )}

              {footer.phone && (
                <motion.a
                  whileHover={{
                    scale: 1.03,
                  }}
                  href={`tel:${footer.phone}`}
                  className={`block rounded-3xl border p-6 backdrop-blur-xl transition-all
                    ${getBorderColor()} ${isNature ? (isDark ? 'bg-amber-900/30 hover:bg-amber-800/50' : 'bg-amber-50 hover:bg-amber-100') : (isDark ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'bg-gray-50 hover:bg-gray-100')}`}
                >
                  <p className={`mb-2 text-sm ${getMutedColor()}`}>Phone</p>
                  <p className="text-lg font-medium">{footer.phone}</p>
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className={`border-t ${getBorderColor()} py-8`}>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className={`text-sm ${getMutedColor()}`}>
              © {new Date().getFullYear()} {footerName}.{" "}
              {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
            </p>

            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className={`flex items-center gap-2 text-sm ${getMutedColor()}`}
            >
              <span>{lang === "ar" ? "مصمم بإبداع" : "Crafted With Passion"}</span>
              <span>✦</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};