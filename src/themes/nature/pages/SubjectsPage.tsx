// /* eslint-disable @typescript-eslint/no-explicit-any */
// // pages/SubjectsPage.tsx
// import { useSearchParams, useParams, Link } from "react-router-dom";
// import { useLang } from "@/i18n/LanguageContext";
// import { useSubjects } from "@/hooks/useSubjects";
// import { useTeacher } from "@/context/TeacherContext";
// import { useStudentAuth } from "@/context/StudentAuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   BookOpen, ChevronRight, Search, Filter, X, 
//   SlidersHorizontal, ChevronDown, ChevronUp, Star, 
//   TrendingUp, Users, Clock, Award, ArrowLeft, ArrowRight,
//   Lock, CheckCircle
// } from "lucide-react";
// import { useState, useMemo } from "react";

// export const SubjectsPage = () => {
//   const { lang, dir } = useLang();
//   const { slug } = useParams();
//   const { teacher } = useTeacher();
//   const { student, isAuthenticated } = useStudentAuth();
//   const [searchParams] = useSearchParams();
//   const stageId = searchParams.get('stage_id');
//   const stageName = searchParams.get('stage_name');
  
//   // ✅ حالة البحث والفلترة
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState<string>("default");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
//   const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
//   const { data: subjects, isLoading } = useSubjects(
//     stageId ? parseInt(stageId) : undefined,
//     teacher?.id
//   );
  
//   // ✅ فلترة وترتيب المواد
//   const filteredSubjects = useMemo(() => {
//     if (!subjects) return [];
    
//     let filtered = [...subjects];
    
//     // فلترة حسب البحث
//     if (searchQuery) {
//       filtered = filtered.filter((subject: any) => {
//         const subjectName = (lang === "ar" && subject.name_ar ? subject.name_ar : subject.name)?.toLowerCase() || "";
//         return subjectName.includes(searchQuery.toLowerCase());
//       });
//     }
    
//     // ترتيب النتائج
//     switch (sortBy) {
//       case "name_asc":
//         filtered.sort((a, b) => {
//           const nameA = (lang === "ar" && a.name_ar ? a.name_ar : a.name) || "";
//           const nameB = (lang === "ar" && b.name_ar ? b.name_ar : b.name) || "";
//           return nameA.localeCompare(nameB);
//         });
//         break;
//       case "name_desc":
//         filtered.sort((a, b) => {
//           const nameA = (lang === "ar" && a.name_ar ? a.name_ar : a.name) || "";
//           const nameB = (lang === "ar" && b.name_ar ? b.name_ar : b.name) || "";
//           return nameB.localeCompare(nameA);
//         });
//         break;
//       default:
//         // ترتيب حسب الـ position
//         filtered.sort((a, b) => (a.position || 0) - (b.position || 0));
//         break;
//     }
    
//     return filtered;
//   }, [subjects, searchQuery, sortBy, lang]);
  
//   const totalResults = filteredSubjects.length;
//   const hasResults = totalResults > 0;
  
//   // إعادة ضبط الفلترة
//   const resetFilters = () => {
//     setSearchQuery("");
//     setSortBy("default");
//     setSelectedFeatures([]);
//   };
  
//   // الميزات المتاحة للفلترة (للمواد)
//   const availableFeatures = [
//     { id: "has_courses", label_ar: "يوجد كورسات", label_en: "Has Courses", icon: BookOpen },
//     { id: "has_exams", label_ar: "يوجد امتحانات", label_en: "Has Exams", icon: Award },
//     { id: "popular", label_ar: "شائع", label_en: "Popular", icon: TrendingUp },
//   ];

//   if (isLoading) {
//     return <SubjectsSkeleton />;
//   }

//   return (
//     <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
//       {/* Background Decorations */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
//         <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
//       </div>

//       <div className="container-tight relative">
//         {/* Breadcrumb */}
//         <div className="mb-8">
//           <div className="flex items-center gap-2 text-sm text-foreground/60 mb-4 flex-wrap">
//             <Link to={``} className="hover:text-primary transition-colors">
//               {lang === "ar" ? "الرئيسية" : "Home"}
//             </Link>
//             <ChevronRight className="w-4 h-4" />
//             <Link to={`/stages`} className="hover:text-primary transition-colors">
//               {lang === "ar" ? "المراحل" : "Stages"}
//             </Link>
//             <ChevronRight className="w-4 h-4" />
//             <span className="text-foreground">{stageName || (lang === "ar" ? "المواد" : "Subjects")}</span>
//           </div>
          
//           <h1 className="text-4xl md:text-5xl font-black">
//             {stageName || (lang === "ar" ? "المواد الدراسية" : "Subjects")}
//           </h1>
//           <p className="text-foreground/60 mt-2">
//             {lang === "ar" ? "اختر المادة لاستعراض الترمات والكورسات" : "Choose a subject to view semesters and courses"}
//           </p>
//         </div>

//         {/* Search and Filters Bar */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Input */}
//             <div className="relative flex-1">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder={lang === "ar" ? "ابحث عن مادة..." : "Search for a subject..."}
//                 className="w-full bg-card border border-border rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-4 top-1/2 -translate-y-1/2"
//                 >
//                   <X className="w-4 h-4 text-foreground/40 hover:text-primary" />
//                 </button>
//               )}
//             </div>
            
//             {/* Filter Toggle Button */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
//                 showFilters 
//                   ? "gradient-primary text-white border-transparent" 
//                   : "bg-card border-border hover:border-primary/40"
//               }`}
//             >
//               <SlidersHorizontal className="w-4 h-4" />
//               <span className="text-sm font-medium">
//                 {lang === "ar" ? "فلترة وترتيب" : "Filter & Sort"}
//               </span>
//               {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//             </button>
//           </div>
          
//           {/* Sort Options */}
//           <div className="flex flex-wrap items-center gap-3 mt-4">
//             <span className="text-sm text-foreground/50">
//               {lang === "ar" ? "ترتيب حسب:" : "Sort by:"}
//             </span>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50"
//             >
//               <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
//               <option value="name_asc">{lang === "ar" ? "الاسم (أ-ي)" : "Name (A-Z)"}</option>
//               <option value="name_desc">{lang === "ar" ? "الاسم (ي-أ)" : "Name (Z-A)"}</option>
//             </select>
            
//             {/* Results Count */}
//             <div className="text-sm text-foreground/50 bg-secondary px-3 py-1.5 rounded-full">
//               {totalResults} {lang === "ar" ? "مادة" : "subjects"}
//             </div>
//           </div>
          
//           {/* Advanced Filters Panel */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="mt-4 p-5 bg-card rounded-xl border border-border">
//                   <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//                     <h4 className="font-semibold">{lang === "ar" ? "فلترة حسب الميزات" : "Filter by Features"}</h4>
//                     <button
//                       onClick={resetFilters}
//                       className="text-sm text-foreground/50 hover:text-primary transition-colors"
//                     >
//                       {lang === "ar" ? "إعادة ضبط" : "Reset"}
//                     </button>
//                   </div>
//                   <div className="flex flex-wrap gap-3">
//                     {availableFeatures.map((feature) => {
//                       const Icon = feature.icon;
//                       const isSelected = selectedFeatures.includes(feature.id);
//                       return (
//                         <button
//                           key={feature.id}
//                           onClick={() => {
//                             if (isSelected) {
//                               setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
//                             } else {
//                               setSelectedFeatures([...selectedFeatures, feature.id]);
//                             }
//                           }}
//                           className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
//                             isSelected
//                               ? "gradient-primary text-white"
//                               : "bg-secondary hover:bg-secondary/80"
//                           }`}
//                         >
//                           <Icon className="w-4 h-4" />
//                           <span>{lang === "ar" ? feature.label_ar : feature.label_en}</span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* No Results */}
//         {!hasResults && (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
//               <Search className="w-12 h-12 text-foreground/30" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">
//               {lang === "ar" ? "لا توجد نتائج" : "No results found"}
//             </h3>
//             <p className="text-foreground/60 mb-6">
//               {lang === "ar" 
//                 ? `لم نجد أي مادة تطابق "${searchQuery}"`
//                 : `No subjects match "${searchQuery}"`}
//             </p>
//             <button
//               onClick={resetFilters}
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold"
//             >
//               <X className="w-4 h-4" />
//               {lang === "ar" ? "مسح البحث" : "Clear Search"}
//             </button>
//           </div>
//         )}

//         {/* Subjects Grid */}
//         {hasResults && (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredSubjects.map((subject: any, i: number) => (
//               <SubjectCard
//                 key={subject.id}
//                 subject={subject}
//                 index={i}
//                 slug={slug!}
//                 lang={lang}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // 🟢 Subject Card Component
// const SubjectCard = ({ subject, index, slug, lang }: any) => {
//   const subjectName = lang === "ar" && subject.name_ar ? subject.name_ar : subject.name;
//   const subjectStage = subject.stage?.name || "";
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.05 }}
//       whileHover={{ y: -8 }}
//       className="group relative bg-card rounded-2xl border border-border hover:border-primary/30 transition-all cursor-pointer"
//     >
//       <Link to={`/semesters?subject_id=${subject.id}&subject_name=${encodeURIComponent(subjectName)}`}>
//         <div className="p-6">
//           {/* Icon */}
//           <div className="w-12 h-12 rounded-xl gradient-primary grid place-items-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
//             <BookOpen className="w-6 h-6 text-white" />
//           </div>
          
//           {/* Title */}
//           <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
//             {subjectName}
//           </h3>
          
//           {/* Stage Info */}
//           {subjectStage && (
//             <div className="flex items-center gap-1 text-xs text-foreground/50 mb-2">
//               <ChevronRight className="w-3 h-3" />
//               <span>{subjectStage}</span>
//             </div>
//           )}
          
//           {/* Description */}
//           <p className="text-sm text-foreground/60 line-clamp-2 min-h-[40px]">
//             {lang === "ar" 
//               ? `استعرض الترمات والكورسات المتاحة في ${subjectName}`
//               : `Browse semesters and courses available in ${subjectName}`}
//           </p>
          
//           {/* View Button */}
//           <div className="mt-4 pt-3 border-t border-border">
//             <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
//               {lang === "ar" ? "استعراض" : "View"}
//               <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </div>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// };

// // 🟢 Skeleton Component
// const SubjectsSkeleton = () => {
//   return (
//     <div className="min-h-screen pt-32 pb-20">
//       <div className="container-tight">
//         <div className="mb-8">
//           <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
//           <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
//           <div className="h-4 w-72 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
//         </div>
        
//         <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 animate-pulse" />
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
//               <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
//               <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4" />
//               <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubjectsPage;