// pages/Login.tsx
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { useTeacher } from "@/context/TeacherContext";
import { useStudentLogin } from "@/hooks/useStudent";
import { Zap, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

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
    login({
      phone: formData.phone,
      password: formData.password,
      type: formData.type as 'student' | 'parent',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          to={`/${slug}`} 
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-6 transition-colors"
        >
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold">
            {lang === "ar" ? "تسجيل دخول الطالب" : "Student Login"}
          </h1>
          <p className="text-foreground/60 mt-2">
            {lang === "ar" 
              ? `مرحباً بعودتك إلى منصة ${teacherName}` 
              : `Welcome back to ${teacherName}'s platform`}
          </p>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "student" })}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              formData.type === "student"
                ? "gradient-primary text-white shadow-soft"
                : "bg-card border border-border hover:border-primary/40"
            }`}
          >
            {lang === "ar" ? "طالب" : "Student"}
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "parent" })}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              formData.type === "parent"
                ? "gradient-primary text-white shadow-soft"
                : "bg-card border border-border hover:border-primary/40"
            }`}
          >
            {lang === "ar" ? "ولي أمر" : "Parent"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="01000000000"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-foreground/50" />
                  ) : (
                    <Eye className="w-4 h-4 text-foreground/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl gradient-primary text-white font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                lang === "ar" ? "تسجيل الدخول" : "Login"
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-foreground/60 mt-6">
          {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
          <Link to={`/${slug}/register`} className="text-primary font-semibold hover:underline">
            {lang === "ar" ? "إنشاء حساب" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;