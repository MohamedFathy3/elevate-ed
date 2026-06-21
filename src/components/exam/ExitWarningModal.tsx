// src/components/exam/ExitWarningModal.tsx
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ExitWarningModalProps {
  onContinue: () => void;
  onLeave: () => void;
  lang: string;
}

export const ExitWarningModal = ({
  onContinue,
  onLeave,
  lang,
}: ExitWarningModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onContinue}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {lang === "ar" ? "تحذير!" : "Warning!"}
          </h3>
          <p className="text-foreground/60 mb-6">
            {lang === "ar"
              ? "هل أنت متأكد من مغادرة الامتحان؟ سيتم فقدان إجاباتك الحالية."
              : "Are you sure you want to leave? Your current answers will be lost."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all"
            >
              {lang === "ar" ? "متابعة الامتحان" : "Continue Exam"}
            </button>
            <button
              onClick={onLeave}
              className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
            >
              {lang === "ar" ? "مغادرة" : "Leave"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};