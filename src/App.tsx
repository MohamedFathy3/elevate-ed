import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSsrPayload, type SsrPayload } from "@/ssr";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { SiteLayout } from "@/components/SiteLayout";
import { StudentAuthProvider } from "@/context/StudentAuthContext";
import { TeacherProvider } from "@/context/TeacherContext";
import { useEffect, useState, useMemo, useRef, Suspense, lazy } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ✅ شاشة التحميل
const AppLoader = ({ lang = 'ar' }: { lang?: string }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[99999]">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Skeleton للصفحات
const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-gray-500">جاري التحميل...</p>
    </div>
  </div>
);

// ✅ SubdomainRoutes مع Suspense
const SubdomainRoutes = ({ initialPayload }: { initialPayload?: SsrPayload }) => {
  const { pages, isLoading, isThemeReady } = useTheme();
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

  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'ar';

  if (isLoading || !pages || !isThemeReady) {
    return <AppLoader lang={lang} />;
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
      <Suspense fallback={<PageSkeleton />}>
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
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
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
    </Suspense>
  );
};

// ✅ AppContent
const AppContent = ({ ssrLocation, initialPayload }: { ssrLocation?: string; initialPayload?: SsrPayload }) => {
  const { isLoading, pages, isThemeReady } = useTheme();
  const [showLoader, setShowLoader] = useState(() => !(initialPayload || getSsrPayload()));
  const loaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'ar';
  
  useEffect(() => {
    if (!isLoading && pages && isThemeReady) {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
      
      loaderTimeoutRef.current = setTimeout(() => {
        setShowLoader(false);
        const loader = document.getElementById('app-loader');
        if (loader) {
          loader.classList.add('hidden');
          setTimeout(() => {
            loader.remove();
          }, 600);
        }
      }, 300);
    }
    
    return () => {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
    };
  }, [isLoading, pages, isThemeReady]);

  if (showLoader || isLoading || !pages || !isThemeReady) {
    return <AppLoader lang={lang} />;
  }
  
  const routedContent = (
    <StudentAuthProvider>
      <TeacherProvider initialPayload={initialPayload}>
        <BackgroundSelector />
        <SubdomainRoutes initialPayload={initialPayload} />
      </TeacherProvider>
    </StudentAuthProvider>
  );
  const isServer = typeof window === "undefined";
  return isServer && ssrLocation
    ? <MemoryRouter initialEntries={[ssrLocation]}>{routedContent}</MemoryRouter>
    : <BrowserRouter>{routedContent}</BrowserRouter>;
};

// ✅ Main App
const App = ({ ssrLocation, initialPayload }: { ssrLocation?: string; initialPayload?: SsrPayload } = {}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <ThemeProvider initialPayload={initialPayload}>
            <AppContent ssrLocation={ssrLocation} initialPayload={initialPayload} />
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;