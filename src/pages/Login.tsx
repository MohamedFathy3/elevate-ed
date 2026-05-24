import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, Mail, Lock } from "lucide-react";

const Login = () => {
  const { lang } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(lang === "ar" ? "تسجيل دخول وهمي (بدون backend)" : "Mock login (no backend)");
  };

  return (
    <section className="pt-36 md:pt-40 pb-24 min-h-screen grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto px-5"
      >
        <div className="bg-card rounded-3xl p-8 md:p-10 shadow-elegant border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-primary grid place-items-center shadow-soft">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl">{lang === "ar" ? "أهلاً بعودتك" : "Welcome back"}</h1>
              <p className="text-xs text-foreground/60">{pick(teacher.brand.logoText, teacher.brand.logoText_ar)}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-foreground/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{lang === "ar" ? "كلمة السر" : "Password"}</label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-foreground/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
            >
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-foreground/65">
            {lang === "ar" ? "مفيش حساب؟ " : "Don't have an account? "}
            <Link to={`/${slug}/register`} className="text-primary font-semibold hover:underline">
              {lang === "ar" ? "سجّل دلوقتي" : "Register"}
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
