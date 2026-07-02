/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login.tsx

import { useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentLogin } from "@/hooks/useStudent";
import { 
  LogIn, Phone, Lock, Eye, EyeOff, 
  ArrowLeft, ArrowRight, Loader2, ShieldCheck,
  Mail, KeyRound // ✅ أيقونة الكود
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
// استيراد دوال الجهاز
import { getDeviceData } from "@/utils/deviceFingerprint";

// Interface للبيانات اللي هنبعتها للباك
interface LoginPayload {
  phone?: string;
  password: string; // ✅ دايماً password للباك
  type: 'student' | 'parent';
  device_id: string;
  fingerprint: string;
  last_ip: string;
  user_agent: string;
}

const Login = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher } = useTeacher();
  const { mutate: login, isPending } = useStudentLogin();
  
  const [showPassword, setShowPassword] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [deviceData, setDeviceData] = useState<Omit<LoginPayload, 'phone' | 'password' | 'type'> | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    type: "student",
  });

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ التحقق حسب النوع
    if (isParent) {
      // ✅ Parent: بس password
      if (!formData.password) {
        toast.error(lang === "ar" ? "الرجاء إدخال كود ولي الأمر" : "Please enter parent code");
        return;
      }
    } else {
      // ✅ Student: Phone + Password
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

    // ✅ تجهيز البيانات للإرسال
    const payload: LoginPayload = {
      password: formData.password, // ✅ دايماً password للباك
      type: formData.type as 'student' | 'parent',
      device_id: deviceData.device_id,
      fingerprint: deviceData.fingerprint,
      last_ip: deviceData.last_ip,
      user_agent: deviceData.user_agent,
    };

    // ✅ للـ Student نضيف Phone
    if (!isParent) {
      payload.phone = formData.phone;
    }

    console.log('📤 البيانات المرسلة للباك:', payload);
    
    // ✅ إرسال البيانات
    login(payload);
  };

  // ✅ تحديد الـ label والنص والـ placeholder حسب النوع
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
      return <KeyRound className="size-4" />; // ✅ أيقونة مختلفة للـ Parent
    }
    return <Lock className="size-4" />;
  };

  return (
    <div className="min-h-screen py-16 md:py-24 bg-white dark:bg-gray-950 relative">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-400/10 dark:bg-emerald-400/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-300/5 dark:bg-emerald-300/5 blur-3xl" />
        
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/30 dark:bg-emerald-400/20"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 max-w-md relative z-10">
        {/* Back to Home Link */}
        <Link 
          to={``} 
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white grid place-items-center shadow-lg shadow-emerald-500/25">
              <LogIn className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                {lang === "ar" ? "تسجيل الدخول" : "Login"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lang === "ar" ? `مرحباً بعودتك إلى منصة ${teacherName}` : `Welcome back to ${teacherName}'s platform`}
              </p>
            </div>
          </div>

          {/* ✅ Type Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, type: "student" });
                setFormData(prev => ({ ...prev, email: "" }));
              }}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                formData.type === "student"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
              }`}
            >
              {lang === "ar" ? "طالب" : "Student"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, type: "parent" });
                setFormData(prev => ({ ...prev, phone: "" }));
              }}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                formData.type === "parent"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
              }`}
            >
              {lang === "ar" ? "ولي أمر" : "Parent"}
            </button>
          </div>

          {/* ✅ توضيح للـ Parent */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ Phone Field - يظهر للـ Student فقط */}
            {!isParent && (
              <div>
                <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                  {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                </label>
                <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition">
                  <span className="px-4 text-gray-400 dark:text-gray-500"><Phone className="size-4" /></span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="01x xxxx xxxx"
                    required={!isParent}
                  />
                </div>
              </div>
            )}

            {/* ✅ Email Field - للـ Parent (اختياري) */}
            

            {/* ✅ Password Field - يظهر في الحالتين مع تغيير الـ UI */}
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                {getPasswordLabel()}
                {isParent && (
                  <span className="text-emerald-500 text-xs font-normal mr-1">
                    ({lang === "ar" ? "مطلوب" : "Required"})
                  </span>
                )}
              </label>
              <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 border rounded-2xl focus-within:ring-2 transition ${
                isParent 
                  ? 'border-emerald-400 dark:border-emerald-600 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30' 
                  : 'border-gray-200 dark:border-gray-700 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30'
              }`}>
                <span className={`px-4 ${isParent ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {getPasswordIcon()}
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    isParent ? 'placeholder:text-emerald-400/60 dark:placeholder:text-emerald-500/60' : ''
                  }`}
                  placeholder={getPasswordPlaceholder()}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* ✅ نص مساعد للـ Parent */}
              {isParent && (
                <p className="text-[10px] text-emerald-500/70 dark:text-emerald-400/70 mt-1 flex items-center gap-1">
                  <KeyRound className="size-3" />
                  {lang === "ar" 
                    ? "💡 أدخل الكود الخاص بك للوصول إلى لوحة ولي الأمر"
                    : "💡 Enter your code to access the parent dashboard"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !deviceReady}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : !deviceReady ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "ar" ? "جاري تجهيز الجهاز..." : "Preparing device..."}
                </span>
              ) : (
                lang === "ar" ? "تسجيل الدخول" : "Login"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link to={`/register`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              {lang === "ar" ? "إنشاء حساب" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Login;