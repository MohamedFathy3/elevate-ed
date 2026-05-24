import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "./ThemeProvider";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, ArrowRight, ArrowLeft, Menu, X, Sun, Moon } from "lucide-react";

export const Navbar = () => {
  const { lang, setLang, dir } = useLang();
  const { theme, toggle } = useTheme();
  const { teacher, slug, pick } = useTeacher();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const onHome = pathname === `/${slug}` || pathname === `/${slug}/`;
  const sectionLink = (hash: string) => (onHome ? `#${hash}` : `/${slug}#${hash}`);

  const links = [
    { href: sectionLink("stages"), label: lang === "ar" ? "المراحل" : "Stages" },
    { href: `/${slug}/courses`, label: lang === "ar" ? "الكورسات" : "Courses" },
    { href: sectionLink("books"), label: lang === "ar" ? "الكتب" : "Books" },
    { href: sectionLink("about"), label: lang === "ar" ? "عن المنصة" : "About" },
    { href: sectionLink("contact"), label: lang === "ar" ? "تواصل" : "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-3 md:top-5 inset-x-0 z-50 px-3 md:px-6"
    >
      <nav
        className={`max-w-7xl mx-auto rounded-full pl-3 pr-2 md:pl-5 md:pr-2 py-2 flex items-center justify-between gap-3 transition-all duration-300 ${
          scrolled ? "glass shadow-card" : "glass shadow-soft"
        }`}
      >
        <Link to={`/${slug}`} className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shadow-soft">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-bold text-sm md:text-base hidden sm:block">
            {pick(teacher.brand.logoText, teacher.brand.logoText_ar)}
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              {l.href.startsWith("/") ? (
                <Link
                  to={l.href}
                  className="px-4 py-2 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  className="px-4 py-2 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.9, rotate: 180 }}
            aria-label="Toggle theme"
            className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span key="sun" initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.3 }} className="absolute">
                  <Sun className="w-4 h-4 text-accent" />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.3 }} className="absolute">
                  <Moon className="w-4 h-4 text-primary" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="hidden sm:flex w-10 h-10 rounded-full bg-card border border-border items-center justify-center text-xs font-bold hover:border-primary/40 transition-colors"
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <Link
            to={`/${slug}/login`}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {lang === "ar" ? "تسجيل دخول" : "Login"}
            <Arrow className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/${slug}/register`}
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-[1.03] active:scale-95"
          >
            <Zap className="w-4 h-4" fill="white" />
            <span className="hidden sm:inline">{lang === "ar" ? "إنشاء حساب" : "Sign up"}</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full bg-card border border-border"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden max-w-7xl mx-auto mt-2 glass rounded-3xl p-4 shadow-card"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) =>
              l.href.startsWith("/") ? (
                <li key={l.href}>
                  <Link to={l.href} className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium">
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.href}>
                  <a href={l.href} className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium">
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
};
