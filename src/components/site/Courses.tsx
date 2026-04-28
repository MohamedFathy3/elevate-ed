import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, ArrowLeft } from "lucide-react";
import c1 from "@/assets/course-1.jpg";
import c2 from "@/assets/course-2.jpg";
import c3 from "@/assets/course-3.jpg";
import c4 from "@/assets/course-4.jpg";

export const Courses = () => {
  const { t, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const courses = [
    { img: c1, title: t("c1.title"), body: t("c1.body"), tag: "Development" },
    { img: c2, title: t("c2.title"), body: t("c2.body"), tag: "Design" },
    { img: c3, title: t("c3.title"), body: t("c3.body"), tag: "AI / Data" },
    { img: c4, title: t("c4.title"), body: t("c4.body"), tag: "Marketing" },
  ];

  return (
    <section id="courses" className="py-24 md:py-32">
      <div className="container-tight">
        <div className="flex items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {t("courses.eyebrow")}
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-balance">
              {t("courses.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("courses.subtitle")}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {courses.map((c, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[16/10]">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={800}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium">
                  {c.tag}
                </div>
              </div>
              <div className="mt-5 px-1">
                <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{c.body}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {t("courses.cta")}
                  <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
