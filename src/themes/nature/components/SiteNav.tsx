// src/themes/nature/components/SiteNav.tsx (شامل الـ Footer)
import { Menu, X, UserPlus, LogIn, Home, BookOpen, GraduationCap, Layers, User } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";

export function SiteNav() {
  const { lang, setLang } = useLang();
  const { slug } = useParams();
  const { teacher, pick } = useTeacher();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const teacherName = teacher?.name || pick(teacher?.name, teacher?.name_ar) || "Home";
  const isActive = (path: string) => location.pathname === `/${slug}${path}`;

  const navLinks = [
    { to: "", icon: Home, label: lang === "ar" ? "الرئيسية" : "Home" },
    { to: "/courses", icon: BookOpen, label: lang === "ar" ? "الكورسات" : "Courses" },
    { to: "/stages", icon: GraduationCap, label: lang === "ar" ? "المراحل" : "Stages" },
    { to: "/subjects", icon: Layers, label: lang === "ar" ? "المواد" : "Subjects" },
    { to: "/dashboard", icon: User, label: lang === "ar" ? "لوحتي" : "Dashboard" },
  ];

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to={`/${slug}`} className="flex items-center gap-2 group">
            <div className="size-10 rounded-full bg-brand grid place-items-center font-black text-brand-foreground shadow-soft group-hover:rotate-12 transition-transform duration-500">
              {teacherName.charAt(0).toUpperCase()}
            </div>
            <span className="font-extrabold text-base hidden sm:block">{teacherName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={`/${slug}${link.to}`}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="size-10 rounded-full bg-card border grid place-items-center hover:bg-muted transition hover-lift"
              title={lang === "ar" ? "English" : "العربية"}
            >
              <span className="text-sm font-bold">{lang === "ar" ? "EN" : "AR"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="size-10 rounded-full bg-card border grid place-items-center hover:bg-muted transition hover-lift"
            >
              <span className="text-sm font-bold">{theme === "default" ? "🌿" : "🎨"}</span>
            </button>

            {/* Auth Buttons */}
            <Link to={`/${slug}/login`} className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-soft text-sm font-bold hover-lift">
              <LogIn className="size-4" />
              <span>{lang === "ar" ? "تسجيل الدخول" : "Login"}</span>
            </Link>
            <Link to={`/${slug}/register`} className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-soft hover-lift">
              <UserPlus className="size-4" />
              <span>{lang === "ar" ? "إنشاء حساب" : "Sign Up"}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={() => setOpen(!open)} className="lg:hidden size-10 rounded-full bg-card border grid place-items-center">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t border-border/60 bg-background animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={`/${slug}${link.to}`}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive(link.to) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to={`/${slug}/login`} onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl bg-card border text-sm font-bold text-center">
                  {lang === "ar" ? "تسجيل الدخول" : "Login"}
                </Link>
                <Link to={`/${slug}/register`} onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center">
                  {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-12">
        <div className="container mx-auto px-4 text-center space-y-3">
          <div className="size-14 mx-auto rounded-full bg-brand grid place-items-center text-brand-foreground font-black text-xl animate-float-slow">
            {teacherName.charAt(0).toUpperCase()}
          </div>
          <h4 className="font-extrabold text-lg">{teacherName}</h4>
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </p>
        </div>
      </footer>
    </>
  );
}