// src/themes/nature/pages/Login.tsx
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentLogin } from "@/hooks/useStudent";
import { LogIn, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast  } from "@/hooks/use-toast";

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

  // ✅ هنا الشكل الجديد (Nature Theme) - نفس شكل Landing بتاع nature
  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 max-w-md">
        {/* Back to Home Link */}
        <Link 
          to={`/${slug}`} 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Main Card */}
        <div className="bg-card rounded-3xl shadow-soft border p-8 md:p-10 animate-fade-up">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center shadow-soft">
              <LogIn className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                {lang === "ar" ? "تسجيل الدخول" : "Login"}
              </h1>
              <p className="text-sm text-muted-foreground">
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
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-background border border-border hover:border-primary/40"
              }`}
            >
              {lang === "ar" ? "طالب" : "Student"}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "parent" })}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                formData.type === "parent"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-background border border-border hover:border-primary/40"
              }`}
            >
              {lang === "ar" ? "ولي أمر" : "Parent"}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Field */}
            <div>
              <label className="block text-sm font-bold mb-1.5">
                {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                <span className="px-4 text-muted-foreground"><Phone className="size-4" /></span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
                  placeholder="01x xxxx xxxx"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold mb-1.5">
                {lang === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative flex items-center bg-background border rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition">
                <span className="px-4 text-muted-foreground"><Lock className="size-4" /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="size-4 rounded accent-primary" />
                <span className="text-muted-foreground">{lang === "ar" ? "تذكرني" : "Remember me"}</span>
              </label>
              <a href="#forgot" className="text-primary font-bold hover:underline">
                {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-soft hover:shadow-glow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                lang === "ar" ? "تسجيل الدخول" : "Login"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link to={`/${slug}/register`} className="text-primary font-bold hover:underline">
              {lang === "ar" ? "إنشاء حساب" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;