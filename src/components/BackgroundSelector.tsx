// BackgroundSelector.tsx - النسخة المحسنة
import { lazy, Suspense } from "react";
import { useTheme } from "@/context/ThemeContext";
import { BackgroundFallback } from "./BackgroundFallback";

// استخدم lazy عشان متتحملش غير لما تحتاجها
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

export const BackgroundSelector = () => {
  const { theme } = useTheme();
  
  return (
    <Suspense fallback={<BackgroundFallback />}>
      {theme === 'nature' ? (
        <EducationBackground />
      ) : (
        <PlanetsBackground />
      )}
    </Suspense>
  );
};