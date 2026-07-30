// src/pages/semesters/components/DirectCourseCard.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShoppingCart, Percent } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";
import { RedeemModal } from "@/components/RedeemModal";
import { DirectCourseCardProps } from "../SemestersPage.types";

export const DirectCourseCard = ({ 
  course, 
  index, 
  slug, 
  lang, 
  pick, 
  isNature 
}: DirectCourseCardProps) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  
  const finalPrice = parseFloat(course?.price) || 0;
  const originalPrice = parseFloat(course?.original_price) || 0;
  const discountValue = parseFloat(course?.discount) || 0;
  const hasDiscount = discountValue > 0 && originalPrice > finalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
  
  const courseTitle = pick(course.title, course.title_ar) || "Course";
  const courseImage = course.image?.fullUrl || course.imageUrl || "/default-course.jpg";
  const lessonsCount = course.details?.length || 0;
  
  const textPrimary = isNature ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
  
  const handlePaymentSuccess = (data: any) => {
    toast.success(lang === "ar" ? 'تم الدفع بنجاح!' : 'Payment successful!');
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
      <div className={`group rounded-2xl border transition-all overflow-hidden bg-white dark:bg-gray-900 ${isNature ? 'border-amber-200 dark:border-amber-800' : 'border-gray-200 dark:border-gray-700'} hover:border-${isNature ? 'amber' : 'primary'}/30`}>
        <Link to={`/courses/${course.id}`}>
          <div className="relative h-32 overflow-hidden bg-gray-200 dark:bg-gray-700">
            <OptimizedImage
              src={courseImage}
              alt={courseTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={300}
              height={160}
              priority={index < 3}
              quality={55}
              bgColor="#f1f5f9"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px]">
              {course.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
            </div>
            
            {hasDiscount && (
              <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold">
                <Percent className="w-2.5 h-2.5" />
                {discountPercent}%
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h3 className={`font-bold text-sm line-clamp-1 mb-1 text-gray-900 dark:text-white group-hover:${textPrimary}`}>
              {courseTitle}
            </h3>
            
            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
              {pick(course.description, course.description_ar)?.replace(/<[^>]*>/g, '').substring(0, 40)}
            </p>
            
            <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 mb-2">
              <span className="flex items-center gap-0.5">
                <BookOpen className="w-3 h-3" />
                {lessonsCount}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-base font-bold ${textPrimary}`}>
                      {finalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">{originalPrice.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className={`text-base font-bold ${textPrimary}`}>
                    {finalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleBuyClick}
                className={`px-2.5 py-1 rounded-lg text-white text-[10px] font-semibold flex items-center gap-0.5
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}
              >
                <ShoppingCart className="w-3 h-3" />
                {lang === "ar" ? "شراء" : "Buy"}
              </button>
            </div>
          </div>
        </Link>
      </div>

      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        itemId={course.id}
        itemType="course"
        price={finalPrice}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};