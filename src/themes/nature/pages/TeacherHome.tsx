// src/themes/nature/pages/Landing.tsx (أو TeacherHome.tsx)

import { useState, lazy, Suspense, useEffect } from "react";
import { useTeacher } from "@/context/TeacherContext";
import { useLang } from "@/i18n/LanguageContext";
import { OfferPopup } from "@/themes/default/components/site/OfferPopup";

// ✅ استيراد Hero (Default Export)
import Hero from "@/themes/nature/components/Hero";
import SocialCounters from "@/themes/default/components/site/SocialCounters";

// ✅ Wrapper لتحويل Named Export لـ Default
const About = lazy(() => 
  import("@/themes/default/components/site/About").then(module => ({
    default: module.About
  }))
);

const Books = lazy(() => 
  import("@/themes/default/components/site/Books").then(module => ({
    default: module.Books
  }))
);

const Stage = lazy(() => 
  import("@/themes/default/components/site/Stage").then(module => ({
    default: module.Stage
  }))
);

const Courses = lazy(() => 
  import("@/themes/default/components/site/Courses").then(module => ({
    default: module.Courses
  }))
);

const CenterHours = lazy(() => 
  import("@/themes/default/components/site/CenterHours").then(module => ({
    default: module.CenterHours
  }))
);

// ✅ Skeleton خفيف جداً - بدون animate-pulse ثقيل
const SectionSkeleton = () => (
  <div className="py-12 px-4">
    <div className="container mx-auto">
      <div className="h-6 w-32 bg-gray-200/60 dark:bg-gray-800/60 rounded mx-auto mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-200/60 dark:bg-gray-800/60 rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

// ✅ Skeleton للـ Hero (يظهر أثناء تحميل البيانات)
const HeroSkeleton = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-gray-100/50 dark:bg-gray-900/50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
    </div>
  </div>
);

// ✅ الـ TeacherHome الرئيسي
const TeacherHome = () => {
  const { isLoading, teacher } = useTeacher();
  const { lang } = useLang();
  const [showPopup, setShowPopup] = useState(true);
  const [isHeroReady, setIsHeroReady] = useState(false);

  // ✅ بعد تحميل البيانات، نعتبر Hero جاهز
  useEffect(() => {
    if (!isLoading) {
      setIsHeroReady(true);
    }
  }, [isLoading]);

  // ✅ أثناء التحميل - Skeleton خفيف
  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* ✅ Popup يظهر بعد 3 ثواني (مش فوري) */}
        {showPopup && (
          <OfferPopup 
            lang={lang} 
            onClose={() => setShowPopup(false)} 
          />
        )}
        
        {/* ✅ Hero يظهر فوراً */}
        <Hero />
        
        {/* ✅ باقي الأقسام مع Lazy Loading */}
        <Suspense fallback={<SectionSkeleton />}>
          <Stage />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Courses />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <CenterHours />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <SocialCounters />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <Books />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
      </main>
    </div>
  );
};

export default TeacherHome;