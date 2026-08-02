/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/site/courses/DefaultCourseCard.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Loader2, Percent, GraduationCap, 
  BookMarked, Calendar, ArrowRight 
} from "lucide-react";
import { useBuyCourse } from "@/hooks/useEnroll";
import { RedeemModal } from "@/components/RedeemModal";
import OfferTimerDisplay from "@/components/ui/OfferTimer";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_ICONS, LIGHT_COLORS, DARK_COLORS, getCoursePrice, getCourseType } from "./utils";
import type { CourseCardProps } from "./types";

export const DefaultCourseCard = ({ 
  course, 
  index, 
  slug, 
  pick, 
  lang, 
  Arrow, 
  isDark 
}: CourseCardProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const navigate = useNavigate();
  const { buyCourse } = useBuyCourse();

  if (!course) return null;

  const Icon = DEFAULT_ICONS[(index || 0) % DEFAULT_ICONS.length];
  const lightColor = LIGHT_COLORS[(index || 0) % LIGHT_COLORS.length];
  const darkColor = DARK_COLORS[(index || 0) % DARK_COLORS.length];
  const gradientColor = isDark ? darkColor : lightColor;

  const { originalPrice, discountPercent, finalPrice, hasDiscount } = getCoursePrice(course);
  const type = getCourseType(course, lang);

  const offerStartDate = course?.offer_start_date;
  const offerEndDate = course?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;

  const courseImage = course?.image?.fullUrl || course?.imageUrl || null;
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  const stageName = pick(course?.stage?.name, course?.stage?.name_ar) || "";
  const subjectName = pick(course?.subject?.name, course?.subject?.name_ar) || "";
  const semesterName = pick(course?.semester?.name, course?.semester?.name_ar) || "";

  const handleCardClick = () => navigate(`/courses/${course?.id}`);
  
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRedeemModal(true);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/courses/${course?.id}`);
  };

  const handlePaymentSuccess = (data: any) => {
    console.log('✅ Payment success:', data);
    toast.success('تم الدفع بنجاح!');
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    toast.error('فشل الدفع، حاول مرة أخرى');
  };

  return (
    <div className="flex flex-col h-full">
      <div
        onClick={handleCardClick}
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700 cursor-pointer"
      >
        <div onClick={handleDetailsClick}>
          {/* Header */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {courseImage ? (
              <>
                <img
                  src={courseImage}
                  alt={courseTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-16 h-16 text-white/20" strokeWidth={1} />
              </div>
            )}

            {hasDiscount && (
              <div className="absolute top-3 left-3 z-10">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold shadow-lg">
                  <Percent className="w-3 h-3" />
                  <span>{discountPercent}% OFF</span>
                </div>
              </div>
            )}

            <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              {type}
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {stageName && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs">
                  <GraduationCap className="w-3 h-3" />
                  <span className="line-clamp-1 max-w-[80px]">{stageName}</span>
                </span>
              )}
              {subjectName && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-xs">
                  <BookMarked className="w-3 h-3" />
                  <span className="line-clamp-1 max-w-[80px]">{subjectName}</span>
                </span>
              )}
              {semesterName && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span className="line-clamp-1 max-w-[80px]">{semesterName}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[48px] text-gray-900 dark:text-white">
              {courseTitle}
            </h3>

            {/* Description */}
            {courseDescription && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[32px]">
                {courseDescription.replace(/<[^>]*>/g, '')}
              </p>
            )}
            
            {/* Timer */}
            {hasDiscount && hasOfferDates && (
              <div className="mb-3 px-0.5">
                <OfferTimerDisplay
                  startDate={offerStartDate}
                  endDate={offerEndDate}
                  lang={lang}
                  isDark={isDark}
                  compact={true}
                  variant="red"
                  className="w-full justify-center text-[11px] font-medium"
                />
              </div>
            )}
            
            {/* Price and Buttons */}
            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2">
                <div>
                  {hasDiscount ? (
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">{finalPrice.toFixed(2)} EGP</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 line-through">{originalPrice.toFixed(2)} EGP</span>
                    </div>
                  ) : (
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">{originalPrice.toFixed(2)} EGP</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleBuyClick}
                    disabled={isBuying}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {isBuying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    <span>{lang === "ar" ? "شراء" : "Buy"}</span>
                  </button>

                  <button
                    onClick={handleDetailsClick}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>{lang === "ar" ? "تفاصيل" : "Details"}</span>
                    <Arrow className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        itemId={course?.id}
        itemType="course"
        price={finalPrice}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};