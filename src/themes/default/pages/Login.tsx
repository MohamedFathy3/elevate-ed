// src/pages/Login.tsx

import { useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentLogin } from "@/hooks/useStudent";
import { LogIn, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, GraduationCap } from "lucide-react";
import { getDeviceData } from "@/utils/deviceFingerprint";
import { AccountBlockedModal } from "@/components/AccountBlockedModal"; // ✅ إضافة المودال

// Interface للبيانات اللي هتتبعت
interface LoginPayload {
  phone: string;
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
  const { mutate: login, isPending, error, reset } = useStudentLogin(); // ✅ إضافة error و reset
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [deviceData, setDeviceData] = useState<Omit<LoginPayload, 'phone' | 'password' | 'type'> | null>(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false); // ✅ حالة المودال
  const [blockedMessage, setBlockedMessage] = useState(""); // ✅ رسالة الإيقاف
  
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
  const teacherPhone = teacher?.phone || ""; // ✅ جلب رقم المعلم

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
      
      // ✅ التحقق من رسالة إيقاف الحساب
      if (message.includes("تم إيقاف الحساب") || 
          message.includes("تم إيقاف") || 
          message.includes("إعادة التفعيل") ||
          message.includes("جهاز آخر")) {
        setBlockedMessage(message);
        setShowBlockedModal(true);
        reset(); // ✅ إعادة تعيين الـ error
      }
    }
  }, [error, reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceReady || !deviceData) {
      console.warn('⏳ انتظر حتى يتم جلب بيانات الجهاز');
      return;
    }

    const payload = {
      phone: formData.phone,
      password: formData.password,
      type: formData.type as "student" | "parent",
      device_id: deviceData.device_id,
      fingerprint: deviceData.fingerprint,
      last_ip: deviceData.last_ip,
      user_agent: deviceData.user_agent,
    };

    console.log('📤 البيانات المرسلة:', payload);
    login(payload);
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
                  {lang === "ar" ? "تسجيل دخول الطالب" : "Student Login"}
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

              <div className="flex p-1 mb-6 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "student" })}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.type === "student"
                      ? "bg-white dark:bg-slate-700 text-[#3b5bdb] dark:text-sky-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {lang === "ar" ? "طالب" : "Student"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "parent" })}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.type === "parent"
                      ? "bg-white dark:bg-slate-700 text-[#3b5bdb] dark:text-sky-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {lang === "ar" ? "ولي أمر" : "Parent"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {lang === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute ${iconPos} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl ${passwordPad} py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15 transition-all`}
                      placeholder="••••••••"
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
                </div>

                <button
                  type="submit"
                  disabled={isPending || !deviceReady}
                  className="w-full py-3.5 rounded-xl bg-[#3b5bdb] hover:bg-[#364fc7] text-white font-semibold shadow-[0_4px_14px_rgba(59,91,219,0.35)] hover:shadow-[0_6px_20px_rgba(59,91,219,0.45)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : !deviceReady ? (
                    lang === "ar" ? "جاري تجهيز الجهاز..." : "Preparing device..."
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