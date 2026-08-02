import { lazy, Suspense, useState, useEffect, memo } from "react";
import { useTheme } from "@/context/ThemeContext";

// ✅ استخدم lazy عشان متتحملش غير لما تحتاجها
const EducationBackground = lazy(() => 
  import("@/components/EducationBackground").then(module => ({
    default: module.EducationBackground
  }))
);

const PlanetsBackground = lazy(() => 
  import("@/components/PlanetsBackground").then(module => ({
    default: module.PlanetsBackground
  }))
);

export const BackgroundSelector = memo(() => {
  const { theme } = useTheme();
  const [showBackground, setShowBackground] = useState(false);

  // ✅ تأخير تحميل الخلفية حتى بعد تحميل الصفحة
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackground(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ لو لسه بدري، متظهرش حاجة (صفحة بيضاء)
  if (!showBackground) {
    return null;
  }

  // ✅ لو theme === 'nature' → EducationBackground
  if (theme === 'nature') {
    return (
      <Suspense fallback={null}>
        <EducationBackground />
      </Suspense>
    );
  }

  // ✅ لو theme !== 'nature' → PlanetsBackground
  return (
    <Suspense fallback={null}>
      <PlanetsBackground />
    </Suspense>
  );
});

BackgroundSelector.displayName = 'BackgroundSelector';