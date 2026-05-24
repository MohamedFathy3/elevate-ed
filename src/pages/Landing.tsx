import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TEACHERS } from "@/data/teachers";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/components/site/ThemeProvider";
import { Zap, ArrowRight, Sun, Moon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const Landing = () => {
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();

  return (
    <section className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 flex gap-2 z-10">
        <motion.button
          onClick={toggle}
          whileTap={{ scale: 0.9, rotate: 180 }}
          className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.span key="sun" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                <Sun className="w-4 h-4 text-accent" />
              </motion.span>
            ) : (
              <motion.span key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                <Moon className="w-4 h-4 text-primary" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="w-10 h-10 rounded-full bg-card border border-border text-xs font-bold"
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6"
        >
          <Zap className="w-4 h-4" fill="currentColor" />
          {lang === "ar" ? "منصات المدرسين" : "Teachers Platforms"}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4"
        >
          <span className="text-gradient-rainbow">
            {lang === "ar" ? "اختار منصة المدرس" : "Pick a teacher platform"}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/65 text-lg max-w-xl mx-auto mb-12"
        >
          {lang === "ar"
            ? "كل مدرس عنده موقعه الخاص بـ slug مميز وبياناته الخاصة."
            : "Each teacher has their own slug-based site with private data."}
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto">
          {TEACHERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link
                to={`/${t.sub_domain}`}
                className="group relative block p-7 rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-all overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full gradient-primary opacity-10 group-hover:opacity-20 blur-2xl transition" />
                <div className="relative text-left rtl:text-right">
                  <div className="text-xs text-foreground/50 font-mono mb-1">/{t.sub_domain}</div>
                  <h3 className="font-display font-black text-2xl mb-1">
                    {lang === "ar" ? t.name_ar : t.name}
                  </h3>
                  <p className="text-sm text-foreground/65 mb-5">
                    {lang === "ar" ? t.brand.logoText_ar : t.brand.logoText}
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                    {lang === "ar" ? "ادخل المنصة" : "Visit platform"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Landing;
