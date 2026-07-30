// src/pages/semesters/components/SemesterCard.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShoppingCart, Percent, Clock, Award, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";
import { RedeemModal } from "@/components/RedeemModal";
import OfferTimerDisplay from "@/components/ui/OfferTimer";
import { SemesterCardProps } from "../SemestersPage.types";

export const SemesterCard = ({ 
  semester, 
  index, 
  slug, 
  lang, 
  pick, 
  refetchSemesters, 
  isNature 
}: SemesterCardProps) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  
  const finalPrice = parseFloat(semester?.price) || 0;
  const originalPrice = parseFloat(semester?.original_price) || 0;
  const discountValue = parseFloat(semester?.discount) || 0;
  const hasDiscount = discountValue > 0 && originalPrice > finalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
    
  const coursesCount = semester.courses?.length || 0;
  
  const offerStartDate = semester?.offer_start_date;
  const offerEndDate = semester?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;
  
  const semesterImageUrl = semester.image?.fullUrl || semester.imageUrl;
  const defaultImage = isNature 
    ? "https://images.unsplash.com/photo-1434030216411-0b793f4f4173?w=400&h=200&fit=crop"
    : "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop";
  
  const finalImageUrl = semesterImageUrl || defaultImage;
  
  const handlePaymentSuccess = (data: any) => {
    toast.success(lang === "ar" ? 'تم شراء الترم بنجاح!' : 'Semester purchased successfully!');
    setTimeout(() => refetchSemesters(), 2000);
  };

  const handlePaymentError = (error: any) => {
    toast.error(lang === "ar" ? 'فشل الدفع، حاول مرة أخرى' : 'Payment failed, please try again');
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRedeemModal(true);
  };
  
  return (
    <>
      <div className={`group relative rounded-2xl border transition-all overflow-hidden bg-white dark:bg-gray-900 ${isNature ? 'border-amber-200 dark:border-amber-800' : 'border-gray-200 dark:border-gray-700'} hover:border-${isNature ? 'amber' : 'primary'}/30`}>
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <OptimizedImage
            src={finalImageUrl}
            alt={pick(semester.name, semester.name_ar)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={600}
            height={300}
            priority={index < 2}
            bgColor="#f1f5f9"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full backdrop-blur-md bg-black/50 text-white border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{coursesCount} {lang === "ar" ? "كورسات" : "courses"}</span>
          </div>
          
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
              <Percent className="w-3.5 h-3.5" />
              {discountPercent}% OFF
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className={`text-lg font-bold mb-1 line-clamp-1 ${isNature ? 'text-amber-800 dark:text-amber-200 group-hover:text-amber-600' : 'text-gray-900 dark:text-white group-hover:text-primary'}`}>
            {pick(semester.name, semester.name_ar)}
          </h3>
          
          <div className="mt-2">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-xl font-black ${isNature ? 'text-amber-800 dark:text-amber-400' : 'text-primary'}`}>
                  {finalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">{originalPrice.toFixed(2)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isNature ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                  وفر {((originalPrice - finalPrice)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className={`text-xl font-black ${isNature ? 'text-amber-800 dark:text-amber-400' : 'text-primary'}`}>
                {finalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lang === "ar" ? "تعلّم بوتيرتك" : "Self-paced"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{lang === "ar" ? "شهادة" : "Certificate"}</span>
            </div>
          </div>

          {hasOfferDates && (
            <div className="mt-2">
              <OfferTimerDisplay 
                startDate={offerStartDate} 
                endDate={offerEndDate} 
                lang={lang}
                isDark={false}
                isNature={isNature}
                compact={true}
                showIcon={true}
              />
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={handleBuyClick}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-white font-semibold text-xs shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "شراء" : "Buy"}</span>
              </button>
              
              <Link
                to={`/courses?semester_id=${semester.id}&semester_name=${encodeURIComponent(pick(semester.name, semester.name_ar))}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold text-xs transition-all hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                {lang === "ar" ? "الكورسات" : "Courses"}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        itemId={semester.id}
        itemType="semester"
        price={finalPrice}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};