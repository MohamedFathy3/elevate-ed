/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/CourseCardFull.tsx

import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, Clock, GraduationCap, BookMarked, 
  ShoppingCart, Loader2, Calendar, Percent 
} from "lucide-react";
import DOMPurify from "dompurify";
import { useTheme } from "@/context/ThemeContext";
import OfferTimerDisplay from "@/components/ui/OfferTimer";

interface CourseCardFullProps {
  course: any;
  slug: string;
  pick: (en: string, ar: string) => string;
  lang: string;
  dir: string;
  isNature: boolean;
  primaryGradient: string;
  isHovered: boolean;
  onBuyClick?: (course: any) => void;
}

export const CourseCardFull = ({
  course,
  pick,
  lang,
  isNature,
  isHovered,
  onBuyClick,
}: CourseCardFullProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const { colorMode } = useTheme();
  const navigate = useNavigate();
  const isDark = colorMode === 'dark';

  if (!course) return null;

  const offerStartDate = course?.offer_start_date;
  const offerEndDate = course?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;

  // ✅ الأسعار من الباك اند مباشرة
  // price = السعر النهائي (بعد الخصم)
  // original_price = السعر الأصلي (قبل الخصم)
  // discount = قيمة الخصم
  const finalPrice = parseFloat(course?.price) || 0;
  const originalPrice = parseFloat(course?.original_price) || 0;
  const discountValue = parseFloat(course?.discount) || 0;
  
  // ✅ التحقق من وجود خصم
  const hasDiscount = discountValue > 0 && originalPrice > finalPrice;

  const getImageUrl = () => {
    if (course?.image?.fullUrl) return course.image.fullUrl;
    if (course?.imageUrl) return course.imageUrl;
    if (course?.image?.previewUrl) {
      if (course.image.previewUrl.startsWith('http')) return course.image.previewUrl;
      return `https://lms.dentin.cloud${course.image.previewUrl}`;
    }
    return '/default-course.jpg';
  };

  const courseImage = getImageUrl();
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  const stageName = pick(course?.stage?.name, course?.stage?.name_ar) || "";
  const subjectName = pick(course?.subject?.name, course?.subject?.name_ar) || "";
  const semesterName = pick(course?.semester?.name, course?.semester?.name_ar) || "";
  const lessonsCount = course?.details?.length || 0;

  // ✅ حساب نسبة الخصم للعرض (اختياري)
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;

  // ألوان ديناميكية
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/40 backdrop-blur-sm' : 'bg-white')
    : (isDark ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white');
    
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-700/50' : 'border-amber-200')
    : (isDark ? 'border-gray-700' : 'border-border');
    
  const cardHoverBorder = isNature 
    ? (isDark ? 'hover:border-amber-500' : 'hover:border-amber-400')
    : (isDark ? 'hover:border-primary/50' : 'hover:border-primary/40');
    
  const titleColor = isNature 
    ? (isDark ? 'text-amber-100' : 'text-amber-800')
    : (isDark ? 'text-gray-100' : '');
    
  const titleHoverColor = isNature 
    ? (isDark ? 'group-hover:text-amber-300' : 'group-hover:text-amber-600')
    : (isDark ? 'group-hover:text-primary' : 'group-hover:text-primary');
    
  const tagBg = isNature 
    ? (isDark ? 'bg-amber-800/50 text-amber-200' : 'bg-amber-100 text-amber-700')
    : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-primary/10 text-primary');
    
  const priceColor = isNature 
    ? (isDark ? 'text-amber-200' : 'text-amber-800')
    : (isDark ? 'text-gray-100' : '');
    
  const buttonBg = isNature 
    ? (isDark ? 'bg-amber-700 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700')
    : 'bg-gradient-to-r from-emerald-500 to-teal-600';
    
  const detailButtonBg = isNature 
    ? (isDark ? 'border-amber-700 bg-amber-900/30 hover:bg-amber-800/50' : 'border-amber-200 bg-white hover:bg-amber-50')
    : (isDark ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5');

  const sanitizeHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i'] }) };
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyClick) {
      onBuyClick(course);
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/courses/${course?.id}`);
  };

  return (
    <motion.div
      className={`group relative rounded-xl border transition-all duration-300 overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl cursor-pointer
        ${cardBg} ${cardBorder} ${cardHoverBorder}`}
      animate={isHovered ? { scale: 1.02, y: -5 } : { scale: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => window.location.href = `/courses/${course?.id}`}
    >
      <div onClick={handleDetailsClick}>
        {/* Shine effect */}
        <motion.div
          className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20 pointer-events-none
            bg-gradient-to-r from-transparent via-${isNature ? 'white' : 'white'}/10 to-transparent`}
        />
        
        {/* Image Section */}
        <div className={`relative h-44 overflow-hidden ${isNature ? '' : 'bg-gradient-to-br from-primary/20 to-accent/20'}`}>
          <motion.img
            src={courseImage}
            alt={courseTitle}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = '/default-course.jpg'; }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* ✅ Discount Badge - يحسب النسبة المئوية للخصم */}
          {hasDiscount && discountPercent > 0 && (
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-3 left-3 z-10"
            >
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold shadow-lg">
                <Percent className="w-3 h-3" />
                <span>{discountPercent}% {lang === "ar" ? "خصم" : "OFF"}</span>
              </div>
            </motion.div>
          )}
          
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium z-10">
            {course?.type === "online" 
              ? (lang === "ar" ? "💻 أونلاين" : "💻 Online")
              : (lang === "ar" ? "🏢 مركز" : "🏢 Center")}
          </div>
          
          {/* ✅ عرض الأسعار */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-black ${priceColor} drop-shadow-md text-white`}>
                  {finalPrice.toFixed(2)} EGP
                </span>
                <span className="text-xs text-white/50 line-through">
                  {originalPrice.toFixed(2)} EGP
                </span>
                <span className="text-xs text-green-400 font-semibold bg-black/40 px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </div>
            ) : (
              <span className={`text-xl font-black ${priceColor} drop-shadow-md text-white`}>
                {finalPrice.toFixed(2)} EGP
              </span>
            )}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {stageName && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagBg}`}
              >
                <GraduationCap className="w-3 h-3" />
                <span className="line-clamp-1 max-w-[80px]">{stageName}</span>
              </motion.span>
            )}
            {subjectName && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagBg}`}>
                <BookMarked className="w-3 h-3" />
                <span className="line-clamp-1 max-w-[80px]">{subjectName}</span>
              </span>
            )}
            {semesterName && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                ${isNature 
                  ? (isDark ? 'bg-amber-800/40 text-amber-300' : 'bg-amber-50 text-amber-600')
                  : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-secondary text-foreground/70')}`}
              >
                <Calendar className="w-3 h-3" />
                <span className="line-clamp-1 max-w-[80px]">{semesterName}</span>
              </span>
            )}
          </div>
          
          {/* Title */}
          <h3 className={`font-bold text-base mb-2 line-clamp-2 min-h-[48px] transition-colors ${titleColor} ${titleHoverColor}`}>
            {courseTitle}
          </h3>
          
          {/* Description */}
          {courseDescription && (
            <div 
              className={`text-xs line-clamp-2 mb-3 ${isNature ? (isDark ? 'text-amber-300/70' : 'text-amber-700/60') : (isDark ? 'text-gray-400' : 'text-foreground/60')}`}
              dangerouslySetInnerHTML={sanitizeHTML(courseDescription)}
            />
          )}
          
          {/* Stats */}
          <div className={`flex flex-wrap gap-3 mb-3 text-xs ${isNature ? (isDark ? 'text-amber-400/60' : 'text-amber-600/60') : (isDark ? 'text-gray-400' : 'text-foreground/50')}`}>
            {lessonsCount > 0 && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{lessonsCount} {lang === "ar" ? "دروس" : "lessons"}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lang === "ar" ? "مرن" : "Flexible"}</span>
            </div>
          </div>

          {/* Timer */}
          {hasOfferDates && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-3"
            >
              <OfferTimerDisplay 
                startDate={offerStartDate} 
                endDate={offerEndDate} 
                lang={lang}
                isDark={isDark}
                isNature={isNature}
                compact={true}
                showIcon={true}
              />
            </motion.div>
          )}
          
          {/* Buttons */}
          <div className="mt-auto pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyClick}
                disabled={isBuying}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50
                  ${buttonBg} text-white`}
              >
                {isBuying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                <span>{lang === "ar" ? "شراء" : "Buy"}</span>
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={`/courses/${course?.id}`}
                  className={`px-3 py-2 rounded-xl border font-semibold text-sm transition-all
                    ${detailButtonBg} ${isNature ? (isDark ? 'text-amber-200' : 'text-amber-700') : (isDark ? 'text-gray-200' : 'text-foreground')}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {lang === "ar" ? "تفاصيل" : "Details"}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCardFull;