import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { PlanetsBackground } from "@/components/site/PlanetsBackground";
import { SiteLayout } from "@/components/site/SiteLayout";
import Landing from "./pages/Landing";
import TeacherHome from "./pages/TeacherHome";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <LanguageProvider>
            <PlanetsBackground />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/:slug" element={<SiteLayout />}>
                <Route index element={<TeacherHome />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:courseId" element={<CourseDetail />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
