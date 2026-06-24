// src/App.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { SiteLayout } from "@/components/SiteLayout";
import { StudentAuthProvider } from "@/context/StudentAuthContext";
import { LoadingBook } from "@/components/LoadingBook";
import { useLang } from "@/i18n/LanguageContext";
import { TeacherProvider } from "@/context/TeacherContext";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingSpinner = () => {
  const { lang } = useLang();
  return (
    <LoadingBook 
      lang={lang}
      message={{
        ar: 'جاري تحميل المنصة...',
        en: 'Loading platform...'
      }}
    />
  );
};

// ✅ كوبوننت جديد للتعامل مع Subdomains
const SubdomainRoutes = () => {
  const { pages, isLoading } = useTheme();
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [subdomain, setSubdomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const parts = host.split('.');
      
      // لو فيه أكتر من جزئين (يعني subdomain)
      if (parts.length > 2) {
        setIsSubdomain(true);
        setSubdomain(parts[0]);
        console.log("🔹 Subdomain detected:", parts[0]);
      } else {
        setIsSubdomain(false);
        console.log("🔹 Main domain detected");
      }
    }
  }, []);

  if (isLoading || !pages) {
    return <LoadingSpinner />;
  }

  const {
    TeacherHome,
    Landing,
    CoursesPage,
    CourseDetail,
    SubjectsPage,
    SemestersPage,
    StagesPage,
    StudentDashboard,
    ExamPage,
    LessonPage,
    SemesterDetails,
    Login,
    Register,
    NotFound,
    CenterHours,
  } = pages;

  // ✅ لو Subdomain اعرض الـ Teacher Routes
  if (isSubdomain) {
    return (
      <TeacherProvider>
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<TeacherHome />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="stages" element={<StagesPage />} />
            <Route path="semesters" element={<SemestersPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetail />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="exam/:examId" element={<ExamPage />} />
            <Route path="exam/:examId/lesson/:lessonId" element={<ExamPage />} />
            <Route path="lesson/:lessonId" element={<LessonPage />} />
            <Route path="semester/:semesterId" element={<SemesterDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="center-hours" element={<CenterHours />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TeacherProvider>
    );
  }

  // ✅ لو الموقع الرئيسي اعرض الـ Landing
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <BrowserRouter>
            <LanguageProvider>
              <StudentAuthProvider>
                <BackgroundSelector />
                <SubdomainRoutes />
              </StudentAuthProvider>
            </LanguageProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;