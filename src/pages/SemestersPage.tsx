/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SemestersPage.tsx
import { useSearchParams, useParams, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useSemesters } from "@/hooks/useSemesters";
import { useTeacher } from "@/context/TeacherContext";
import { useBuyCourse } from "@/hooks/useEnroll";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, DollarSign, Clock, Star, ArrowLeft, ArrowRight, ShoppingCart, Loader2, Percent } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const SemestersPage = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher } = useTeacher();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subject_id');
  const subjectName = searchParams.get('subject_name');
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const { data: semesters, isLoading, refetch } = useSemesters(
    teacher?.id,
    subjectId ? parseInt(subjectId) : undefined
  );

  if (isLoading) {
    return <SemestersSkeleton />;
  }

  return (
    <div className="container-tight py-32">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap">
          <Link to={`/${slug}`} className="hover:text-primary transition-colors">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/${slug}/subjects`} className="hover:text-primary transition-colors">
            {lang === "ar" ? "المواد" : "Subjects"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{subjectName || (lang === "ar" ? "الترمات" : "Semesters")}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black">
          {subjectName || (lang === "ar" ? "الترمات الدراسية" : "Semesters")}
        </h1>
        <p className="text-foreground/60 mt-2">
          {lang === "ar" ? "اختر الترم المناسب لك لاستعراض الكورسات أو شراء الترم كاملاً" : "Choose the right semester to view courses or buy the full semester"}
        </p>
      </div>

      {!semesters || semesters.length === 0 ? (
        <EmptyState slug={slug!} lang={lang} Arrow={Arrow} />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {semesters.map((semester, i) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              index={i}
              slug={slug!}
              lang={lang}
              pick={(en, ar) => (lang === "ar" ? ar || en : en || ar)}
              refetchSemesters={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 🟢 Semester Card Component with Buy Button
const SemesterCard = ({ semester, index, slug, lang, pick, refetchSemesters }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buySemester } = useBuyCourse();
  
  const originalPrice = parseFloat(semester.price) || 0;
  const discountPercent = parseFloat(semester.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  const coursesCount = semester.courses?.length || 0;
  
  // معالجة شراء الترم
  const handleBuySemester = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBuying) return;
    
    setIsBuying(true);
    try {
      await buySemester(semester.id, finalPrice);
      // إعادة تحميل البيانات بعد الشراء
      setTimeout(() => {
        refetchSemesters();
      }, 2000);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsBuying(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-card rounded-2xl border border-border hover:border-primary/30 transition-all overflow-hidden"
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          <Percent className="w-3 h-3" />
          {discountPercent}% OFF
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          {coursesCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-foreground/50 bg-secondary px-2 py-1 rounded-full">
              <BookOpen className="w-3 h-3" />
              <span>{coursesCount} {lang === "ar" ? "كورسات" : "courses"}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {pick(semester.name, semester.name_ar)}
        </h3>
        
        {/* Description if available */}
        {semester.description && (
          <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
            {pick(semester.description, semester.description_ar)}
          </p>
        )}

        {/* Price */}
        <div className="mt-4">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-black text-primary">
                {finalPrice.toFixed(2)} EGP
              </span>
              <span className="text-sm text-foreground/40 line-through">
                {originalPrice.toFixed(2)} EGP
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                وفر {((originalPrice - finalPrice)).toFixed(2)} EGP
              </span>
            </div>
          ) : (
            <span className="text-2xl font-black text-primary">
              {originalPrice.toFixed(2)} EGP
            </span>
          )}
        </div>

        {/* Features */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground/60">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{lang === "ar" ? "تعلّم بوتيرتك" : "Self-paced"}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{lang === "ar" ? "أفضل سعر" : "Best price"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex gap-3">
            {/* Buy Semester Button */}
            <button
              onClick={handleBuySemester}
              disabled={isBuying}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span>{lang === "ar" ? "شراء الترم" : "Buy Semester"}</span>
            </button>
            
            {/* View Courses Button */}
            <Link
              to={`/${slug}/courses?semester_id=${semester.id}&semester_name=${encodeURIComponent(pick(semester.name, semester.name_ar))}&subject_name=${encodeURIComponent(semester.subject_name || '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {lang === "ar" ? "عرض الكورسات" : "View Courses"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 🟢 Empty State Component
const EmptyState = ({ slug, lang, Arrow }: any) => {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
        <BookOpen className="w-12 h-12 text-foreground/30" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {lang === "ar" ? "لا توجد ترمات" : "No semesters found"}
      </h3>
      <p className="text-foreground/60">
        {lang === "ar" ? "لا توجد ترمات متاحة لهذه المادة حالياً" : "No semesters available for this subject yet"}
      </p>
      <Link
        to={`/${slug}/subjects`}
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
      >
        <Arrow className="w-4 h-4" />
        {lang === "ar" ? "العودة للمواد" : "Back to Subjects"}
      </Link>
    </div>
  );
};

// 🟢 Skeleton Component
const SemestersSkeleton = () => {
  const { lang } = useLang();
  
  return (
    <div className="container-tight py-32">
      <div className="mb-8">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-4 w-72 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-4" />
            <div className="flex gap-4 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};