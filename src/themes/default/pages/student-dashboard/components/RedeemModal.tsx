// src/pages/student-dashboard/components/RedeemModal.tsx

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const RedeemModal = ({ 
  redeemCodeInput, setRedeemCodeInput, handleRedeemCode, 
  onClose, redeeming, lang, isNature, isDark 
}: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${getTextColor()}`}>
            {lang === "ar" ? "استخدام كود الخصم" : "Redeem Code"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className={`text-gray-500 dark:text-gray-400 text-sm mb-4`}>
          {lang === "ar" 
            ? "أدخل الكود الذي حصلت عليه من المدرس لتفعيل الخصم أو الحصول على محتوى مجاني"
            : "Enter the code you received from the teacher to activate discount or get free content"}
        </p>
        
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${getTextColor()}`}>
            {lang === "ar" ? "الكود" : "Code"}
          </label>
          <input
            type="text"
            value={redeemCodeInput}
            onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
            placeholder="مثال: LOT4LBNW"
            className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none font-mono tracking-wider uppercase ${getTextColor()}`}
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleRedeemCode}
            disabled={redeeming || !redeemCodeInput.trim()}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${isNature 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gradient-to-r from-primary to-accent'}`}
          >
            {redeeming ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              lang === "ar" ? "تفعيل" : "Redeem"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};