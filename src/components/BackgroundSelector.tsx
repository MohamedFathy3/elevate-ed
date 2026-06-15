/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/BackgroundSelector.tsx

import { useTheme } from "@/context/ThemeContext";
import { PlanetsBackground } from "@/components/PlanetsBackground";
import { EducationBackground } from "@/components/EducationBackground";

export const BackgroundSelector = () => {
  const { theme } = useTheme();
  
  if (theme === 'nature') {
    return <EducationBackground />;
  }
  
  return <PlanetsBackground />;
};