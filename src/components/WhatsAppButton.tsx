/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/WhatsAppButton.tsx

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useSafeTeacher } from "@/context/TeacherContext";

interface WhatsAppButtonProps {
  message?: string;
  position?: "bottom-right" | "bottom-left";
  fallbackPhone?: string;
}

export const WhatsAppButton = ({ 
  message = "السلام عليكم، أحتاج إلى مساعدة",
  position = "bottom-left",
  fallbackPhone = "201154853195"
}: WhatsAppButtonProps) => {
  const { teacher, isLoading: teacherLoading } = useSafeTeacher();
  
  const [shouldShow, setShouldShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ✅ استخراج رقم الهاتف
  const phoneNumber = teacher?.phone || fallbackPhone;
  const cleanPhoneNumber = phoneNumber.replace(/\s/g, "").replace(/[^0-9+]/g, "");
  
  const customMessage = teacher?.name 
    ? `السلام عليكم، أحتاج إلى مساعدة بخصوص منصة الأستاذ ${teacher.name}`
    : message;

  // ✅ تأثير التمرير - إخفاء الزر عند التمرير لأسفل
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShouldShow(false);
      } else {
        setShouldShow(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (teacherLoading || !shouldShow) {
    return null;
  }

  const positionStyle = position === "bottom-left" 
    ? { bottom: "24px", left: "24px" }
    : { bottom: "24px", right: "24px" };

  return (
    <div className="fixed z-50" style={positionStyle}>
      {/* ✅ زر واتساب - بدون أنيميشن */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/50 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        aria-label="WhatsApp"
      >
        {/* ✅ خلفية ثابتة - بدون animate-ping */}
        <MessageCircle className="w-7 h-7 text-white" />
        
        {/* ✅ علامة 1 - ثابتة */}
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">1</span>
        </div>
      </button>
    </div>
  );
};