import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  const { t } = useLang();

  const cols = [
    {
      title: t("footer.product"),
      links: [t("nav.courses"), t("nav.features"), t("nav.cta")],
    },
    {
      title: t("footer.company"),
      links: [t("nav.about"), t("nav.contact"), "Blog"],
    },
    {
      title: t("footer.legal"),
      links: ["Privacy", "Terms", "Cookies"],
    },
  ];

  const socials = [Twitter, Github, Linkedin, Instagram];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="border-t border-border py-16"
    >
      <div className="container-tight">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <a href="#" className="flex items-center gap-2 font-display font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-foreground text-background grid place-items-center text-sm">L</span>
              Lumen
            </a>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">{t("footer.tag")}</p>
            <div className="mt-5 flex gap-2">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full grid place-items-center border border-border hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Lumen. {t("footer.rights")}</div>
          <div>Crafted with care.</div>
        </div>
      </div>
    </motion.footer>
  );
};
