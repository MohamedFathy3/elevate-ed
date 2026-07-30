// src/pages/Login.tsx

import { useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentLogin } from "@/hooks/useStudent";
import { 
  LogIn, Phone, Lock, Eye, EyeOff, 
  ArrowLeft, ArrowRight, Loader2, ShieldCheck,
  KeyRound, GraduationCap
} from "lucide-react";
import { getDeviceData } from "@/utils/deviceFingerprint";
import { AccountBlockedModal } from "@/components/AccountBlockedModal";
import { toast } from "@/hooks/use-toast";

// Interface للبيانات اللي هتتبعت
interface LoginPayload {
  phone?: string; // ✅ اختياري للـ Parent
  password: string;
  type: "student" | "parent";
  device_id: string;
  fingerprint: string;
  last_ip: string;
  user_agent: string;
}

const Login = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher } = useTeacher();
  const { mutate: login, isPending, error, reset } = useStudentLogin();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [deviceData, setDeviceData] = useState<Omit<LoginPayload, 'phone' | 'password' | 'type'> | null>(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState("");
  
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    type: "student",
  });

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const iconPos = dir === "rtl" ? "right-3" : "left-3";
  const inputPad = dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4";
  const passwordPad = dir === "rtl" ? "pr-10 pl-12" : "pl-10 pr-12";
  const eyePos = dir === "rtl" ? "left-3" : "right-3";

  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  const home = teacher?.website?.home;
  const heroImage = home?.imageUrl || home?.image?.fullUrl;
  const teacherPhone = teacher?.phone || "";

  // ✅ تحديد إذا كان الـ mode Parent
  const isParent = formData.type === "parent";

  // ✅ جلب بيانات الجهاز عند تحميل الصفحة
  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        const data = await getDeviceData();
        setDeviceData(data);
        setDeviceReady(true);
        
        console.log('✅ بيانات الجهاز:', data);
      } catch (error) {
        console.error('❌ فشل في جلب بيانات الجهاز:', error);
        setDeviceReady(true);
      }
    };

    loadDeviceData();
  }, []);

  // ✅ مراقبة الأخطاء من الـ mutation
  useEffect(() => {
    if (error) {
      const errorData = error as any;
      const message = errorData?.response?.data?.message || "";
      
      if (message.includes("تم إيقاف الحساب") || 
          message.includes("تم إيقاف") || 
          message.includes("إعادة التفعيل") ||
          message.includes("جهاز آخر") ||
          message.includes("تم حظر")) {
        setBlockedMessage(message);
        setShowBlockedModal(true);
        reset();
      }
    }
  }, [error, reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ التحقق حسب النوع (من الكود الأول)
    if (isParent) {
      if (!formData.password) {
        toast.error(lang === "ar" ? "الرجاء إدخال كود ولي الأمر" : "Please enter parent code");
        return;
      }
    } else {
      if (!formData.phone) {
        toast.error(lang === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter phone number");
        return;
      }
      if (!formData.password) {
        toast.error(lang === "ar" ? "الرجاء إدخال كلمة المرور" : "Please enter password");
        return;
      }
    }
    
    if (!deviceReady || !deviceData) {
      toast.info(lang === "ar" ? "جاري تجهيز الجهاز..." : "Preparing device...");
      return;
    }

    // ✅ تجهيز البيانات للإرسال (من الكود الأول)
    const payload: LoginPayload = {
      password: formData.password,
      type: formData.type as 'student' | 'parent',
      device_id: deviceData.device_id,
      fingerprint: deviceData.fingerprint,
      last_ip: deviceData.last_ip,
      user_agent: deviceData.user_agent,
    };

    // ✅ إضافة phone فقط للـ Student
    if (!isParent) {
      payload.phone = formData.phone;
    }

    console.log('📤 البيانات المرسلة:', payload);
    login(payload);
  };

  // ✅ تحديد الـ label والنص والـ placeholder حسب النوع (من الكود الأول)
  const getPasswordLabel = () => {
    if (isParent) {
      return lang === "ar" ? "كود ولي الأمر" : "Parent Code";
    }
    return lang === "ar" ? "كلمة المرور" : "Password";
  };

  const getPasswordPlaceholder = () => {
    if (isParent) {
      return lang === "ar" ? "أدخل كود ولي الأمر" : "Enter parent code";
    }
    return "••••••••";
  };

  const getPasswordIcon = () => {
    if (isParent) {
      return <KeyRound className="size-4" />;
    }
    return <Lock className="size-4" />;
  };

  return (
    <>
      <section className="min-h-screen bg-[#eef1f6] dark:bg-[#0f1419] flex items-center px-4 py-28 sm:px-6 sm:py-32 lg:px-10 lg:py-24">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:ring-slate-700/50">
            {/* Image Panel */}
            <div
              className={`relative min-h-[220px] sm:min-h-[260px] lg:min-h-[600px] flex flex-col justify-end overflow-hidden bg-[#1a2744] ${
                dir === "rtl" ? "lg:order-2" : "lg:order-1"
              }`}
            >
              {heroImage && (
                <img
                  src={heroImage}
                  alt={teacherName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744]/95 via-[#243b6b]/90 to-[#1e3a5f]/85" />

              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(99,140,255,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.2) 0%, transparent 45%)",
                }}
              />

              <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-5">
                  <GraduationCap className="w-6 h-6 text-sky-200" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
                  {lang === "ar" ? "مرحباً بعودتك" : "Welcome Back"}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-sm leading-relaxed">
                  {lang === "ar"
                    ? `تابع رحلتك التعليمية مع ${teacherName} واستكشف كل الكورسات والمواد المتاحة.`
                    : `Continue your learning journey with ${teacherName} and explore all available courses and materials.`}
                </p>
              </div>
            </div>

            {/* Form Panel */}
            <div
              className={`flex flex-col justify-center bg-white dark:bg-[#161b22] p-6 sm:p-8 lg:p-10 xl:p-12 ${
                dir === "rtl" ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <Link
                to={`/`}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#3b5bdb] dark:text-slate-400 dark:hover:text-sky-400 mb-6 transition-colors w-fit"
              >
                <Arrow className="w-4 h-4" />
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Link>

              <div className="mb-7">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#edf2ff] dark:bg-[#3b5bdb]/15 mb-4">
                  <LogIn className="w-5 h-5 text-[#3b5bdb] dark:text-sky-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {lang === "ar" ? "تسجيل دخول" : "Login"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm sm:text-base">
                  {lang === "ar"
                    ? `مرحباً بعودتك إلى منصة ${teacherName}`
                    : `Welcome back to ${teacherName}'s platform`}
                </p>
                
                {redirectUrl && redirectUrl !== '/dashboard' && (
                  <div className="mt-3 text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 px-3 py-2 rounded-lg">
                    {lang === "ar" 
                      ? `⏳ سيتم تحويلك إلى الصفحة المطلوبة بعد تسجيل الدخول`
                      : `⏳ You will be redirected to the requested page after login`}
                  </div>
                )}
              </div>

              {/* ✅ Type Selector - محسّن */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: "student" });
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    formData.type === "student"
                      ? "bg-[#3b5bdb] text-white shadow-lg shadow-[#3b5bdb]/25"
                      : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#3b5bdb] dark:hover:border-sky-400"
                  }`}
                >
                  {lang === "ar" ? "طالب" : "Student"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: "parent" });
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    formData.type === "parent"
                      ? "bg-[#3b5bdb] text-white shadow-lg shadow-[#3b5bdb]/25"
                      : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#3b5bdb] dark:hover:border-sky-400"
                  }`}
                >
                  {lang === "ar" ? "ولي أمر" : "Parent"}
                </button>
              </div>

              {/* ✅ توضيح للـ Parent (من الكود الأول) */}
              {isParent && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    {lang === "ar" 
                      ? "🔑 أدخل كود ولي الأمر للدخول إلى لوحة التحكم"
                      : "🔑 Enter the parent code to access the dashboard"}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ✅ Phone Field - يظهر للـ Student فقط (من الكود الأول) */}
                {!isParent && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl ${inputPad} py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15 transition-all`}
                        placeholder="01000000000"
                        required={!isParent}
                      />
                    </div>
                  </div>
                )}

                {/* ✅ Password Field - محسّن مع أيقونات مختلفة (من الكود الأول) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {getPasswordLabel()}
                    {isParent && (
                      <span className="text-emerald-500 text-xs font-normal mr-1">
                        ({lang === "ar" ? "مطلوب" : "Required"})
                      </span>
                    )}
                  </label>
                  <div className={`relative ${
                    isParent 
                      ? 'border-emerald-400 dark:border-emerald-600' 
                      : 'border-slate-200 dark:border-slate-700'
                  }`}>
                    <span className={`absolute ${iconPos} top-1/2 -translate-y-1/2 ${
                      isParent ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                      {getPasswordIcon()}
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 dark:bg-slate-800/60 border rounded-xl ${passwordPad} py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        isParent 
                          ? 'border-emerald-400 dark:border-emerald-600 focus:border-emerald-500 focus:ring-emerald-400/30 placeholder:text-emerald-400/60 dark:placeholder:text-emerald-500/60' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#3b5bdb] focus:ring-[#3b5bdb]/15 placeholder:text-slate-400'
                      }`}
                      placeholder={getPasswordPlaceholder()}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${eyePos} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {isParent && (
                    <p className="text-[10px] text-emerald-500/70 dark:text-emerald-400/70 mt-1 flex items-center gap-1">
                      <KeyRound className="size-3" />
                      {lang === "ar" 
                        ? "💡 أدخل الكود الخاص بك للوصول إلى لوحة ولي الأمر"
                        : "💡 Enter your code to access the parent dashboard"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending || !deviceReady}
                  className="w-full py-3.5 rounded-xl bg-[#3b5bdb] hover:bg-[#364fc7] text-white font-semibold shadow-[0_4px_14px_rgba(59,91,219,0.35)] hover:shadow-[0_6px_20px_rgba(59,91,219,0.45)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : !deviceReady ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {lang === "ar" ? "جاري تجهيز الجهاز..." : "Preparing device..."}
                    </span>
                  ) : lang === "ar" ? (
                    "تسجيل الدخول"
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
                <Link
                  to={`/register`}
                  className="text-[#3b5bdb] dark:text-sky-400 font-semibold hover:underline"
                >
                  {lang === "ar" ? "إنشاء حساب" : "Sign up"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ مودال إيقاف الحساب */}
      <AccountBlockedModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
        lang={lang}
        teacherName={teacherName}
        phone={teacherPhone}
        message={blockedMessage}
      />
    </>
  );
};

export default Login;