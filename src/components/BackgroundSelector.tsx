import { lazy, Suspense, useState, useEffect, memo } from "react";
import { useTheme } from "@/context/ThemeContext";

// استخدم lazy عشان متتحملش غير لما تحتاجها
const EducationBackground = lazy(() => 
  import("@/components/EducationBackground").then(module => ({
    default: module.EducationBackground
  }))
);

export const BackgroundSelector = memo(() => {
  const { theme } = useTheme();
  const [showBackground, setShowBackground] = useState(false);

  // ✅ تأخير تحميل الخلفية حتى بعد تحميل الصفحة
  useEffect(() => {
    // استنى 3 ثواني بعد تحميل الصفحة
    const timer = setTimeout(() => {
      setShowBackground(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // لو الثيم مش nature أو لسه بدري، متظهرش حاجة
  if (theme !== 'nature' || !showBackground) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <EducationBackground />
    </Suspense>
  );
});
BackgroundSelector.displayName = 'BackgroundSelector';