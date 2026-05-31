export type CourseDef = {
  id: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  stageId: string;
  subjectId: string;
  start: { ar: string; en: string };
  end: { ar: string; en: string };
  price: number;
  oldPrice?: number;
  lessons: number;
  students: number;
  rating: number;
  tag?: { ar: string; en: string };
};

export const stages = [
  { id: "prep2", title: { ar: "الصف الثاني الإعدادي", en: "Grade 8 (Prep 2)" }, sub: { ar: "Science", en: "Science" }, color: "from-rose-200 to-rose-100 dark:from-rose-900/40 dark:to-rose-800/20" },
  { id: "prep3", title: { ar: "الصف الثالث الإعدادي", en: "Grade 9 (Prep 3)" }, sub: { ar: "Science", en: "Science" }, color: "from-amber-200 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/20" },
  { id: "sec1", title: { ar: "الصف الأول الثانوي", en: "Grade 10 (Sec 1)" }, sub: { ar: "Integrated Science", en: "Integrated Science" }, color: "from-emerald-200 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/20" },
];

export const subjects = [
  { id: "science", title: { ar: "Science", en: "Science" }, desc: { ar: "علوم متكاملة بأسلوب مبسّط", en: "Integrated science the simple way" }, icon: "🧪" },
  { id: "biology", title: { ar: "Biology", en: "Biology" }, desc: { ar: "أحياء بطريقة تفاعلية", en: "Biology with real-world examples" }, icon: "🧬" },
  { id: "chemistry", title: { ar: "Chemistry", en: "Chemistry" }, desc: { ar: "كيمياء بتفصيل ووضوح", en: "Chemistry clear and step-by-step" }, icon: "⚗️" },
  { id: "physics", title: { ar: "Physics", en: "Physics" }, desc: { ar: "فيزياء بأمثلة من الواقع", en: "Physics through real examples" }, icon: "🔭" },
];

export const courses: CourseDef[] = [
  {
    id: "term2-prep2",
    title: { ar: "كورس الترم الثاني — الصف الثاني الإعدادي", en: "Term 2 Course — Grade 8" },
    desc: { ar: "كل أسبوع هينزل ليك حصة جديدة", en: "A new lesson drops every week" },
    stageId: "prep2", subjectId: "science",
    start: { ar: "٢١ فبراير ٢٠٢٦", en: "Feb 21, 2026" },
    end: { ar: "٣٠ مايو ٢٠٢٦", en: "May 30, 2026" },
    price: 100, oldPrice: 120, lessons: 16, students: 842, rating: 4.9,
    tag: { ar: "الأكثر طلباً", en: "BEST" },
  },
  {
    id: "term2-prep3",
    title: { ar: "كورس الترم الثاني — الصف الثالث الإعدادي", en: "Term 2 Course — Grade 9" },
    desc: { ar: "كل أسبوع هينزلك الحصة الجديدة", en: "Weekly fresh lessons" },
    stageId: "prep3", subjectId: "science",
    start: { ar: "١٠ فبراير ٢٠٢٦", en: "Feb 10, 2026" },
    end: { ar: "٢٥ مايو ٢٠٢٦", en: "May 25, 2026" },
    price: 100, lessons: 18, students: 612, rating: 4.8,
    tag: { ar: "جديد", en: "NEW" },
  },
  {
    id: "final-sec1",
    title: { ar: "امتحان شامل — أولى ثانوي", en: "Final Mock Exam — Grade 10" },
    desc: { ar: "امتحان شامل لمنهج الترم كاملاً", en: "Full-term comprehensive mock exam" },
    stageId: "sec1", subjectId: "science",
    start: { ar: "٦ أبريل ٢٠٢٦", en: "Apr 6, 2026" },
    end: { ar: "٢٢ أبريل ٢٠٢٦", en: "Apr 22, 2026" },
    price: 30, oldPrice: 30, lessons: 4, students: 410, rating: 4.95,
    tag: { ar: "خصم", en: "SALE" },
  },
  {
    id: "biology-sec1",
    title: { ar: "أساسيات الـ Biology — أولى ثانوي", en: "Biology Essentials — Grade 10" },
    desc: { ar: "ابدأ بقوة في الـ biology", en: "Kick-start biology with confidence" },
    stageId: "sec1", subjectId: "biology",
    start: { ar: "١ مارس ٢٠٢٦", en: "Mar 1, 2026" },
    end: { ar: "١٥ يونيو ٢٠٢٦", en: "Jun 15, 2026" },
    price: 150, lessons: 20, students: 250, rating: 4.7,
  },
  {
    id: "chem-prep3",
    title: { ar: "Chemistry بسيطة — الثالث الإعدادي", en: "Easy Chemistry — Grade 9" },
    desc: { ar: "شرح مبسط وأمثلة تطبيقية", en: "Simple explanations + hands-on examples" },
    stageId: "prep3", subjectId: "chemistry",
    start: { ar: "١٨ فبراير ٢٠٢٦", en: "Feb 18, 2026" },
    end: { ar: "٢٠ مايو ٢٠٢٦", en: "May 20, 2026" },
    price: 80, lessons: 12, students: 320, rating: 4.6,
  },
  {
    id: "physics-sec1",
    title: { ar: "Physics للمبتدئين — أولى ثانوي", en: "Physics for Beginners — Grade 10" },
    desc: { ar: "فهم عميق للمفاهيم الأساسية", en: "Deep understanding of core concepts" },
    stageId: "sec1", subjectId: "physics",
    start: { ar: "٥ مارس ٢٠٢٦", en: "Mar 5, 2026" },
    end: { ar: "١٠ يونيو ٢٠٢٦", en: "Jun 10, 2026" },
    price: 120, oldPrice: 160, lessons: 22, students: 198, rating: 4.85,
    tag: { ar: "خصم", en: "SALE" },
  },
];
