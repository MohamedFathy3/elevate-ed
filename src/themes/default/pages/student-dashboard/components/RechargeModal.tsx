// src/pages/student-dashboard/components/RechargeModal.tsx

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const RechargeModal = ({ 
  rechargeCode, setRechargeCode, handleRecharge, onClose, 
  recharging, lang, isNature, isDark 
}: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950`}
      >
        <h3 className={`text-xl font-bold mb-4 ${getTextColor()}`}>
          {lang === "ar" ? "شحن المحفظة" : "Recharge Wallet"}
        </h3>
        <p className={`text-gray-500 dark:text-gray-400 text-sm mb-4`}>
          {lang === "ar" ? "أدخل كود الشحن لشحن رصيد محفظتك" : "Enter the recharge code to add balance"}
        </p>
        <input
          type="text"
          value={rechargeCode}
          onChange={(e) => setRechargeCode(e.target.value.toUpperCase())}
          placeholder={lang === "ar" ? "أدخل كود الشحن" : "Enter recharge code"}
          className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none font-mono tracking-wider ${getTextColor()}`}
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleRecharge}
            disabled={recharging}
            className={`flex-1 px-4 py-2 rounded-xl bg-gradient-to-r ${isNature ? 'from-amber-500 to-orange-600' : 'from-primary to-accent'} text-white font-semibold disabled:opacity-50`}
          >
            {recharging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (lang === "ar" ? "شحن" : "Recharge")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};