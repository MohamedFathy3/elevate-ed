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
import { useDynamicSeo } from "@/hooks/useDynamicSeo";
import { useTheme } from "@/context/ThemeContext"; // ✅ استيراد useTheme

// المكون الداخلي اللي فيه البوب اب
const SiteLayoutContent = () => {
  const { pathname, hash } = useLocation();
  const { lang } = useLang();

  const { teacher, isLoading } = useSafeTeacher();
  const [showPopup, setShowPopup] = useState(false);
  useDynamicSeo(teacher?.website?.seo); // ✅ تحديث الـ meta tags ديناميكيًا
  
  // ✅ استخدام useTheme عشان نجيب الثيم
  const { theme, colorMode, toggleTheme, toggleColorMode, apiColors } = useTheme();

  // ✅ جلب الثيم من API عند تحميل بيانات المعلم
  useEffect(() => {
    const fetchAndApplyTheme = async () => {
      if (!isLoading && teacher?.id) {
        console.log("🎨 SiteLayout: جلب الثيم للمعلم:", teacher.id);
        
        try {
          // ✅ استخدام الـ API مباشرة
          const response = await api.post('/teachers/theme', { teacher_id: teacher.id });
          console.log("✅ SiteLayout: الرد من API:", response.data);
          
          if (response.data?.status === true) {
            const activeTheme = response.data.active_theme;
            const bgColor = response.data.active_backgroud_color || '#FFFFFF';
            const textColor = response.data.active_font_color || '#111827';
            
            // ✅ تطبيق الثيم
            let themeName: 'default' | 'nature' = 'default';
            if (activeTheme === "theme2") {
              themeName = 'nature';
            }
            
            // ✅ تغيير الثيم
            if (themeName !== theme) {
              toggleTheme();
            }
            
            // ✅ تطبيق الألوان
            applyApiColors(bgColor, textColor);
            
            console.log("🎨 SiteLayout: تم تطبيق الثيم:", themeName, "الألوان:", { bgColor, textColor });
          }
        } catch (error) {
          console.error("❌ SiteLayout: خطأ في جلب الثيم:", error);
        }
      }
    };
    
    fetchAndApplyTheme();
  }, [teacher, isLoading]);

  // Scroll to top on route change
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
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

      if (shouldShow) {
        // Delay popup to let page load first
        const timer = setTimeout(() => {
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
  return (
    <TeacherProvider>
      <SiteLayoutContent />
    </TeacherProvider>
  );
};