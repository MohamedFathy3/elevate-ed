// /* eslint-disable @typescript-eslint/no-explicit-any */
// // pages/SemesterDetails.tsx
// import { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useLang } from "@/i18n/LanguageContext";
// import { useTeacher } from "@/context/TeacherContext";
// import { useSemesterCourses } from "@/hooks/useCourses";
// import { useStudentAuth } from "@/context/StudentAuthContext";
// import { useBuyCourse } from "@/hooks/useEnroll";
// import { motion } from "framer-motion";
// import { 
//   ArrowLeft, ArrowRight, BookOpen, Clock, Award, 
//   Users, Calendar, ChevronRight, Lock, Unlock,
//   PlayCircle, FileQuestion, ClipboardList, CheckCircle,
//   Loader2, GraduationCap, DollarSign, Percent, ShoppingCart,
//   Eye, XCircle
// } from "lucide-react";
// import { Link as RouterLink } from "react-router-dom";
// import { toast  } from "@/hooks/use-toast";

// const SemesterDetails = () => {
//   const { lang, dir } = useLang();
//   const { slug, semesterId } = useParams();
//   const { teacher, pick } = useTeacher();
//   const { isAuthenticated, student } = useStudentAuth();
//   const { data: coursesData, isLoading, refetch: refetchCourses } = useSemesterCourses(parseInt(semesterId || '0'));
//   const { buyCourse, isLoading: buying } = useBuyCourse();
//   const navigate = useNavigate();
  
//   const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
//   const semester = teacher?.website?.semesters?.find((s: any) => s.id === parseInt(semesterId || '0'));
//   const courses = coursesData?.data || [];
  
//   if (isLoading) {
//     return <SemesterSkeleton />;
//   }
  
//   return (
//     <div className="min-h-screen pt-32 pb-20">
//       <div className="container-tight">
//         {/* Breadcrumb */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 text-sm text-foreground/60 flex-wrap">
//             <Link to={``} className="hover:text-primary transition-colors">
//               {lang === "ar" ? "الرئيسية" : "Home"}
//             </Link>
//             <ChevronRight className="w-4 h-4" />
//             <Link to={`/semesters`} className="hover:text-primary transition-colors">
//               {lang === "ar" ? "الترمات" : "Semesters"}
//             </Link>
//             <ChevronRight className="w-4 h-4" />
//             <span className="text-foreground line-clamp-1">
//               {pick(semester?.name, semester?.name_ar)}
//             </span>
//           </div>
//         </div>
        
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl md:text-4xl font-black">
//             {pick(semester?.name, semester?.name_ar)}
//           </h1>
//           <p className="text-foreground/60 mt-2">
//             {lang === "ar" 
//               ? `استعرض جميع الكورسات المتاحة في ${pick(semester?.name, semester?.name_ar)}`
//               : `Browse all courses available in ${pick(semester?.name, semester?.name_ar)}`}
//           </p>
//         </motion.div>
        
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
//           <StatCard 
//             icon={<BookOpen className="w-5 h-5" />}
//             label={lang === "ar" ? "كورسات" : "Courses"}
//             value={courses.length}
//             color="from-blue-500 to-indigo-600"
//           />
//         </div>
        
//         {/* Courses List */}
//         {courses.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
//               <BookOpen className="w-12 h-12 text-foreground/30" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">
//               {lang === "ar" ? "لا توجد كورسات" : "No courses found"}
//             </h3>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {courses.map((course: any, idx: number) => (
//               <CourseSection
//                 key={course.id}
//                 course={course}
//                 index={idx}
//                 slug={slug!}
//                 lang={lang}
//                 pick={pick}
//                 isAuthenticated={isAuthenticated}
//                 studentId={student?.id}
//                 navigate={navigate}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // 🟢 Course Section Component
// const CourseSection = ({ course, index, slug, lang, pick, isAuthenticated, studentId, navigate }: any) => {
//   const [expanded, setExpanded] = useState(false);
//   const [buying, setBuying] = useState(false);
//   const { buyCourse } = useBuyCourse();
  
//   const courseTitle = pick(course.title, course.title_ar) || "Course";
//   const courseImage = course.image?.fullUrl || course.imageUrl || "/default-course.jpg";
//   const originalPrice = parseFloat(course.price) || 0;
//   const discount = parseFloat(course.discount) || 0;
//   const finalPrice = originalPrice - (originalPrice * discount / 100);
//   const hasDiscount = discount > 0;
//   const lessons = course.details || [];
//   const hasPurchased = isAuthenticated;
  
//   const handleBuyCourse = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!isAuthenticated) {
//       toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
//       setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
//       return;
//     }
    
//     setBuying(true);
//     try {
//       await buyCourse(course.id, finalPrice);
//       toast.success(lang === "ar" ? "تم شراء الكورس بنجاح!" : "Course purchased successfully!");
//     } catch (error) {
//       console.error("Purchase error:", error);
//     } finally {
//       setBuying(false);
//     }
//   };
  
//   // التوجيه لصفحة تفاصيل الكورس
//   const goToCourseDetails = () => {
//     navigate(`/courses/${course.id}`);
//   };
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1 }}
//       className="bg-card rounded-2xl border border-border overflow-hidden"
//     >
//       {/* Course Header */}
//       <div 
//         className="p-6 cursor-pointer hover:bg-primary/5 transition-colors"
//         onClick={() => setExpanded(!expanded)}
//       >
//         <div className="flex gap-4">
//           {/* Course Image */}
//           <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
//             <img 
//               src={courseImage} 
//               alt={courseTitle}
//               className="w-full h-full object-cover"
//               onError={(e) => { (e.target as HTMLImageElement).src = "/default-course.jpg"; }}
//             />
//           </div>
          
//           {/* Course Info */}
//           <div className="flex-1">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
//                 {course.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
//                 {pick(course.subject?.name, course.subject?.name_ar)}
//               </span>
//             </div>
//             <h3 className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">
//               {courseTitle}
//             </h3>
//             <p className="text-sm text-foreground/60 line-clamp-2 mt-1">
//               {pick(course.description, course.description_ar)?.replace(/<[^>]*>/g, '')}
//             </p>
            
//             <div className="flex items-center gap-4 mt-3 text-xs text-foreground/50">
//               <span className="flex items-center gap-1">
//                 <BookOpen className="w-3 h-3" />
//                 {lessons.length} {lang === "ar" ? "دروس" : "lessons"}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Users className="w-3 h-3" />
//                 {course.count_student || 0} {lang === "ar" ? "طالب" : "students"}
//               </span>
//             </div>
            
//             {/* Price */}
//             <div className="mt-3">
//               {hasDiscount ? (
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-xl font-black text-primary">{finalPrice.toFixed(2)} EGP</span>
//                   <span className="text-xs text-foreground/40 line-through">{originalPrice.toFixed(2)} EGP</span>
//                   <span className="text-xs text-red-500">-{discount}%</span>
//                 </div>
//               ) : (
//                 <span className="text-xl font-black text-primary">{originalPrice.toFixed(2)} EGP</span>
//               )}
//             </div>
//           </div>
          
//           <div className="flex flex-col items-end gap-2">
//             <div className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
//               <ChevronRight className="w-5 h-5 text-foreground/40" />
//             </div>
//             {!hasPurchased && (
//               <button
//                 onClick={handleBuyCourse}
//                 disabled={buying}
//                 className="px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold flex items-center gap-1"
//               >
//                 {buying ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />}
//                 {lang === "ar" ? "شراء" : "Buy"}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Expanded Content - Lessons & Exams */}
//       {expanded && (
//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           exit={{ opacity: 0, height: 0 }}
//           className="border-t border-border"
//         >
//           <div className="p-6 bg-secondary/20">
//             <h4 className="font-semibold mb-4 flex items-center gap-2">
//               <PlayCircle className="w-4 h-4 text-primary" />
//               {lang === "ar" ? "محتويات الكورس" : "Course Content"}
//             </h4>
            
//             <div className="space-y-3">
//               {lessons.slice(0, 3).map((lesson: any, idx: number) => (
//                 <LessonItem
//                   key={lesson.id}
//                   lesson={lesson}
//                   index={idx}
//                   slug={slug}
//                   lang={lang}
//                   isAuthenticated={isAuthenticated}
//                 />
//               ))}
//             </div>
            
//             {/* View All Button - يودي على صفحة تفاصيل الكورس */}
//             <div className="mt-4 text-center">
//               <button
//                 onClick={goToCourseDetails}
//                 className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
//               >
//                 {lang === "ar" ? "عرض كل التفاصيل" : "View all details"}
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// // 🟢 Lesson Item Component
// const LessonItem = ({ lesson, index, slug, lang, isAuthenticated }: any) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const navigate = useNavigate();
//   const lessonTitle = lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;
//   const isPurchased = isAuthenticated;
//   const isFree = parseFloat(lesson.price) === 0;
//   const canWatch = isPurchased || isFree;
  
//   const handleWatch = () => {
//     navigate(`/lesson/${lesson.id}`);
//   };
  
//   return (
//     <div className="bg-card rounded-xl border border-border overflow-hidden">
//       <div 
//         className="p-3 flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
//             {index + 1}
//           </div>
//           <div>
//             <h5 className="font-medium">{lessonTitle}</h5>
//             <div className="flex items-center gap-2 text-xs text-foreground/40">
//               <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
//               <span>{lesson.lession_time}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           {!isFree && !isPurchased && (
//             <span className="text-sm font-bold text-primary">{parseFloat(lesson.price).toFixed(2)} EGP</span>
//           )}
          
//           {canWatch && (
//             <button
//               onClick={handleWatch}
//               className="px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold flex items-center gap-1"
//             >
//               <PlayCircle className="w-3 h-3" />
//               {lang === "ar" ? "مشاهدة" : "Watch"}
//             </button>
//           )}
          
//           {!canWatch && !isFree && (
//             <div className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-foreground/40 text-xs font-semibold flex items-center gap-1">
//               <Lock className="w-3 h-3" />
//               {lang === "ar" ? "مقفل" : "Locked"}
//             </div>
//           )}
//         </div>
//       </div>
      
//       {isExpanded && (
//         <div className="p-3 pt-0 border-t border-border">
//           <p className="text-sm text-foreground/60">
//             {lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // 🟢 Stat Card
// const StatCard = ({ icon, label, value, color }: any) => (
//   <motion.div
//     whileHover={{ y: -5 }}
//     className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white shadow-lg`}
//   >
//     <div className="flex items-center justify-between">
//       {icon}
//       <span className="text-2xl font-black">{value}</span>
//     </div>
//     <p className="text-sm opacity-90 mt-2">{label}</p>
//   </motion.div>
// );

// // 🟢 Skeleton
// const SemesterSkeleton = () => {
//   return (
//     <div className="min-h-screen pt-32 pb-20">
//       <div className="container-tight">
//         <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 animate-pulse" />
//         <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[1,2,3,4].map(i => (
//             <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
//           ))}
//         </div>
//         <div className="space-y-4">
//           {[1,2].map(i => (
//             <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
//               <div className="flex gap-4">
//                 <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
//                 <div className="flex-1">
//                   <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
//                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SemesterDetails;