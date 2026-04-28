import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export const Navbar = () => {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: t("nav.about") },
    { href: "#features", label: t("nav.features") },
    { href: "#courses", label: t("nav.courses") },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="container-tight flex items-center justify-between h-16 md:h-20">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-foreground text-background grid place-items-center text-sm">L</span>
          <span>Lumen</span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border hover:bg-secondary transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "العربية" : "English"}
          </button>
          <Button size="sm" className="rounded-full hidden sm:inline-flex">
            {t("nav.cta")}
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};
