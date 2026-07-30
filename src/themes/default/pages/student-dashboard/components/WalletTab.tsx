/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/student-dashboard/components/WalletTab.tsx

import { Wallet, DollarSign, CreditCard, Gift, Ticket, History, Copy } from "lucide-react";

export const WalletTab = ({
  walletBalance, generatedCode, showRechargeModal, setShowRechargeModal,
  showRedeemModal, setShowRedeemModal, rechargeCode, setRechargeCode,
  redeemCodeInput, setRedeemCodeInput, handleRecharge, handleRedeemCode,
  handleCreateCode, copyToClipboard, recharging, redeeming, creatingCode,
  lang, isNature, isDark, primaryGradient, cardBg
}: any) => {
  const isRtl = lang === 'ar';
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${isNature ? 'amber' : 'primary'}/10`}>
          <Wallet className={`w-6 h-6 text-${isNature ? 'amber' : 'primary'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${getTextColor()}`}>
          {lang === "ar" ? "المحفظة" : "My Wallet"}
        </h2>
      </div>

      {/* Balance */}
      <div className={`bg-gradient-to-r ${primaryGradient} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">{lang === "ar" ? "الرصيد الحالي" : "Current Balance"}</p>
              <p className="text-3xl font-black">{walletBalance} EGP</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRechargeModal(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-orange-600 font-semibold flex items-center gap-2 hover:scale-105 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              {lang === "ar" ? "شحن" : "Recharge"}
            </button>
          </div>
        </div>
        
        {generatedCode && (
          <div className="mt-4 p-3 bg-white/20 rounded-xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-mono text-lg tracking-wider">{generatedCode}</span>
            </div>
            <button
              onClick={() => copyToClipboard(generatedCode)}
              className="px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/40 transition-all text-sm flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {lang === "ar" ? "نسخ" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Redeem */}
      <div className={`rounded-2xl p-6 ${cardBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'}`}>
              <Gift className={`w-6 h-6 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
            </div>
            <div>
              <p className={`text-sm ${getMutedColor()}`}>{lang === "ar" ? "كود الخصم" : "Redeem Code"}</p>
              <p className={`font-semibold text-sm ${getTextColor()}`}>
                {lang === "ar" ? "أدخل كود المدرس" : "Enter teacher's code"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRedeemModal(true)}
            className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105
              ${isNature 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-gradient-to-r from-primary to-accent text-white shadow-soft hover:shadow-glow'}`}
          >
            <Ticket className="w-4 h-4" />
            {lang === "ar" ? "استخدم كود" : "Use Code"}
          </button>
        </div>
      </div>

    </div>
  );
};