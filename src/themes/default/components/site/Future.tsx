import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { Rocket, Star } from "lucide-react";

export const Future = () => {
  const { lang } = useLang();
  const { teacher, pick } = useTeacher();

  return (
    <section id="future" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-5"
          >
            <Rocket className="w-4 h-4" />
            {lang === "ar" ? "المستقبل" : "Coming Soon"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            <span className="text-gradient-rainbow">
              {lang === "ar" ? "اللي جاي أحلى" : "What's coming next"}
            </span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent hidden md:block" />

          <div className="space-y-10 md:space-y-16">
            {teacher.website.future.map((f, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: left ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7 }}
                  className={`md:grid md:grid-cols-2 md:gap-12 items-center ${
                    left ? "" : "md:[direction:rtl]"
                  }`}
                >
                  <div className={left ? "md:text-right rtl:md:text-left" : "md:text-left rtl:md:text-right [direction:ltr] rtl:[direction:rtl]"}>
                    <div className="inline-flex items-center gap-2 mb-3 text-accent font-semibold text-sm">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {lang === "ar" ? `مرحلة ${i + 1}` : `Phase ${i + 1}`}
                    </div>
                    <h3 className="font-display font-black text-2xl md:text-3xl mb-3">
                      {pick(f.title, f.title_ar)}
                    </h3>
                    <p className="text-foreground/65 leading-relaxed">
                      {pick(f.description, f.description_ar)}
                    </p>
                  </div>

                  <div className={`relative mt-6 md:mt-0 [direction:ltr] ${left ? "" : ""}`}>
                    <motion.div
                      whileHover={{ scale: 1.04, rotate: left ? -1 : 1 }}
                      className="relative aspect-video rounded-3xl bg-card border border-border shadow-card overflow-hidden p-8 grid place-items-center"
                    >
                      <div className="absolute inset-0 gradient-primary opacity-10" />
                      <Rocket className="w-20 h-20 text-primary relative z-10" strokeWidth={1.2} />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-2 border-primary/20"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
