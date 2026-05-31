// components/site/Books.tsx
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import { BookOpen, FileText, Leaf, Flower2, BookMarked } from "lucide-react";

export const Books = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { teacher, pick, isLoading } = useSafeTeacher();
  
  const isNature = theme === 'nature';
  const books = teacher?.website?.books || [];

  if (isLoading) {
    return <BooksSkeleton isNature={isNature} />;
  }

  if (!books.length) {
    return null;
  }

  return (
    <section id="books" className={`py-24 md:py-32 relative ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5
              ${isNature 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-accent/10 text-accent'}`}
          >
            {isNature ? <Leaf className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            {lang === "ar" ? "الكتب" : "Books"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight"
          >
            <span className={isNature ? 'text-emerald-600' : 'text-gradient-rainbow'}>
              {lang === "ar" ? "كتبنا المطبوعة" : "Our printed books"}
            </span>
          </motion.h2>
          {isNature && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-muted-foreground"
            >
              {lang === "ar" 
                ? "استمتع بقراءة كتبنا المصممة خصيصاً لمسيرتك التعليمية" 
                : "Enjoy reading our books designed for your educational journey"}
            </motion.p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {books.map((b, i) => (
            <motion.article
              key={b.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative rounded-3xl p-6 transition-all
                ${isNature 
                  ? 'bg-white border border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-300' 
                  : 'bg-card shadow-card hover:shadow-elegant'}`}
            >
              <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden mb-5
                ${isNature ? 'bg-emerald-50' : 'bg-secondary'}`}>
                <img
                  src={b.imageUrl || b.image?.fullUrl || "/default-book.jpg"}
                  alt={pick(b.title, b.title_ar) || "Book"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-book.jpg";
                  }}
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                  ${isNature 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white/95 text-foreground'}`}>
                  <FileText className="w-3 h-3" />
                  {b.pages_count || 0} {lang === "ar" ? "صفحة" : "pages"}
                </div>
                {isNature && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-white/90 text-emerald-600 text-xs font-bold">
                    <BookMarked className="w-3 h-3 inline mr-1" />
                    {lang === "ar" ? "كتاب" : "Book"}
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-lg leading-snug ${isNature ? 'text-emerald-800' : ''}`}>
                {pick(b.title, b.title_ar) || "Book Title"}
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                {lang === "ar" ? "تأليف" : "by"} {pick(b.writer, b.writer_ar) || "Author"}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-black ${isNature ? 'text-emerald-600' : ''}`}>
                    {b.price || "0"}
                  </div>
                  <div className="text-[10px] text-foreground/50 font-medium">EGP</div>
                </div>
                <button className={`px-4 py-2.5 rounded-2xl text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95
                  ${isNature 
                    ? 'bg-emerald-600 shadow-md hover:bg-emerald-700 hover:shadow-lg' 
                    : 'gradient-primary shadow-soft hover:shadow-glow'}`}>
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

// Skeleton Component
const BooksSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <section className={`py-24 md:py-32 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="text-center mb-14">
          <div className={`h-8 w-32 rounded-full mx-auto mb-5 animate-pulse 
            ${isNature ? 'bg-emerald-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-12 w-64 rounded-lg mx-auto animate-pulse 
            ${isNature ? 'bg-emerald-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-3xl p-6 animate-pulse
              ${isNature ? 'bg-white border border-emerald-200' : 'bg-card'}`}>
              <div className={`aspect-[3/4] rounded-2xl mb-5 animate-pulse
                ${isNature ? 'bg-emerald-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-6 rounded-lg mb-2 w-3/4 animate-pulse
                ${isNature ? 'bg-emerald-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg w-1/2 animate-pulse
                ${isNature ? 'bg-emerald-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};