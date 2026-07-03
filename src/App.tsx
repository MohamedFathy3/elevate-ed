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
import { TeacherProvider, useTeacher } from "@/context/TeacherContext";
import { SEO } from "@/components/SEO";
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
const SeoManager = () => {
  const { teacher } = useTeacher();
  const seo = teacher?.website?.seo;
  const home = teacher?.website?.home;
  
  const title = seo?.seo_title || seo?.site_title || seo?.og_title || home?.title || teacher?.name || '';
  const description = seo?.seo_description || seo?.og_description || home?.description || '';
  const image = seo?.og_image || home?.image?.fullUrl || home?.imageUrl || seo?.favicon || '';
  const siteName = seo?.og_site_name || seo?.site_name || teacher?.name || '';
  const keywords = seo?.seo_keywords || seo?.site_keywords || '';
  const twitterCard = seo?.twitter_card || 'summary_large_image';
  const favicon = seo?.favicon || '';

  return (
    <SEO
      title={title}
      description={description}
      image={image}
      siteName={siteName}
      keywords={keywords}
      twitterCard={twitterCard}
      favicon={favicon}
    />
  );
};

const SubdomainRoutes = () => {
  const { pages, isLoading } = useTheme();
  const location = useLocation();
  
  const { isSubdomain } = useMemo(() => {
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

  if (isLoading || !pages) {
    return <LoadingSpinner />;
  }

  const {
    TeacherHome,
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

  if (isSubdomain) {
    return (
      <TeacherProvider>
        <SeoManager />
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