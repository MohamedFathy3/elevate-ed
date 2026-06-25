// Footer.tsx - مع إضافة صورة المعلم

import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, MessageCircle, MapPin, BookOpen, Library, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import logoImage from "@/assets/logo.png";
import bananaImage from "@/assets/designed by @banana.png";

export const Footer = () => {
  const { lang } = useLang();
  const { theme, colorMode } = useTheme();
  const { teacher, slug, pick } = useSafeTeacher();

  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const footer = teacher?.website?.footer || {};
  const currentYear = new Date().getFullYear();

  // ✅ صورة المعلم (Logo)
  const teacherLogo = teacher?.imageUrl || teacher?.website?.home?.imageUrl || teacher?.website?.home?.image?.fullUrl;

  // ✅ الألوان
  const getBgColor = () => {
    if (isNature) {
      return isDark ? 'bg-amber-950' : 'bg-cream';
    }
    return isDark ? 'bg-slate-900' : 'bg-[#ffffff87]';
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

  // ✅ البيانات من API
  const footerName = pick(footer.name, footer.name_ar) || 
    (lang === "ar" ? "منصة تعليمية" : "Learning Platform");

  const description = pick(footer.description, footer.description_ar) ||
    (lang === "ar" 
      ? "تم صنع هذه المنصة بهدف تهيئة الطالب لـ كامل جوانب اللغة العربية" 
      : "This platform is designed to prepare students in all aspects of the Arabic language");

  // ✅ السوشيال ميديا
  const socials = [
    { icon: Facebook, href: footer.facebook_link },
    { icon: Instagram, href: footer.instagram_link },
    { icon: Youtube, href: footer.youtube_link },
    { icon: MessageCircle, href: footer.whatsapp_link },
  ].filter((x) => x.href);

  // ✅ بيانات القائمة (Info items)
  const infoItems = [
    {
      icon: MapPin,
      label: lang === "ar" ? "الفرع" : "Branch",
      value: footer.branch_name || (lang === "ar" ? "العربية" : "Arabic"),
    },
    {
      icon: BookOpen,
      label: lang === "ar" ? "المراحل الدراسية" : "Stages",
      value: lang === "ar" ? "المراحل الدراسية" : "Stages",
      link: `#stages`,
    },
    {
      icon: Library,
      label: lang === "ar" ? "الكتب" : "Books",
      value: lang === "ar" ? "الكتب" : "Books",
      link: `#books`,
    },
    {
      icon: Star,
      label: lang === "ar" ? "التقييمات" : "Ratings",
      value: lang === "ar" ? "التقييمات" : "Ratings",
    },
    {
      icon: Users,
      label: lang === "ar" ? "العدد" : "Count",
      value: teacher?.website?.students_count || "٦",
    },
  ];

  return (
    <footer className={`${getBgColor()} ${getTextColor()} border-t ${getBorderColor()}`}>
      <div className="container-tight py-12 md:py-16">
        
        {/* الصف العلوي: سوشيال ميديا (يمين) + وصف (شمال) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* يمين - تابعنا */}
          <div className="text-center md:text-right order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {lang === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us on social media"}
            </h2>
            <div className="flex gap-4 justify-center md:justify-end">
              {socials.length > 0 ? (
                socials.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-3 rounded-full border ${getBorderColor()} transition-all hover:scale-110 hover:${isNature ? 'bg-amber-500' : 'bg-primary'} hover:text-white`}
                    >
                      <Icon size={22} />
                    </a>
                  );
                })
              ) : (
                <>
                  <a className={`p-3 rounded-full border ${getBorderColor()} opacity-50`}><Facebook size={22} /></a>
                  <a className={`p-3 rounded-full border ${getBorderColor()} opacity-50`}><Instagram size={22} /></a>
                  <a className={`p-3 rounded-full border ${getBorderColor()} opacity-50`}><Youtube size={22} /></a>
                </>
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

        {/* منتصف - Info Cards */}
  
        {/* ✅ الصور - مع إضافة صورة المعلم */}
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {/* الصور جنب بعض */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* ✅ صورة المعلم (Logo) */}
            {teacherLogo && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                className="relative"
              >
                <img
                  src={teacherLogo}
                  alt={teacher?.name || "Teacher Logo"}
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/30 shadow-lg hover:shadow-primary/20 transition-all duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
              </motion.div>
            )}

            {/* ✧ فاصل */}
            {teacherLogo && (
              <span className={`text-xl font-bold ${getMutedColor()}`}>✧</span>
            )}

            {/* صورة TeacherPlanet */}
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              src={logoImage}
              alt="TeacherPlanet"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-300"
            />
            
            <span className={`text-xl font-bold ${getMutedColor()}`}>✧</span>
            
            {/* صورة Banana Agency */}
            <motion.img
              whileHover={{ scale: 1.05, rotate: -5 }}
              src={bananaImage}
              alt="Banana Agency"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-300"
            />
          </div>
          
          {/* النص تحت الصور */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-center text-sm ${getMutedColor()}`}
          >
            <span>{lang === "ar" ? "تم التطوير بواسطة" : "Developed by"}{" "}</span>
            <span className={`font-bold ${isNature ? 'text-amber-600' : 'text-primary'}`}>TeacherPlanet</span>
            <span> {lang === "ar" ? "و" : "&"} </span>
            <span className={`font-bold ${isNature ? 'text-amber-600' : 'text-primary'}`}>Banana Agency</span>
            {teacher?.name && (
              <>
                <span> {lang === "ar" ? "لـ" : "for"} </span>
                <span className={`font-bold ${isNature ? 'text-amber-600' : 'text-primary'}`}>
                  {pick(teacher.name, teacher.name_ar)}
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* فاصل خفيف قبل حقوق الملكية */}
        <div className={`h-px ${getDividerColor()} my-6`} />

        {/* حقوق الملكية */}
        <div className="text-center pt-2">
          <p className={`text-sm ${getMutedColor()}`}>
            {lang === "ar" ? "جميع الحقوق محفوظة" : "All Copy Rights Reserved"} © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};