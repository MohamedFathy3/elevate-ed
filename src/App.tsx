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
import { Loading } from "@/components/LoadingBook";
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

// ✅ LoadingSpinner without useLang - uses props instead
const LoadingSpinner = ({ lang = 'ar' }: { lang?: string }) => {
  return (
    <Loading 
      lang={lang}
      message={{
        ar: '..',
        en: ' ...'
      }}
    />
  );
};

// ✅ ThemeLoading without useLang
const ThemeLoading = ({ lang = 'ar' }: { lang?: string }) => {
  return (
    <Loading 
      lang={lang}
      message={{
        ar: '..',
        en: '...'
      }}
    />
  );
};

// const SeoManager = () => {
//   const { teacher } = useTeacher();
//   const seo = teacher?.website?.seo;
//   const home = teacher?.website?.home;
  
//   const title = seo?.seo_title || seo?.site_title || seo?.og_title || home?.title || teacher?.name || '';
//   const description = seo?.seo_description || seo?.og_description || home?.description || '';
//   const image = seo?.og_image || home?.image?.fullUrl || home?.imageUrl || seo?.favicon || '';
//   const siteName = seo?.og_site_name || seo?.site_name || teacher?.name || '';
//   const keywords = seo?.seo_keywords || seo?.site_keywords || '';
//   const twitterCard = seo?.twitter_card || 'summary_large_image';
//   const favicon = seo?.favicon || '';
//   const googleSiteVerification = seo?.google_site_verification || '';

//   return (
//     <SEO
//       title={title}
//       description={description}
//       image={image}
//       siteName={siteName}
//       keywords={keywords}
//       twitterCard={twitterCard}
//       favicon={favicon}
//       googleSiteVerification={googleSiteVerification}
//     />
//   );
// };

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

  // Get language from localStorage or default to 'ar'
  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'ar';

  if (isLoading || !pages) {
    return ;
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
        {/* <SeoManager /> */}
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

// ✅ AppContent - wrapped with LanguageProvider
const AppContent = () => {
  const { isLoading, pages } = useTheme();
  
  // Get language from localStorage
  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'ar';
  
  // ✅ Show loading while theme is initializing
  if (isLoading || !pages) {
    return ;
  }
  
  return (
    <BrowserRouter>
      <StudentAuthProvider>
        <BackgroundSelector />
        <SubdomainRoutes />
      </StudentAuthProvider>
    </BrowserRouter>
  );
};

// ✅ Main App - LanguageProvider is now at the top level
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;