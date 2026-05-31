// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { PlanetsBackground } from "@/components/PlanetsBackground";
import { SiteLayout } from "@/components/SiteLayout";
import { StudentAuthProvider } from "@/context/StudentAuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const DynamicRoutes = () => {
  const { pages, isLoading } = useTheme();
  
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
  } = pages;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Landing صفحة */}
        <Route path="/" element={<Landing />} />
        
        <Route path="/:slug" element={<SiteLayout />}>
          <Route index element={<TeacherHome />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="stages" element={<StagesPage />} />
          <Route path="semesters" element={<SemestersPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="exam/:examId" element={<ExamPage />} />
          <Route path="/:slug/exam/:examId/lesson/:lessonId" element={<ExamPage />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="semester/:semesterId" element={<SemesterDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
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
                <PlanetsBackground />
                <DynamicRoutes />
              </StudentAuthProvider>
            </LanguageProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;