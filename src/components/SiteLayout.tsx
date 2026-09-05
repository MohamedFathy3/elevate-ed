// components/site/SiteLayout.tsx

import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { TeacherProvider, useSafeTeacher, useTeacher } from "@/context/TeacherContext";
import { Navbar } from "./Navbar";
import { ScrollProgress } from "@/themes/default/components/site/ScrollProgress";
import { Footer } from "@/themes/default/components/site/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { OfferPopup } from "@/themes/default/components/site/OfferPopup";
import { FloatingOfferButton } from "@/themes/default/components/site/FloatingOfferButton";
import { useLang } from "@/i18n/LanguageContext";



// المكون الداخلي اللي فيه البوب اب
const SiteLayoutContent = () => {
  const { pathname, hash } = useLocation();
  const { lang } = useLang();

  const { teacher, isLoading } = useSafeTeacher();
  const [showPopup, setShowPopup] = useState(false);

  console.log("🏠 SiteLayoutContent rendered with pathname:", pathname);
  console.log("🎁 Teacher data:", teacher?.id);
  console.log("🎁 Is loading:", isLoading);

  // Scroll to top on route change
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

  // ✅ Show popup after teacher data is loaded
  useEffect(() => {
    if (!isLoading && teacher?.id) {
      const STORAGE_KEY = `offer_popup_shown_${teacher.id}`;
      const POPUP_DURATION = 1000 * 60 * 60 * 24; // 24 hours
      const lastShown = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();

      const shouldShow = !lastShown || (now - parseInt(lastShown) >= POPUP_DURATION);

      console.log("🎁 Should show popup?", { shouldShow, lastShown, teacherId: teacher.id });

      if (shouldShow) {
        // Delay popup to let page load first
        const timer = setTimeout(() => {
          console.log("🎁 Showing popup!");
          setShowPopup(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [teacher, isLoading]);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
        <WhatsAppButton position="bottom-left" />
      </main>
      <Footer />

      {/* ✅ Floating button for offers */}
      <FloatingOfferButton />


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