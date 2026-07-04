/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContactTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  teacherName?: string;
  phone?: string;
  messageType?: 'default' | 'exam_hidden' | 'need_support';
}

export const ContactTeacherModal = ({ 
  isOpen, 
  onClose, 
  lang, 
  teacherName, 
  phone, 
  messageType = 'default' 
}: ContactTeacherModalProps) => {
  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isHovered, setIsHovered] = useState(false);

  let title = '';
  let description = '';
  let defaultMessage = '';

  if (messageType === 'exam_hidden') {
    title = isRtl ? '💬 النتيجة مخفية' : '💬 Result Hidden';
    description = isRtl 
      ? `لقد قمت بحل الامتحان ولكن النتيجة مخفية من قبل المعلم`
      : `You have solved the exam but the result is hidden by the teacher`;
    defaultMessage = `السلام عليكم، لقد قمت بحل امتحان في منصة الأستاذ ${teacherName || 'المعلم'} والنتيجة مخفية، أرجو التواصل معي لإظهار النتيجة`;
  } else if (messageType === 'need_support') {
    title = isRtl ? '💬 فشل في اجتياز الامتحانات' : '💬 Failed to Pass Exams';
    description = isRtl 
      ? `لم تتمكن من اجتياز جميع الامتحانات المطلوبة، يرجى التواصل مع المعلم للحصول على الدعم`
      : `You have not passed all required exams, please contact the teacher for support`;
    defaultMessage = `السلام عليكم، لم أتمكن من اجتياز جميع الامتحانات المطلوبة في منصة الأستاذ ${teacherName || 'المعلم'}، أرجو المساعدة`;
  } else {
    title = isRtl ? '💬 تحتاج مساعدة؟' : '💬 Need Help?';
    description = isRtl 
      ? `لم تتمكن من اجتياز الامتحانات المطلوبة`
      : `You couldn't pass the required exams`;
    defaultMessage = `السلام عليكم، أحتاج إلى مساعدة بخصوص منصة الأستاذ ${teacherName || 'المعلم'}`;
  }

  const cleanPhone = phone?.replace(/\s/g, "").replace(/[^0-9+]/g, "") || "";

  const handleWhatsApp = () => {
    if (!cleanPhone) {
      toast.error(isRtl ? "رقم الهاتف غير متوفر" : "Phone number not available");
      return;
    }
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${
            messageType === 'need_support' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/30'
          }`}>
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
          
          <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl mb-6">
            {isRtl
              ? `📞 تواصل مع المعلم "${teacherName || 'المعلم'}" عبر واتساب للحصول على المساعدة`
              : `📞 Contact teacher "${teacherName || 'the teacher'}" via WhatsApp for assistance`}
          </p>

          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleWhatsApp}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`group relative w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              messageType === 'need_support'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/30'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span>{isRtl ? "📱 تواصل عبر واتساب" : "📱 Contact via WhatsApp"}</span>
          </motion.button>

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