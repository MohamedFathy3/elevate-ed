// src/themes/default/pages/TeacherHome.tsx
import { useState, lazy, Suspense } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { OfferPopup } from "@/themes/default/components/site/OfferPopup";

// ✅ Hero (مباشر)
import {Hero} from "@/themes/default/components/site/Hero";

// ✅ Lazy Loading
const Stage = lazy(() => import("@/themes/default/components/site/Stage").then(m => ({ default: m.Stage })));
const Future = lazy(() => import("@/themes/default/components/site/Future").then(m => ({ default: m.Future })));
const Courses = lazy(() => import("@/themes/default/components/site/coursess").then(m => ({ default: m.Courses })));
const SocialCounters = lazy(() => import("@/themes/default/components/site/SocialCounters").then(m => ({ default: m.SocialCounters })));
const CenterHours = lazy(() => import("@/themes/default/components/site/CenterHours").then(m => ({ default: m.CenterHours })));
const Books = lazy(() => import("@/themes/default/components/site/Books").then(m => ({ default: m.Books })));
const About = lazy(() => import("@/themes/default/components/site/About").then(m => ({ default: m.About })));

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

const TeacherHome = () => {
  const { lang } = useLang();
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {showPopup && <OfferPopup lang={lang} onClose={() => setShowPopup(false)} />}
      <Hero />
      <Suspense fallback={<SectionSkeleton />}><Stage /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Future /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Courses limit={4} /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><SocialCounters /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><CenterHours /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Books /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><About /></Suspense>
    </>
  );
};

export default TeacherHome;