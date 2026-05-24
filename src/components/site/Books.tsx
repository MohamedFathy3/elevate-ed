import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { BookOpen, FileText } from "lucide-react";

export const Books = () => {
  const { lang } = useLang();
  const { teacher, pick } = useTeacher();
  const books = teacher.website.books;

  return (
    <section id="books" className="py-24 md:py-32 relative">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-5"
          >
            <BookOpen className="w-4 h-4" />
            {lang === "ar" ? "الكتب" : "Books"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            <span className="text-gradient-rainbow">
              {lang === "ar" ? "كتبنا المطبوعة" : "Our printed books"}
            </span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {books.map((b, i) => (
            <motion.article
              key={b.id}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -10, rotate: -1 }}
              className="group relative bg-card rounded-3xl p-6 shadow-card hover:shadow-elegant transition-shadow"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-secondary">
                <img
                  src={b.imageUrl}
                  alt={pick(b.title, b.title_ar)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-foreground text-xs font-bold inline-flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {b.pages_count} {lang === "ar" ? "صفحة" : "pages"}
                </div>
              </div>
              <h3 className="font-bold text-lg leading-snug">{pick(b.title, b.title_ar)}</h3>
              <p className="mt-1 text-sm text-foreground/60">
                {lang === "ar" ? "تأليف" : "by"} {pick(b.writer, b.writer_ar)}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black">{b.price}</div>
                  <div className="text-[10px] text-foreground/50 font-medium">EGP</div>
                </div>
                <button className="px-4 py-2.5 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95">
                  {lang === "ar" ? "اشتري الآن" : "Buy now"}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
