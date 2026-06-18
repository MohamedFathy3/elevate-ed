// src/themes/nature/pages/Landing.tsx (أو TeacherHome.tsx)
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserPlus, MapPin, BookOpen, Trophy, Sparkles, ClipboardCheck, MessageCircle, ArrowLeft, ArrowRight, Gift, Calendar, Clock, Atom } from "lucide-react";
import heroTeacher from "@/assets/hero-teacher.png";
import giftsImg from "@/assets/gifts.png";
import { useTeacher } from "@/context/TeacherContext";
import { useLang } from "@/i18n/LanguageContext";
import { About } from "@/themes/default/components/site/About";
import  Hero  from "@/themes/nature/components/Hero";
import { Books } from "@/themes/default/components/site/Books";
import { Stage } from "@/themes/default/components/site/Stage";
import { Courses } from "@/themes/default/components/site/Courses";
import { CenterHours } from "@/themes/default/components/site/CenterHours";
import { OfferPopup } from "@/themes/default/components/site/OfferPopup";

// const Hero = () => {
//   const { teacher, home, pick } = useTeacher();
//   const { lang } = useLang();
//   const { slug } = useParams();
  
//   const teacherName = teacher?.name || pick(teacher?.name, teacher?.name_ar) || "المعلم";
//   const title = pick(home?.title, home?.title_ar) || "";
//   const subTitle = pick(home?.sub_title, home?.sub_title_ar) || "";
//   const description = pick(home?.description, home?.description_ar) || "";
//   const imageUrl = home?.image?.fullUrl || home?.imageUrl || heroTeacher;

//   return (
//     <section className="relative overflow-hidden bg-gradient-hero pt-28 pb-40">
//       <svg className="absolute -left-10 top-20 w-[420px] opacity-70 rotate-12" viewBox="0 0 400 200" fill="none">
//         <path d="M0 100 Q 50 0, 100 100 T 200 100 T 300 100 T 400 100" stroke="oklch(0.6 0.2 5)" strokeWidth="2" strokeDasharray="3 6" />
//       </svg>

//       <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
//         <div className="text-center lg:text-right order-2 lg:order-1">
//           <h1 className="font-black leading-[1.05] tracking-tight">
//             {title && <span className="block text-5xl md:text-6xl text-foreground animate-fade-up">{title}</span>}
//             {/* <span className="block text-7xl md:text-8xl text-brand drop-shadow-[0_4px_0_oklch(0.65_0.18_60)] animate-fade-up delay-100">
//               {teacherName}
//             </span> */}
//           </h1>
//           {(subTitle) && (
//             <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up delay-200">
//               {subTitle}
//             </p>
//           )}
// {( description) && (
//             <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up delay-200">
//               { description}
//             </p>
//           )}
//           <div className="mt-8 flex flex-col items-center lg:items-start gap-3 animate-fade-up delay-300">
//             <Link to={`/${slug}/register`} className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand text-brand-foreground font-extrabold text-lg shadow-soft hover-lift">
//               <UserPlus className="size-5" />
//               {lang === "ar" ? "انضم لينا الآن" : "Join Now"}
//             </Link>
//             <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
//               <a href={`/${slug}/center-hours`} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border shadow-card font-bold text-sm hover-lift">
//   <MapPin className="size-4 text-primary" /> 
//   {lang === "ar" ? "مواعيد السناتر" : "Center Hours"}
// </a>
//               <a href="#books" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border shadow-card font-bold text-sm hover-lift">
//                 <BookOpen className="size-4 text-primary" /> {lang === "ar" ? "أماكن الكتب" : "Book Locations"}
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="relative order-1 lg:order-2 flex justify-center animate-scale-in">
//           <div className="absolute inset-0 bg-sun blur-2xl animate-pulse-glow" aria-hidden />
//           <img src={imageUrl} alt={teacherName} width={1024} height={1024} className="relative w-[88%] max-w-[520px] drop-shadow-2xl animate-float" />
//         </div>
//       </div>

//       <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none" aria-hidden>
//         <svg className="absolute bottom-0 inset-x-0 w-full h-20" viewBox="0 0 1200 80" preserveAspectRatio="none">
//           <defs>
//             <g id="blade-a"><path d="M0 80 L4 8 L8 80 Z" fill="oklch(0.55 0.2 145)" /></g>
//             <g id="blade-b"><path d="M0 80 L5 16 L10 80 Z" fill="oklch(0.65 0.2 140)" /></g>
//           </defs>
//           {Array.from({ length: 80 }).map((_, i) => (
//             <g key={`a${i}`} style={{ transformOrigin: `${i * 15 + 4}px 80px`, animation: `grass-sway ${2.6 + (i % 5) * 0.4}s ease-in-out ${(i % 7) * -0.3}s infinite` }}>
//               <use href="#blade-a" x={i * 15} />
//             </g>
//           ))}
//           {Array.from({ length: 80 }).map((_, i) => (
//             <g key={`b${i}`} style={{ transformOrigin: `${i * 15 + 9}px 80px`, animation: `grass-sway ${3 + (i % 4) * 0.5}s ease-in-out ${(i % 6) * -0.4 - 0.2}s infinite` }}>
//               <use href="#blade-b" x={i * 15 + 5} />
//             </g>
//           ))}
//         </svg>
//       </div>
//     </section>
//   );
// };





// مكون Courses - بيستخدم الكورسات من API


// الـ TeacherHome الرئيسي
const TeacherHome = () => {
  const { isLoading, teacher } = useTeacher();
    const { lang } = useLang();
  const [showPopup, setShowPopup] = useState(true);

  
  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">لم يتم العثور على المعلم</h1>
          <p className="text-muted-foreground">الرجاء التأكد من الرابط</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
          {showPopup && (
        <OfferPopup 
          lang={lang} 
          onClose={() => setShowPopup(false)} 
        />
      )}
        <Hero />
         <Stage />


        <Courses />
        <CenterHours />
        <Books />
 <About />
      </main>
    </div>
  );
};
export default TeacherHome;