import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, Mail, Lock, User, Phone } from "lucide-react";

const Register = () => {
  const { lang } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(lang === "ar" ? "إنشاء حساب وهمي (بدون backend)" : "Mock registration (no backend)");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const fields: { k: keyof typeof form; label: string; type: string; Icon: typeof User; placeholder?: string }[] = [
    { k: "name", label: lang === "ar" ? "الاسم" : "Full name", type: "text", Icon: User, placeholder: lang === "ar" ? "اسمك بالكامل" : "Your full name" },
    { k: "email", label: lang === "ar" ? "البريد الإلكتروني" : "Email", type: "email", Icon: Mail, placeholder: "you@example.com" },
    { k: "phone", label: lang === "ar" ? "رقم الموبايل" : "Phone", type: "tel", Icon: Phone, placeholder: "+20 1XX XXX XXXX" },
    { k: "password", label: lang === "ar" ? "كلمة السر" : "Password", type: "password", Icon: Lock, placeholder: "••••••••" },
  ];

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
            <div className="w-12 h-12 rounded-2xl gradient-accent grid place-items-center shadow-soft">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl">{lang === "ar" ? "إنشاء حساب جديد" : "Create your account"}</h1>
              <p className="text-xs text-foreground/60">{pick(teacher.brand.logoText, teacher.brand.logoText_ar)}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {fields.map(({ k, label, type, Icon, placeholder }) => (
              <div key={k}>
                <label className="block text-sm font-semibold mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-foreground/50" />
                  <input
                    type={type}
                    required
                    value={form[k]}
                    onChange={set(k)}
                    placeholder={placeholder}
                    className="w-full bg-background border border-border rounded-2xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
            >
              {lang === "ar" ? "إنشاء حساب" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-foreground/65">
            {lang === "ar" ? "عندك حساب؟ " : "Already registered? "}
            <Link to={`/${slug}/login`} className="text-primary font-semibold hover:underline">
              {lang === "ar" ? "سجّل دخول" : "Login"}
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
