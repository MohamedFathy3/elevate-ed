import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { CourseCard } from "@/components/site/Courses";
import { Search, BookOpen } from "lucide-react";

const CoursesPage = () => {
  const { lang } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<string>("all");

  const levels = useMemo(() => {
    const set = new Set<string>();
    teacher.website.courses.forEach((c) => set.add(c.level));
    return ["all", ...Array.from(set)];
  }, [teacher]);

  const filtered = teacher.website.courses.filter((c) => {
    const matchesQ =
      !q ||
      pick(c.title, c.title_ar).toLowerCase().includes(q.toLowerCase()) ||
      pick(c.description, c.description_ar).toLowerCase().includes(q.toLowerCase());
    const matchesL = level === "all" || c.level === level;
    return matchesQ && matchesL;
  });

  return (
    <section className="pt-36 md:pt-40 pb-24 min-h-screen">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-5">
            <BookOpen className="w-4 h-4" />
            {lang === "ar" ? "كل الكورسات" : "All Courses"}
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl tracking-tight">
            <span className="text-gradient-rainbow">
              {lang === "ar" ? "اختار كورسك" : "Pick your course"}
            </span>
          </h1>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-3 mb-10 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-4 h-4 text-foreground/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "ar" ? "ابحث في الكورسات..." : "Search courses..."}
              className="w-full bg-card border border-border rounded-2xl pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  level === l
                    ? "gradient-primary text-white border-transparent shadow-soft"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                {l === "all" ? (lang === "ar" ? "الكل" : "All") : l}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-foreground/60">
            {lang === "ar" ? "مفيش نتائج" : "No results found"}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((c, i) => (
              <CourseCard key={c.id} c={c} index={i} slug={slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesPage;
