import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TeacherProvider } from "@/context/TeacherContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";

export const SiteLayout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, hash]);

  return (
    <TeacherProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </TeacherProvider>
  );
};
