// components/site/SiteLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TeacherProvider } from "@/context/TeacherContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";

const SiteLayoutContent = () => {
  const { pathname, hash } = useLocation();
  
  console.log("🏠 SiteLayoutContent rendered with pathname:", pathname);

  useEffect(() => {
    console.log("📍 Location changed:", { pathname, hash });
    
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        console.log("📍 Scrolling to element:", hash);
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, hash]);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export const SiteLayout = () => {
  console.log("🎯 SiteLayout rendered - wrapping with TeacherProvider");
  
  return (
    <TeacherProvider>
      <SiteLayoutContent />
    </TeacherProvider>
  );
};