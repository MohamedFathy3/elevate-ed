/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/WhatsAppButton.tsx

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  // ✅ استخدام useSafeTeacher عشان نجيب الـ slug والـ teacher
  const { teacher, slug, isLoading: teacherLoading } = useSafeTeacher();
  
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);

  // ✅ استخراج رقم الهاتف من الـ teacher
  const phoneNumber = teacher?.phone || fallbackPhone;
  const cleanPhoneNumber = phoneNumber.replace(/\s/g, "").replace(/[^0-9+]/g, "");
  
  // ✅ رسالة مخصصة تشمل اسم المعلم
  const customMessage = teacher?.name 
    ? `السلام عليكم، أحتاج إلى مساعدة بخصوص منصة الأستاذ ${teacher.name}`
    : message;

  // ✅ للتأكد من البيانات

  // ✅ تأثير التمرير
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

  // ✅ تأثير التلميح
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // أثناء التحميل، الزر مش هيظهر
  if (teacherLoading) {
    return null;
  }

  if (!isVisible || !shouldShow) {
    return null;
  }

  // ✅ تحديد موقع الزر حسب props
  const positionStyle = position === "bottom-left" 
    ? { bottom: "24px", left: "24px" }
    : { bottom: "24px", right: "24px" };
  
  // ✅ اتجاه التلميح حسب موقع الزر
  const tooltipPosition = position === "bottom-left"
    ? "bottom-16 left-0"
    : "bottom-16 right-0";
  
  const tooltipArrowPosition = position === "bottom-left"
    ? "bottom-0 left-4 translate-y-1/2 w-3 h-3 bg-emerald-600 rotate-45"
    : "bottom-0 right-4 translate-y-1/2 w-3 h-3 bg-emerald-600 rotate-45";

  return (
    <div className="fixed z-50" style={positionStyle}>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: position === "bottom-left" ? -20 : 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position === "bottom-left" ? -20 : 20, scale: 0.8 }}
            className={`absolute ${tooltipPosition} mb-2 whitespace-nowrap`}
          >
            <div className="relative bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-2xl shadow-lg">
              <span>{customMessage.length > 30 ? customMessage.substring(0, 30) + "..." : customMessage}</span>
              <div className={`absolute ${tooltipArrowPosition}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? position === "bottom-left" ? -5 : 5 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75" style={{ animationDuration: "1.5s" }} />
        <MessageCircle className="w-7 h-7 text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">1</span>
        </div>
      </motion.button>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute inset-0 rounded-full bg-green-400/30 -z-10"
      />
    </div>
  );
};