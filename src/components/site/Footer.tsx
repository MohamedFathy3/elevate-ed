import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, Facebook, Youtube, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { lang } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const f = teacher.website.footer;

  const socials = [
    { Icon: Facebook, href: f.facebook_link },
    { Icon: Youtube, href: f.youtube_link },
    { Icon: Instagram, href: f.instagram_link },
    { Icon: MessageCircle, href: f.whatsapp_link },
  ];

  return (
    <footer id="contact" className="relative pt-24 pb-10">
      <div className="container-tight">
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
              {lang === "ar" ? "ابدأ رحلتك دلوقتي" : "Start your journey today"}
            </h3>
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-xl mx-auto">
              {pick(f.description, f.description_ar)}
            </p>
            <Link
              to={`/${slug}/register`}
              className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-primary font-bold shadow-glow hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <Zap className="w-5 h-5" fill="currentColor" />
              {lang === "ar" ? "إنشاء حساب" : "Create Account"}
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-10 pb-10 border-b border-border">
          <div>
            <Link to={`/${slug}`} className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-bold">{pick(f.name, f.name_ar)}</span>
            </Link>
            <p className="text-sm text-foreground/60 max-w-xs">{pick(f.description, f.description_ar)}</p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-card border border-border grid place-items-center hover:gradient-primary hover:text-white hover:border-transparent transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-3 text-sm">
              {[
                { l: lang === "ar" ? "الرئيسية" : "Home", h: `/${slug}` },
                { l: lang === "ar" ? "الكورسات" : "Courses", h: `/${slug}/courses` },
                { l: lang === "ar" ? "تسجيل دخول" : "Login", h: `/${slug}/login` },
                { l: lang === "ar" ? "إنشاء حساب" : "Register", h: `/${slug}/register` },
              ].map((x, i) => (
                <li key={i}>
                  <Link to={x.h} className="text-foreground/65 hover:text-primary transition-colors">
                    {x.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{lang === "ar" ? "تواصل" : "Contact"}</h4>
            <ul className="space-y-3 text-sm text-foreground/65">
              <li>{f.email}</li>
              <li>{f.phone}</li>
              <li>{pick(f.address, f.address_ar)}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} {pick(f.name, f.name_ar)}. {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
};
