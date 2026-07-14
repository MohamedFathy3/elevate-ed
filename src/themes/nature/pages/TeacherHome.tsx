// src/themes/nature/pages/Landing.tsx (أو TeacherHome.tsx)
import { useState, lazy, Suspense } from "react";
import { useTeacher } from "@/context/TeacherContext";
import { useLang } from "@/i18n/LanguageContext";
import { OfferPopup } from "@/themes/default/components/site/OfferPopup";

// ✅ استيراد Hero (Default Export)
import Hero from "@/themes/nature/components/Hero";

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

// ✅ Skeleton للـ Lazy Components
const SectionSkeleton = () => (
  <div className="py-16 px-4">
    <div className="container mx-auto">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// ✅ الـ TeacherHome الرئيسي
const TeacherHome = () => {
  const { isLoading, teacher } = useTeacher();
  const { lang } = useLang();
  const [showPopup, setShowPopup] = useState(true);

  // ✅ لو لسه بيحمل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {showPopup && (
          <OfferPopup 
            lang={lang} 
            onClose={() => setShowPopup(false)} 
          />
        )}
        
        <Hero />
        
        {/* ✅ Lazy Loading مع Suspense */}
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