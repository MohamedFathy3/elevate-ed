import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Zap, Facebook, Youtube, Instagram, MessageCircle } from "lucide-react";

export const Footer = () => {
  const { t, lang } = useLang();

  return (
    <footer id="contact" className="relative pt-24 pb-10">
      <div className="container-tight">
        {/* CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative gradient-primary rounded-[2.5rem] p-10 md:p-16 text-center text-white overflow-hidden shadow-elegant"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px, 40px 40px",
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/20"
          />

          <div className="relative">
            <h3 className="font-display font-black text-3xl md:text-5xl tracking-tight max-w-2xl mx-auto leading-tight">
              {lang === "ar" ? "ابدأ رحلتك في الفيزياء النهارده" : "Start your physics journey today"}
            </h3>
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-primary font-bold shadow-glow hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <Zap className="w-5 h-5" fill="currentColor" />
              {t("nav.signup")}
            </a>
          </div>
        </motion.div>

        {/* Footer links */}
        <div className="mt-16 grid md:grid-cols-3 gap-10 pb-10 border-b border-border">
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-bold">
                {lang === "ar" ? "مستر عبدالمسيح إسحاق" : "Mr. Abdelmaseeh Isaac"}
              </span>
            </a>
            <p className="text-sm text-foreground/60 max-w-xs">{t("footer.tag")}</p>
            <div className="mt-5 flex gap-2">
              {[Facebook, Youtube, Instagram, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border border-border grid place-items-center hover:gradient-primary hover:text-white hover:border-transparent transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.quick")}</h4>
            <ul className="space-y-3 text-sm">
              {[
                { l: t("nav.about"), h: "#about" },
                { l: t("nav.courses"), h: "#courses" },
                { l: t("nav.teacher"), h: "#teacher" },
              ].map((x, i) => (
                <li key={i}>
                  <a href={x.h} className="text-foreground/65 hover:text-primary transition-colors">
                    {x.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-foreground/65">
              <li>info@voltphysics.com</li>
              <li>+20 100 000 0000</li>
              <li>{lang === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} Volt Physics. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};
