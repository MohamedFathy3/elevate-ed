import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

export const Marquee = () => {
  const { lang } = useLang();
  const items = lang === "ar"
    ? ["تطوير", "تصميم", "ذكاء اصطناعي", "تسويق", "أعمال", "بيانات", "تصوير", "كتابة"]
    : ["Development", "Design", "AI", "Marketing", "Business", "Data", "Photography", "Writing"];
  const loop = [...items, ...items, ...items];

  return (
    <div className="py-12 md:py-16 border-y border-border bg-background overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((it, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-display font-bold text-4xl md:text-6xl tracking-tight text-foreground/80 hover:text-accent transition-colors">
              {it}
            </span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
