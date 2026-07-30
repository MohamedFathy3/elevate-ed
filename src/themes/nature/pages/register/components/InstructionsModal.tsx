// src/pages/register/components/InstructionsModal.tsx

import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export const InstructionsModal = ({ isOpen, onClose, lang }: InstructionsModalProps) => {
  if (!isOpen) return null;

  // ✅ نفس التعليمات لكن بدون أيقونات متعددة
  const instructions = [
    {
      title: lang === "ar" ? "📱 متوافق مع جميع الأجهزة" : "📱 Compatible with all devices",
      desc: lang === "ar"
        ? "المنصة تعمل على جميع الأجهزة (موبايل ولابتوب)"
        : "The platform works on all devices (Mobile & Laptop)"
    },
    {
      title: lang === "ar" ? "🎂 تاريخ الميلاد" : "🎂 Birth Date",
      desc: lang === "ar"
        ? "يجب أن يكون العمر بين 3 و 25 سنة"
        : "Age must be between 3 and 25 years"
    },
    {
      title: lang === "ar" ? "👥 نوع الحساب" : "👥 Account Type",
      desc: lang === "ar"
        ? "طالب سنتر يعمل أكونت سنتر وطالب الأونلاين يعمل أكونت أونلاين"
        : "Center student creates center account, online student creates online account"
    },
    {
      title: lang === "ar" ? "🔒 لا يمكن تعديل البيانات" : "🔒 No data modification",
      desc: lang === "ar"
        ? "لا يمكن تعديل البيانات إلا بالعودة للدعم"
        : "Data cannot be modified except by contacting support"
    },
    {
      title: lang === "ar" ? "💰 عدم استرجاع الكورسات" : "💰 No course refund",
      desc: lang === "ar"
        ? "لا يمكن استرجاع أو تبديل الكورس بعد الاشتراك"
        : "No refund or exchange of course after subscription"
    },
    {
      title: lang === "ar" ? "🌐 اتصال إنترنت قوي" : "🌐 Strong internet connection",
      desc: lang === "ar"
        ? "استخدم واي فاي قوي والنت يكون مستقر جدا حتي لا تواجه مشكلة مع الفيديوهات"
        : "Use strong Wi-Fi and stable internet to avoid video issues"
    },
    {
      title: lang === "ar" ? "👤 استخدام شخصي فقط" : "👤 Personal use only",
      desc: lang === "ar"
        ? "الحساب مخصص للاستخدام الشخصي فقط ومشاركته تعرضه للإغلاق"
        : "Account is for personal use only; sharing it will lead to closure"
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - أخف */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h2 className="text-lg font-bold">
                  {lang === "ar" ? "تعليمات هامة" : "Important Instructions"}
                </h2>
                <p className="text-white/70 text-xs">
                  {lang === "ar" ? "برجاء القراءة بعناية" : "Please read carefully"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content - نفس المحتوى بدون أيقونات متعددة */}
        <div className="p-5 space-y-3">
          {instructions.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">
                  {item.title}
                </h3>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm hover:shadow-lg transition"
          >
            {lang === "ar" ? "فهمت ✓" : "I Understand ✓"}
          </button>
        </div>
      </div>
    </div>
  );
};