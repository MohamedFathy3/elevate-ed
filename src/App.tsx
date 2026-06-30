// src/App.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import { useEffect, useState, useMemo } from "react";

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

const SubdomainRoutes = () => {
  const { pages, isLoading } = useTheme();
  const location = useLocation();
  
  const { isSubdomain, subdomain } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { isSubdomain: false, subdomain: '' };
    }
    
    const host = window.location.hostname;
    const parts = host.split('.');
    
    if (parts.length > 2) {
      return { isSubdomain: true, subdomain: parts[0] };
    }
    
    return { isSubdomain: false, subdomain: '' };
  }, [location.pathname]);

  // ✅ Log للـ debugging
  useEffect(() => {
    console.log("🔹 Host:", window.location.hostname);
    console.log("🔹 Is Subdomain:", isSubdomain);
    console.log("🔹 Subdomain:", subdomain);
    console.log("🔹 Path:", location.pathname);
  }, [isSubdomain, subdomain, location.pathname]);

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

  // ✅ الموقع الرئيسي (web-lec.com)
  return (
    
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