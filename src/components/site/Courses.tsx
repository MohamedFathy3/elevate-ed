import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, ArrowLeft, Clock, Star } from "lucide-react";
import c1 from "@/assets/course-1.jpg";
import c2 from "@/assets/course-2.jpg";
import c3 from "@/assets/course-3.jpg";
import c4 from "@/assets/course-4.jpg";

interface Course {
  img: string;
  title: string;
  body: string;
  tag: string;
  duration: string;
  rating: string;
  num: string;
}

const CourseCard = ({ c, index }: { c: Course; index: number }) => {
  const { t, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 250, damping: 25 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 250, damping: 25 });
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400, transformStyle: "preserve-3d" }}
      className="group relative cursor-pointer"
    >
      {/* Course number */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs font-mono tracking-widest text-muted-foreground">{c.num}</span>
        <span className="text-xs font-mono tracking-widest text-muted-foreground">{c.tag}</span>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl bg-secondary aspect-[16/11]">
        <motion.div
          style={{ x: imgX, y: imgY, scale: 1.1 }}
          className="absolute inset-0"
        >
          <img
            src={c.img}
            alt={c.title}
            loading="lazy"
            width={800}
            height={550}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </motion.div>

        {/* Dark overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-foreground/40"
        />

        {/* Center reveal CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 grid place-items-center"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background text-foreground font-medium text-sm shadow-elegant">
            {t("courses.cta")}
            <Arrow className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Stat chips top */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-medium">
            <Star className="w-3 h-3 fill-accent text-accent" strokeWidth={0} />
            {c.rating}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            {c.duration}
          </div>
        </div>

        {/* Bottom shine sweep */}
        <motion.div
          initial={{ x: "-150%" }}
          animate={{ x: hovered ? "150%" : "-150%" }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-background/30 to-transparent skew-x-12 pointer-events-none"
        />
      </div>

      {/* Text */}
      <div className="mt-6 px-1" style={{ transform: "translateZ(20px)" }}>
        <h3 className="font-display font-semibold text-2xl md:text-3xl tracking-tight leading-tight group-hover:text-accent transition-colors duration-500">
          {c.title}
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">{c.body}</p>

        <div className="mt-5 flex items-center gap-2 text-sm font-medium">
          <span className="relative inline-flex items-center">
            {t("courses.cta")}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-500" />
          </span>
          <Arrow className="w-4 h-4 transition-all duration-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2" />
        </div>
      </div>
    </motion.article>
  );
};

export const Courses = () => {
  const { t } = useLang();

  const courses: Course[] = [
    { img: c1, title: t("c1.title"), body: t("c1.body"), tag: "DEVELOPMENT", duration: "12h", rating: "4.9", num: "— 01" },
    { img: c2, title: t("c2.title"), body: t("c2.body"), tag: "DESIGN", duration: "8h", rating: "4.8", num: "— 02" },
    { img: c3, title: t("c3.title"), body: t("c3.body"), tag: "AI / DATA", duration: "16h", rating: "4.9", num: "— 03" },
    { img: c4, title: t("c4.title"), body: t("c4.body"), tag: "MARKETING", duration: "10h", rating: "4.7", num: "— 04" },
  ];

  const headline = t("courses.title");
  const words = headline.split(" ");

  return (
    <section id="courses" className="py-28 md:py-40 relative overflow-hidden">
      {/* Background ornamental text */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.04 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute -top-10 left-0 right-0 text-center font-display font-black text-[180px] md:text-[260px] leading-none tracking-tighter pointer-events-none select-none"
      >
        COURSES
      </motion.div>

      <div className="container-tight relative">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-foreground" />
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">
              {t("courses.eyebrow")}
            </span>
            <span className="w-8 h-px bg-foreground" />
          </motion.div>

          <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight text-balance leading-[1.05] max-w-3xl mx-auto">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="inline-block mr-[0.25em] rtl:mr-0 rtl:ml-[0.25em]"
              >
                {i === words.length - 1 ? (
                  <span className="italic font-light text-muted-foreground/70">{w}</span>
                ) : (
                  w
                )}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto"
          >
            {t("courses.subtitle")}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-10 md:gap-12">
          {courses.map((c, i) => (
            <CourseCard key={i} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
