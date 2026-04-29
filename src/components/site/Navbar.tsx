import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "./ThemeProvider";
import { Zap, ArrowRight, ArrowLeft, Menu, X, Sun, Moon } from "lucide-react";

export const Navbar = () => {
  const { t, lang, setLang, dir } = useLang();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: t("nav.about") },
    { href: "#courses", label: t("nav.courses") },
    { href: "#teacher", label: t("nav.teacher") },
    { href: "#contact", label: t("nav.contact") },
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
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shadow-soft">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-bold text-sm md:text-base hidden sm:block">
            {lang === "ar" ? "مستر عبدالمسيح" : "Mr. Abdelmaseeh"}
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-4 py-2 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.9, rotate: 180 }}
            aria-label="Toggle theme"
            className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/40 transition-colors overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <Sun className="w-4 h-4 text-accent" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
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
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {t("nav.login")}
            <Arrow className="w-3.5 h-3.5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all hover:scale-[1.03] active:scale-95"
          >
            <Zap className="w-4 h-4" fill="white" />
            <span className="hidden sm:inline">{t("nav.signup")}</span>
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full bg-card border border-border"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden max-w-7xl mx-auto mt-2 glass rounded-3xl p-4 shadow-card"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-primary/5 text-sm font-medium"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
};
