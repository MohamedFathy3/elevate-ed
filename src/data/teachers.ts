// Mock multi-tenant teachers data, shaped like the LMS API.
// Each teacher is keyed by `sub_domain` (slug).

export interface ImageObj {
  fullUrl: string;
}
export interface HomeSection {
  title: string;
  title_ar: string;
  sub_title: string;
  sub_title_ar: string;
  description: string;
  description_ar: string;
  imageUrl: string;
}
export interface FeatureItem {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  imageUrl: string;
}
export interface StageItem {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  imageUrl: string;
}
export interface FutureItem {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  imageUrl: string;
}
export interface CourseItem {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  price: string;
  duration_days: number;
  level: string;
  level_ar: string;
  subject: string;
  subject_ar: string;
  imageUrl: string;
  // optional rich content
  lessons?: { id: number; title: string; title_ar: string; duration: string }[];
}
export interface BookItem {
  id: number;
  title: string;
  title_ar: string;
  writer: string;
  writer_ar: string;
  price: string;
  pages_count: number;
  imageUrl: string;
}
export interface AboutSection {
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  stats: { value: number; suffix: string; label: string; label_ar: string }[];
  imageUrl: string;
}
export interface FooterSection {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  facebook_link: string;
  youtube_link: string;
  instagram_link: string;
  tiktok_link: string;
  whatsapp_link: string;
  email: string;
  phone: string;
  address: string;
  address_ar: string;
}

export interface Teacher {
  id: number;
  name: string;
  name_ar: string;
  email: string;
  sub_domain: string;
  phone: string;
  active: boolean;
  brand: { logoText: string; logoText_ar: string };
  website: {
    home: HomeSection;
    features: FeatureItem[];
    stages: StageItem[];
    future: FutureItem[];
    courses: CourseItem[];
    books: BookItem[];
    about: AboutSection;
    footer: FooterSection;
  };
}

const teacherPortrait =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80";
const courseImg = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=80`;

export const TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Mr. Abdelmaseeh Isaac",
    name_ar: "مستر عبدالمسيح إسحاق",
    email: "abdelmaseeh@volt.com",
    sub_domain: "abdelmaseeh",
    phone: "+20 100 000 0000",
    active: true,
    brand: { logoText: "Volt Physics", logoText_ar: "فولت فيزياء" },
    website: {
      home: {
        title: "Volt Physics Platform",
        title_ar: "منصة فولت فيزياء",
        sub_title: "Master Physics, the right way",
        sub_title_ar: "اتقن الفيزياء بالطريقة الصحيحة",
        description:
          "An integrated platform to learn physics in a simple and enjoyable way. Everything you need — lessons, quizzes, books and direct support.",
        description_ar:
          "منصة متكاملة لتعلم الفيزياء بطريقة بسيطة وممتعة. كل اللي تحتاجه من شرح وتمارين وكتب ودعم مباشر.",
        imageUrl: teacherPortrait,
      },
      features: [
        { id: 1, name: "Simplified Explanations", name_ar: "شرح مبسّط", description: "Complex concepts broken down to memorable lessons.", description_ar: "مفاهيم معقدة مقسّمة لدروس سهلة الحفظ.", imageUrl: "" },
        { id: 2, name: "Practice & Quizzes", name_ar: "تمارين واختبارات", description: "Hundreds of questions to strengthen understanding.", description_ar: "مئات الأسئلة لتقوية فهمك للمادة.", imageUrl: "" },
        { id: 3, name: "Lifetime Updates", name_ar: "تحديثات مستمرة", description: "Continuously updated content with the latest curriculum.", description_ar: "محتوى متجدد دائمًا بناءً على أحدث المناهج.", imageUrl: "" },
        { id: 4, name: "Direct Support", name_ar: "دعم مباشر", description: "Ask anytime and get answers fast.", description_ar: "اسأل في أي وقت واحصل على إجابات سريعة.", imageUrl: "" },
      ],
      stages: [
        { id: 1, name: "1st Secondary", name_ar: "الصف الأول الثانوي", description: "Foundation year — build the base of physics.", description_ar: "سنة الأساس — هنبني معاك أساس الفيزياء.", imageUrl: "" },
        { id: 2, name: "2nd Secondary", name_ar: "الصف الثاني الثانوي", description: "Optics, electricity and modern physics.", description_ar: "البصريات والكهرباء والفيزياء الحديثة.", imageUrl: "" },
        { id: 3, name: "3rd Secondary", name_ar: "الصف الثالث الثانوي", description: "Full curriculum + intensive revisions.", description_ar: "المنهج كامل + مراجعات مكثفة.", imageUrl: "" },
      ],
      future: [
        { id: 1, title: "Live Sessions", title_ar: "حصص أونلاين مباشرة", description: "Coming soon — interactive live classes weekly.", description_ar: "قريبًا — حصص تفاعلية أسبوعية مباشرة.", imageUrl: "" },
        { id: 2, title: "AI Tutor", title_ar: "مدرس ذكاء اصطناعي", description: "Personalized AI tutor available 24/7.", description_ar: "مدرس ذكي شخصي متاح 24/7.", imageUrl: "" },
        { id: 3, title: "Mobile App", title_ar: "تطبيق الموبايل", description: "Native iOS & Android app on the way.", description_ar: "تطبيق أصلي لـ iOS و Android في الطريق.", imageUrl: "" },
      ],
      courses: [
        { id: 1, title: "Nanotechnology Applications", title_ar: "تطبيقات النانوتكنولوجي", description: "Understand the impact and importance of nanotech.", description_ar: "هنفهم تأثير النانوتكنولوجي وأهميتها ومفهومها.", price: "70.00", duration_days: 30, level: "1st Sec", level_ar: "أولى ثانوي", subject: "Physics", subject_ar: "فيزياء", imageUrl: courseImg("photo-1532187863486-abf9dbad1b69") },
        { id: 2, title: "Prism at minimum deviation", title_ar: "المنشور عند الزاوية الصغرى للانحراف", description: "One of the most important prism cases.", description_ar: "حالة من أهم حالات المنشور.", price: "70.00", duration_days: 30, level: "2nd Sec", level_ar: "ثانية ثانوي", subject: "Physics", subject_ar: "فيزياء", imageUrl: courseImg("photo-1451187580459-43490279c0fa") },
        { id: 3, title: "Optics revision homework", title_ar: "واجب مراجعة على البصريات", description: "Comprehensive revision to lock everything in.", description_ar: "مراجعة شاملة عشان تثبّت اللي اتعلمته.", price: "85.00", duration_days: 30, level: "3rd Sec", level_ar: "ثالثة ثانوي", subject: "Physics", subject_ar: "فيزياء", imageUrl: courseImg("photo-1635070041078-e363dbe005cb") },
        { id: 4, title: "Current & Ohm's Law", title_ar: "التيار الكهربي وقانون أوم", description: "Master one of the most important chapters.", description_ar: "أتقن واحد من أهم الفصول.", price: "75.00", duration_days: 30, level: "2nd Sec", level_ar: "ثانية ثانوي", subject: "Physics", subject_ar: "فيزياء", imageUrl: courseImg("photo-1567427017947-545c5f8d16ad") },
        { id: 5, title: "Modern Physics Intro", title_ar: "مقدمة الفيزياء الحديثة", description: "Quantum basics and photoelectric effect.", description_ar: "أساسيات الكم والتأثير الكهروضوئي.", price: "90.00", duration_days: 30, level: "3rd Sec", level_ar: "ثالثة ثانوي", subject: "Physics", subject_ar: "فيزياء", imageUrl: courseImg("photo-1502134249126-9f3755a50d78") },
        { id: 6, title: "Mechanics Fundamentals", title_ar: "أساسيات الميكانيكا", description: "Forces, motion and Newton's laws.", description_ar: "القوى والحركة وقوانين نيوتن.", price: "65.00", duration_days: 30, level: "1st Sec", level_ar: "أولى ثانوي", subject: "Physics", subject_ar: "فيزياء", imageUrl: courseImg("photo-1581093588401-fbb62a02f120") },
      ],
      books: [
        { id: 1, title: "Volt Physics — Full Curriculum", title_ar: "فولت فيزياء — المنهج الكامل", writer: "Abdelmaseeh Isaac", writer_ar: "عبدالمسيح إسحاق", price: "180.00", pages_count: 320, imageUrl: courseImg("photo-1544716278-ca5e3f4abd8c") },
        { id: 2, title: "Optics Workbook", title_ar: "كراسة البصريات", writer: "Abdelmaseeh Isaac", writer_ar: "عبدالمسيح إسحاق", price: "95.00", pages_count: 150, imageUrl: courseImg("photo-1543002588-bfa74002ed7e") },
        { id: 3, title: "Final Revision Pack", title_ar: "حزمة المراجعة النهائية", writer: "Abdelmaseeh Isaac", writer_ar: "عبدالمسيح إسحاق", price: "120.00", pages_count: 210, imageUrl: courseImg("photo-1497633762265-9d179a990aa6") },
      ],
      about: {
        title: "About Mr. Abdelmaseeh Isaac",
        title_ar: "عن مستر عبدالمسيح إسحاق",
        description:
          "Physics teacher with years of experience helping thousands of students fall in love with physics. Specialized in turning complex topics into simple, structured and exciting lessons.",
        description_ar:
          "مدرّس فيزياء بخبرة سنين ساعد آلاف الطلاب يحبوا الفيزياء. متخصص في تبسيط المواضيع المعقدة وتقديمها بشكل ممتع ومنظم.",
        stats: [
          { value: 12000, suffix: "+", label: "Students", label_ar: "طالب" },
          { value: 250, suffix: "+", label: "Lectures", label_ar: "محاضرة" },
          { value: 8, suffix: "+", label: "Years Teaching", label_ar: "سنة خبرة" },
          { value: 95, suffix: "%", label: "Success Rate", label_ar: "نسبة نجاح" },
        ],
        imageUrl: teacherPortrait,
      },
      footer: {
        name: "Volt Physics",
        name_ar: "فولت فيزياء",
        description: "Learn physics, the right way.",
        description_ar: "تعلّم الفيزياء بالطريقة الصحيحة.",
        facebook_link: "#",
        youtube_link: "#",
        instagram_link: "#",
        tiktok_link: "#",
        whatsapp_link: "#",
        email: "info@voltphysics.com",
        phone: "+20 100 000 0000",
        address: "Cairo, Egypt",
        address_ar: "القاهرة، مصر",
      },
    },
  },
  {
    id: 2,
    name: "Mr. Ahmed Hassan",
    name_ar: "مستر أحمد حسن",
    email: "ahmed@math.com",
    sub_domain: "ahmed",
    phone: "+20 111 000 0000",
    active: true,
    brand: { logoText: "Math Pro", logoText_ar: "ماث برو" },
    website: {
      home: {
        title: "Math Pro Academy",
        title_ar: "أكاديمية ماث برو",
        sub_title: "Mathematics made simple and powerful",
        sub_title_ar: "الرياضيات ببساطة وقوة",
        description:
          "Step-by-step math mastery from algebra to calculus, designed for high school excellence.",
        description_ar:
          "إتقان الرياضيات خطوة بخطوة من الجبر للتفاضل والتكامل، مصمم للتفوق في الثانوية.",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
      },
      features: [
        { id: 1, name: "Visual Math", name_ar: "رياضيات بصرية", description: "Graphs and animations for every concept.", description_ar: "رسوم وانميشن لكل مفهوم.", imageUrl: "" },
        { id: 2, name: "Past Papers", name_ar: "امتحانات سابقة", description: "Solved past papers with full explanations.", description_ar: "امتحانات سابقة محلولة بشرح كامل.", imageUrl: "" },
        { id: 3, name: "Live Q&A", name_ar: "أسئلة وأجوبة حية", description: "Weekly live Q&A sessions.", description_ar: "جلسات أسئلة وأجوبة أسبوعية.", imageUrl: "" },
        { id: 4, name: "Smart Tracking", name_ar: "متابعة ذكية", description: "Personal progress dashboard for every student.", description_ar: "لوحة متابعة شخصية لكل طالب.", imageUrl: "" },
      ],
      stages: [
        { id: 1, name: "1st Secondary", name_ar: "الصف الأول الثانوي", description: "Algebra & trigonometry foundations.", description_ar: "أساسيات الجبر وحساب المثلثات.", imageUrl: "" },
        { id: 2, name: "2nd Secondary", name_ar: "الصف الثاني الثانوي", description: "Geometry & advanced algebra.", description_ar: "الهندسة والجبر المتقدم.", imageUrl: "" },
        { id: 3, name: "3rd Secondary", name_ar: "الصف الثالث الثانوي", description: "Calculus & statistics intensive.", description_ar: "تفاضل وتكامل وإحصاء مكثف.", imageUrl: "" },
      ],
      future: [
        { id: 1, title: "Math Olympiad Track", title_ar: "مسار أولمبياد الرياضيات", description: "Special prep track for olympiad contestants.", description_ar: "مسار خاص لإعداد متسابقي الأولمبياد.", imageUrl: "" },
        { id: 2, title: "Parent Dashboard", title_ar: "لوحة ولي الأمر", description: "Real-time progress reports for parents.", description_ar: "تقارير تقدم مباشرة لأولياء الأمور.", imageUrl: "" },
      ],
      courses: [
        { id: 1, title: "Differential Calculus", title_ar: "التفاضل", description: "Complete differential calculus course.", description_ar: "كورس التفاضل كامل.", price: "100.00", duration_days: 45, level: "3rd Sec", level_ar: "ثالثة ثانوي", subject: "Math", subject_ar: "رياضة", imageUrl: courseImg("photo-1635070041078-e363dbe005cb") },
        { id: 2, title: "Integration Mastery", title_ar: "إتقان التكامل", description: "From basics to advanced integration.", description_ar: "من الأساسيات للتكامل المتقدم.", price: "100.00", duration_days: 45, level: "3rd Sec", level_ar: "ثالثة ثانوي", subject: "Math", subject_ar: "رياضة", imageUrl: courseImg("photo-1509228468518-180dd4864904") },
        { id: 3, title: "Trigonometry Deep Dive", title_ar: "حساب المثلثات بعمق", description: "All trig identities and applications.", description_ar: "كل متطابقات حساب المثلثات وتطبيقاتها.", price: "80.00", duration_days: 30, level: "1st Sec", level_ar: "أولى ثانوي", subject: "Math", subject_ar: "رياضة", imageUrl: courseImg("photo-1596495577886-d920f1fb7238") },
      ],
      books: [
        { id: 1, title: "Math Pro — Calculus Volume", title_ar: "ماث برو — مجلد التفاضل والتكامل", writer: "Ahmed Hassan", writer_ar: "أحمد حسن", price: "200.00", pages_count: 410, imageUrl: courseImg("photo-1543002588-bfa74002ed7e") },
      ],
      about: {
        title: "About Mr. Ahmed Hassan",
        title_ar: "عن مستر أحمد حسن",
        description:
          "Math teacher passionate about making mathematics intuitive and fun for every student level.",
        description_ar:
          "مدرّس رياضيات شغوف بجعل الرياضيات سهلة وممتعة لكل المستويات.",
        stats: [
          { value: 8500, suffix: "+", label: "Students", label_ar: "طالب" },
          { value: 180, suffix: "+", label: "Lectures", label_ar: "محاضرة" },
          { value: 10, suffix: "+", label: "Years Teaching", label_ar: "سنة خبرة" },
          { value: 92, suffix: "%", label: "Success Rate", label_ar: "نسبة نجاح" },
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
      },
      footer: {
        name: "Math Pro Academy",
        name_ar: "أكاديمية ماث برو",
        description: "Mathematics, simplified.",
        description_ar: "الرياضيات ببساطة.",
        facebook_link: "#",
        youtube_link: "#",
        instagram_link: "#",
        tiktok_link: "#",
        whatsapp_link: "#",
        email: "info@mathpro.com",
        phone: "+20 111 000 0000",
        address: "Alexandria, Egypt",
        address_ar: "الإسكندرية، مصر",
      },
    },
  },
];

export const getTeacherBySlug = (slug?: string): Teacher | undefined =>
  TEACHERS.find((t) => t.sub_domain === slug);
