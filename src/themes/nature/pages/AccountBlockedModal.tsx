// components/AccountBlockedModal.tsx

import { motion } from "framer-motion";
import { MessageCircle, AlertTriangle, Shield, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AccountBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  teacherName?: string;
  phone?: string;
  message?: string;
}

export const AccountBlockedModal = ({
  isOpen,
  onClose,
  lang,
  teacherName,
  phone,
  message
}: AccountBlockedModalProps) => {
  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const cleanPhone = phone?.replace(/\s/g, "").replace(/[^0-9+]/g, "") || "";

  const defaultMessage = isRtl
    ? `السلام عليكم، تم إيقاف حسابي في منصة الأستاذ ${teacherName || 'المعلم'} بسبب محاولة تسجيل الدخول من جهاز آخر. أرجو المساعدة في إعادة تفعيل الحساب.`
    : `Hello, my account has been blocked on ${teacherName || 'the teacher'}'s platform due to a login attempt from another device. Please help me reactivate my account.`;

  const handleWhatsApp = () => {
    if (!cleanPhone) {
      toast.error(isRtl ? "رقم الهاتف غير متوفر" : "Phone number not available");
      return;
    }
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-red-200 dark:border-red-800"
      >
        <div className="text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Shield className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isRtl ? "🔒 الحساب متوقف مؤقتاً" : "🔒 Account Temporarily Blocked"}
          </h3>

          {/* Description */}
          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300 text-left leading-relaxed">
                {message || (isRtl
                  ? "تم إيقاف الحساب بسبب محاولة تسجيل الدخول من جهاز آخر. يرجى التواصل مع المعلم لإعادة تفعيل الحساب."
                  : "Account has been blocked due to a login attempt from another device. Please contact the teacher to reactivate your account.")}
              </p>
            </div>
          </div>

          {/* Teacher Info */}
          <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl mb-6">
            {isRtl
              ? `📞 تواصل مع المعلم "${teacherName || 'المعلم'}" عبر واتساب لإعادة تفعيل الحساب`
              : `📞 Contact teacher "${teacherName || 'the teacher'}" via WhatsApp to reactivate your account`}
          </p>

          {/* WhatsApp Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
            <span>{isRtl ? "📱 تواصل عبر واتساب" : "📱 Contact via WhatsApp"}</span>
          </motion.button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {isRtl ? 'حسناً، سأتواصل لاحقاً' : 'OK, I\'ll contact later'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};