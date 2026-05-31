import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TEACHERS } from "@/data/teachers";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/themes/default/components/site/ThemeProvider";
import { Zap, ArrowRight, Sun, Moon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const Landing = () => {
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();

  return (
    <section className="min-h-screen flex items-center justify-center p-6 relative">
   
    </section>
  );
};

export default Landing;
