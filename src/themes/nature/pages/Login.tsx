// src/pages/Login.tsx

import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentLogin } from "@/hooks/useStudent";
import { LogIn, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, Leaf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { lang, dir } = useLang();
  const { slug } = useParams();
  const { teacher } = useTeacher();
  const { mutate: login, isPending } = useStudentLogin();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    type: "student",
  });

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone) {
      toast.error(lang === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter phone number");
      return;
    }
    if (!formData.password) {
      toast.error(lang === "ar" ? "الرجاء إدخال كلمة المرور" : "Please enter password");
      return;
    }
    
    login({
      phone: formData.phone,
      password: formData.password,
      type: formData.type as 'student' | 'parent',
    });
  };

  return (
    <div className="min-h-screen py-16 md:py-24 bg-white dark:bg-gray-950">
      {/* ✅ خلفية متحركة خفيفة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-400/10 dark:bg-emerald-400/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-300/5 dark:bg-emerald-300/5 blur-3xl" />
        
        {/* نقط متحركة */}
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
          to={`/${slug}`} 
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

          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "student" })}
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
              onClick={() => setFormData({ ...formData, type: "parent" })}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                formData.type === "parent"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500"
              }`}
            >
              {lang === "ar" ? "ولي أمر" : "Parent"}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Field */}
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
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                {lang === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-400/40 dark:focus-within:ring-emerald-500/30 transition">
                <span className="px-4 text-gray-400 dark:text-gray-500"><Lock className="size-4" /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent py-3 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="••••••••"
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
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="size-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "تذكرني" : "Remember me"}</span>
              </label>
              <a href="#forgot" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                lang === "ar" ? "تسجيل الدخول" : "Login"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link to={`/${slug}/register`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
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