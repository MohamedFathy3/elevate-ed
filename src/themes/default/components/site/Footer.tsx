// Footer.tsx - مع صورة المعلم في الأعلى كـ Logo

import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import logoImage from "@/assets/logo.png";
import bananaImage from "@/assets/designed by @banana.png";

// ✅ أيقونة TikTok المخصصة
const TikTokIcon = ({ size = 22, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4c0 .86-.68 2.03-1.52 2.18-.84.15-1.84-.29-2.24-1.01-.4-.72-.27-1.91.29-2.43.56-.52 1.36-.63 1.95-.33V8.84c-2.62-.09-4.87 1.97-4.87 4.58 0 2.24 1.46 4.14 3.5 4.79 2.04.65 4.36-.1 5.46-1.77.91-1.38 1.02-3.18.8-4.75h-2.79V10.6c.94.42 1.99.6 3.04.6v-3.1c-.23 0-.45-.02-.68-.08v.01z"/>
  </svg>
);

export const Footer = () => {
  const { lang } = useLang();
  const { theme, colorMode } = useTheme();
  const { teacher, slug, pick } = useSafeTeacher();

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const footer = teacher?.website?.footer || {};
  const currentYear = new Date().getFullYear();

  // ✅ صورة المعلم (Logo) - تحسين جلب الصورة
  const teacherLogo = teacher?.image?.fullUrl || teacher?.imageUrl || teacher?.website?.home?.image?.fullUrl || teacher?.website?.home?.imageUrl || null;
  const teacherName = pick(teacher?.name, teacher?.name_ar) || (lang === "ar" ? "المعلم" : "Teacher");

  // ✅ الألوان
  const getBgColor = () => {
    if (isNature) {
      return isDark ? 'bg-amber-950' : 'bg-amber-50';
    }
    return isDark ? 'bg-slate-900' : 'bg-white';
  };

  const getTextColor = () => {
    if (isNature) {
      return isDark ? 'text-amber-200' : 'text-amber-900';
    }
    return isDark ? 'text-slate-200' : 'text-slate-800';
  };

  const getMutedColor = () => {
    if (isNature) {
      return isDark ? 'text-amber-400/60' : 'text-amber-700/60';
    }
    return isDark ? 'text-slate-400' : 'text-slate-500';
  };

  const getBorderColor = () => {
    if (isNature) {
      return isDark ? 'border-amber-800' : 'border-amber-200';
    }
    return isDark ? 'border-slate-700' : 'border-slate-200';
  };

  const getDividerColor = () => {
    if (isNature) {
      return isDark ? 'bg-amber-800' : 'bg-amber-200';
    }
    return isDark ? 'bg-slate-700' : 'bg-slate-200';
  };

  // ✅ ألوان الـ primary
  const getPrimaryColor = () => {
    if (isNature) {
      return isDark ? 'bg-amber-600' : 'bg-amber-600';
    }
    return 'bg-blue-600';
  };

  const getPrimaryHoverColor = () => {
    if (isNature) {
      return isDark ? 'hover:bg-amber-500' : 'hover:bg-amber-700';
    }
    return 'hover:bg-blue-700';
  };

  // ✅ البيانات من API
  const description = pick(footer.description, footer.description_ar) ||
    (lang === "ar" 
      ? "تم صنع هذه المنصة بهدف تهيئة الطالب لـ كامل جوانب اللغة العربية" 
      : "This platform is designed to prepare students in all aspects of the Arabic language");

  // ✅ السوشيال ميديا
  const socials = [
    { 
      icon: Facebook, 
      href: footer.facebook_link,
      label: "Facebook"
    },
    { 
      icon: Instagram, 
      href: footer.instagram_link,
      label: "Instagram"
    },
    { 
      icon: Youtube, 
      href: footer.youtube_link,
      label: "YouTube"
    },
    { 
      icon: TikTokIcon, 
      href: footer.tiktok_link,
      label: "TikTok"
    },
    { 
      icon: MessageCircle, 
      href: footer.whatsapp_link,
      label: "WhatsApp"
    },
  ].filter((x) => x.href && x.href.trim() !== "");

  const hasSocialLinks = socials.length > 0;

  return (
    <footer className={`${getBgColor()} ${getTextColor()} border-t ${getBorderColor()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* ✅ Logo في الأعلى - صورة المعلم */}
        <div className="flex flex-col items-center justify-center mb-10">
          {teacherLogo ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 ${getPrimaryColor()} shadow-2xl shadow-${isNature ? 'amber' : 'blue'}-500/20 group-hover:shadow-${isNature ? 'amber' : 'blue'}-500/40 transition-all duration-300`}>
                <img
                  src={teacherLogo}
                  alt={teacherName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              {/* ✅ Badge "المعلم" أو "Teacher" */}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${getPrimaryColor()} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap ${getPrimaryHoverColor()}`}>
                {lang === "ar" ? "المعلم" : "Teacher"}
              </div>
            </motion.div>
          ) : (
            // ✅ Fallback لو مفيش صورة
            <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${isNature ? 'from-amber-500 to-amber-600' : 'from-blue-500 to-blue-600'} flex items-center justify-center shadow-2xl shadow-${isNature ? 'amber' : 'blue'}-500/20`}>
              <span className="text-4xl font-bold text-white">
                {teacherName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* ✅ اسم المعلم تحت الصورة */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-2xl md:text-3xl font-bold text-center"
          >
            {teacherName}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm ${getMutedColor()} text-center`}
          >
            {lang === "ar" ? "منصة تعليمية متكاملة" : "Integrated Educational Platform"}
          </motion.p>
        </div>

        {/* فاصل بعد الـ Logo */}
        <div className={`h-px ${getDividerColor()} my-8`} />

        {/* الصف العلوي: سوشيال ميديا (يمين) + وصف (شمال) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* يمين - تابعنا */}
          <div className="text-center md:text-right order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {lang === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us on social media"}
            </h2>
            <div className="flex gap-4 justify-center md:justify-end flex-wrap">
              {hasSocialLinks ? (
                socials.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-full border ${getBorderColor()} transition-all hover:${getPrimaryColor()} hover:text-white hover:border-transparent group relative`}
                      title={social.label}
                    >
                      <Icon size={22} />
                      {/* Tooltip صغير */}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 text-white px-2 py-1 rounded">
                        {social.label}
                      </span>
                    </motion.a>
                  );
                })
              ) : (
                <p className={`text-sm ${getMutedColor()}`}>
                  {lang === "ar" ? "لا توجد روابط حالياً" : "No social links available"}
                </p>
              )}
            </div>
          </div>

          {/* شمال - وصف المنصة */}
          <div className="text-center md:text-left order-1 md:order-2">
            <p className="text-lg leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* فاصل */}
        <div className={`h-px ${getDividerColor()} my-8`} />

        {/* ✅ الصور السفلية - TeacherPlanet & Banana Agency */}
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              src={logoImage}
              alt="TeacherPlanet"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-300"
            />
            
            <span className={`text-xl font-bold ${getMutedColor()}`}>✧</span>
            
            <motion.img
              whileHover={{ scale: 1.05, rotate: -5 }}
              src={bananaImage}
              alt="Banana Agency"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-300"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-center text-sm ${getMutedColor()}`}
          >
            <span>{lang === "ar" ? "تم التطوير بواسطة" : "Developed by"}{" "}</span>
            <span className={`font-bold ${isNature ? 'text-amber-600' : 'text-blue-600'}`}>TeacherPlanet</span>
            <span> {lang === "ar" ? "و" : "&"} </span>
            <span className={`font-bold ${isNature ? 'text-amber-600' : 'text-blue-600'}`}>Banana Agency</span>
          </motion.div>
        </div>

        <div className={`h-px ${getDividerColor()} my-6`} />

        <div className="text-center pt-2">
          <p className={`text-sm ${getMutedColor()}`}>
            {lang === "ar" ? "جميع الحقوق محفوظة" : "All Copy Rights Reserved"} © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};