// src/themes/default/pages/TeacherHome.tsx

import { Hero } from "@/themes/default/components/site/Hero";
import { Stage } from "@/themes/default/components/site/Stage";
import { Future } from "@/themes/default/components/site/Future";
import { Courses } from "@/themes/default/components/site/Courses";
import { Books } from "@/themes/default/components/site/Books";
import { About } from "@/themes/default/components/site/About";
import { CenterHours } from "@/themes/default/components/site/CenterHours";
import { OfferPopup } from "@/themes/default/components/site/OfferPopup";
import { useLang } from "@/i18n/LanguageContext";
import { useState } from "react";

const TeacherHome = () => {
  const { lang } = useLang();
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {/* Popup العروض - يظهر تلقائياً عند فتح الصفحة */}
      {showPopup && (
        <OfferPopup 
          lang={lang} 
          onClose={() => setShowPopup(false)} 
        />
      )}
      
      <Hero />
      <Stage />
      <Courses limit={4} />
      <CenterHours />
      <Books />
      <About />
    </>
  );
};

export default TeacherHome;