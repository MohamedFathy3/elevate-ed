/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCourseDetails.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useMemo, useState, useEffect } from "react";

export interface CourseDetail {
  id: number;
  course_id: number;
  is_purchased: boolean; // ✅ إضافة is_purchased
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  content_link: string;
  lession_date: string;
  lession_time: string;
  price: string;
  must_pass_to_unlock: boolean;
  discount: string;
  attended: boolean;
  createdAt: string;
  course?: {
    id: number;
    title: string;
    title_ar: string;
    description: string;
    imageUrl: string;
    price: string;
    discount: string;
    type: string;
  };
  // ✅ حقول إضافية للدروس
  titles?: string[];
  titles_ar?: string[];
  link_video?: string[];
  imageUrl?: string;
  image?: any;
  pdfUrl?: string;
  pdf?: any;
  available_watch_count?: number | null;
  usedWatchCount?: number;
  remainingWatchCount?: number | null;
  students?: any[];
  exams?: any[];
  assignments?: any[];
  need_support?: boolean;
}

interface CourseDetailsResponse {
  result: string;
  message: string;
  status: number;
  data: {
    id: number;
    title: string;
    title_ar: string;
    description: string;
    description_ar: string;
    about: string;
    about_ar: string;
    price: string;
    discount: string;
    price_before_discount: number;
    type: string;
    imageUrl: string;
    image: any;
    stage: {
      id: number;
      name: string;
      name_ar: string;
    };
    subject: {
      id: number;
      name: string;
      name_ar: string;
    };
    semester: {
      id: number;
      name: string;
      name_ar: string;
      price: string;
      discount: string;
    };
    hour_time_course: string;
    count_student: number;
    start_date: string;
    end_date: string;
    details: {
      id: number;
      is_purchased: boolean; // ✅ هنا is_purchased
      // ... باقي الحقول
    }[];
    students: any[];
    teacher: any;
  };
}

export interface StudentCourse {
  id: number;
  teacher_id: number;
  stage_id: number;
  subject_id: number;
  semester_id: number;
  price: string;
  discount: string;
  price_before_discount: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  about: string;
  about_ar: string;
  hour_time_course: string;
  type: string;
  count_student: number;
  start_date: string;
  end_date: string;
  active: number;
  link_video: string | null;
  imageUrl: string;
  image: {
    id: number;
    name: string;
    mimeType: string;
    size: number;
    authorId: number | null;
    previewUrl: string;
    fullUrl: string;
    createdAt: string;
  } | null;
  time_duration: string | null;
  createdAt: string;
  details?: any[];
  stage?: {
    id: number;
    name: string;
    name_ar: string;
  };
  subject?: {
    id: number;
    name: string;
    name_ar: string;
  };
  semester?: {
    id: number;
    name: string;
    name_ar: string;
    price: string;
    discount: string;
  };
}

// ============================================
// 🟢 Hook لجلب جميع كورسات الطالب المشترك فيها
// ============================================

export const useStudentCourses = () => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['student-courses'],
    queryFn: async () => {
      const response = await api.get('/my-student/learn');
      
      // إرجاع مصفوفة الكورسات من البيانات
      const courses = response.data?.data?.courses || [];
      return courses as StudentCourse[];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ============================================
// 🟢 Hook للتحقق إذا كان الطالب مشترك في كورس معين
// ============================================

export const useIsEnrolledInCourse = (courseId: number | undefined) => {
  const { data: courses, isLoading, error } = useStudentCourses();
  
  const isEnrolled = useMemo(() => {
    if (!courses || !courseId || courses.length === 0) return false;
    return courses.some((course: StudentCourse) => course.id === courseId);
  }, [courses, courseId]);
  
  const enrolledCourse = useMemo(() => {
    if (!courses || !courseId || courses.length === 0) return null;
    return courses.find((course: StudentCourse) => course.id === courseId) || null;
  }, [courses, courseId]);
  
  return { 
    isEnrolled, 
    enrolledCourse,
    isLoading, 
    error 
  };
};

// ============================================
// 🟢 Hook لتفاصيل الكورس (الدروس + معلومات الكورس)
// ============================================

export const useCourseDetails = (courseId: number) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      if (!courseId || courseId === 0) return null;
      
      const { data } = await api.get<CourseDetailsResponse>(`/course/${courseId}`);
      return data;
    },
    enabled: !!courseId && courseId !== 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================
// 🟢 Hook لجلب الدروس فقط من الكورس
// ============================================

export const useCourseLessons = (courseId: number) => {
  const { data: courseData, isLoading, refetch } = useCourseDetails(courseId);
  return {
    data: courseData?.data?.details || [],
    isLoading,
    refetch,
  };
};

// ============================================
// 🟢 Hook لجلب معلومات الكورس فقط (بدون الدروس)
// ============================================

export const useCourseInfo = (courseId: number) => {
  const { data: courseData, isLoading, refetch } = useCourseDetails(courseId);
  return {
    data: courseData?.data || null,
    isLoading,
    refetch,
  };
};

// ============================================
// 🟢 Hook متكامل لصفحة الكورس (يجمع البيانات)
// ============================================

export const useCourseWithEnrollment = (courseId: number | undefined) => {
  // جلب تفاصيل الكورس (الدروس + معلومات)
  const { 
    data: courseDetailsData, 
    isLoading: detailsLoading, 
    refetch: refetchDetails 
  } = useCourseDetails(courseId || 0);
  
  // جلب كورسات الطالب والتحقق من الاشتراك
  const { 
    isEnrolled, 
    enrolledCourse, 
    isLoading: enrollmentLoading 
  } = useIsEnrolledInCourse(courseId);
  
  const isLoading = detailsLoading || enrollmentLoading;
  
  // الدروس من تفاصيل الكورس
  const lessons = courseDetailsData?.data?.details || [];
  
  // معلومات الكورس الكاملة من API
  const courseFromApi = courseDetailsData?.data || null;
  
  // ✅ هل الطالب اشترى الكورس كامل؟
  const hasPurchasedFullCourse = useMemo(() => {
    if (isEnrolled) return true;
    if (lessons.length > 0) {
      return lessons.some((lesson: any) => lesson.attended === true);
    }
    return false;
  }, [isEnrolled, lessons]);
  
  // ✅ معلومات الكورس من بيانات الطالب المشترك (إذا وجد)
  const courseInfo = enrolledCourse || courseFromApi;
  
  // ✅ استخراج البيانات المفيدة للعرض
  const courseTitle = (lang: string) => {
    return lang === "ar" ? courseFromApi?.title_ar : courseFromApi?.title;
  };
  
  const courseDescription = (lang: string) => {
    return lang === "ar" ? courseFromApi?.description_ar : courseFromApi?.description;
  };
  
  const courseAbout = (lang: string) => {
    return lang === "ar" ? courseFromApi?.about_ar : courseFromApi?.about;
  };
  
  const originalPrice = parseFloat(courseFromApi?.price) || 0;
  const discountPercent = parseFloat(courseFromApi?.discount) || 0;
  const finalPrice = courseFromApi?.price_before_discount || originalPrice;
  const hasDiscount = discountPercent > 0;
  
  return {
    lessons,                    // قائمة الدروس
    courseFromApi,             // بيانات الكورس الكاملة من API
    courseInfo,                // معلومات الكورس (من enrollment إن وجد)
    isEnrolled,                // هل الطالب مشترك؟
    hasPurchasedFullCourse,    // هل اشترى الكورس كاملاً؟
    isLoading,                 // حالة التحميل
    refetchDetails,            // إعادة جلب البيانات
    // دوال مساعدة للعرض
    courseTitle,
    courseDescription,
    courseAbout,
    originalPrice,
    discountPercent,
    finalPrice,
    hasDiscount,
  };
};

// ============================================
// 🟢 Hook لجلب درس معين من الكورسات المشترك فيها
// ============================================

export const useLessonFromEnrolledCourses = (lessonId: number | undefined) => {
  const { data: courses, isLoading: coursesLoading } = useStudentCourses();
  const [lesson, setLesson] = useState<any>(null);
  const [parentCourse, setParentCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    if (!coursesLoading && courses && lessonId) {
      let foundLesson = null;
      let foundCourse = null;
      
      for (const course of courses) {
        if (course.details && course.details.length > 0) {
          const lessonMatch = course.details.find((d: any) => d.id === lessonId);
          if (lessonMatch) {
            foundLesson = lessonMatch;
            foundCourse = course;
            setIsEnrolled(true);
            break;
          }
        }
      }
      
      setLesson(foundLesson);
      setParentCourse(foundCourse);
      setIsLoading(false);
    }
  }, [courses, coursesLoading, lessonId]);
  
  return {
    lesson,
    parentCourse,
    isEnrolled,
    isLoading: isLoading || coursesLoading,
  };
};

// ============================================
// 🟢 Hook لجلب تفاصيل درس معين من API مباشرة
// ============================================

export const useLessonDetails = (lessonId: number | undefined) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['lesson-details', lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      const { data } = await api.get(`/course-details/${lessonId}`);
      return data;
    },
    enabled: !!lessonId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// 🟢 Hook لجلب تقدم الطالب في كورس معين
// ============================================

export const useCourseProgress = (courseId: number | undefined) => {
  const { lessons, hasPurchasedFullCourse, isLoading } = useCourseWithEnrollment(courseId);
  
  const progress = useMemo(() => {
    if (!hasPurchasedFullCourse || !lessons.length) return 0;
    
    const completedLessons = lessons.filter((lesson: any) => lesson.attended === true).length;
    return (completedLessons / lessons.length) * 100;
  }, [lessons, hasPurchasedFullCourse]);
  
  const completedCount = useMemo(() => {
    if (!hasPurchasedFullCourse || !lessons.length) return 0;
    return lessons.filter((lesson: any) => lesson.attended === true).length;
  }, [lessons, hasPurchasedFullCourse]);
  
  return {
    progress,
    completedCount,
    totalCount: lessons.length,
    isLoading,
  };
};

// ============================================
// 🟢 Hook لجلب آخر درس تم مشاهدته في كورس
// ============================================

export const useLastWatchedLesson = (courseId: number | undefined) => {
  const { lessons, hasPurchasedFullCourse, isLoading } = useCourseWithEnrollment(courseId);
  
  const lastWatchedLesson = useMemo(() => {
    if (!hasPurchasedFullCourse || !lessons.length) return null;
    
    // ترتيب الدروس حسب التاريخ والعثور على آخر درس تمت مشاهدته
    const watchedLessons = lessons.filter((lesson: any) => lesson.attended === true);
    if (watchedLessons.length === 0) return lessons[0];
    
    // إرجاع أول درس غير مشاهد أو آخر درس تمت مشاهدته
    const firstUnwatched = lessons.find((lesson: any) => lesson.attended !== true);
    return firstUnwatched || watchedLessons[watchedLessons.length - 1];
  }, [lessons, hasPurchasedFullCourse]);
  
  return {
    lastWatchedLesson,
    isLoading,
  };
};

// ============================================
// 🟢 Hook للتحقق من حالة شراء درس معين
// ============================================

export const useLessonPurchaseStatus = (courseId: number | undefined, lessonId: number | undefined) => {
  const { lessons, hasPurchasedFullCourse, isLoading } = useCourseWithEnrollment(courseId);
  
  const lessonStatus = useMemo(() => {
    if (!lessons.length || !lessonId) {
      return { isPurchased: false, lesson: null };
    }
    
    const lesson = lessons.find((l: any) => l.id === lessonId);
    if (!lesson) {
      return { isPurchased: false, lesson: null };
    }
    
    // ✅ الدرس مشترى إذا:
    // 1. الكورس كامل مشترى (hasPurchasedFullCourse)
    // 2. أو الدرس مشترى فردياً (lesson.is_purchased === true)
    const isPurchased = hasPurchasedFullCourse || lesson.is_purchased === true;
    
    return { isPurchased, lesson };
  }, [lessons, lessonId, hasPurchasedFullCourse]);
  
  return {
    ...lessonStatus,
    isLoading,
  };
};

// ============================================
// 🟢 Hook لجلب الدروس المشتراة فردياً
// ============================================

export const usePurchasedLessons = (courseId: number | undefined) => {
  const { lessons, hasPurchasedFullCourse, isLoading } = useCourseWithEnrollment(courseId);
  
  const purchasedLessons = useMemo(() => {
    if (!lessons.length) return [];
    
    // ✅ إذا كان الكورس كامل مشترى، كل الدروس متاحة
    if (hasPurchasedFullCourse) {
      return lessons;
    }
    
    // ✅ غير كده، فقط الدروس اللي is_purchased = true
    return lessons.filter((lesson: any) => lesson.is_purchased === true);
  }, [lessons, hasPurchasedFullCourse]);
  
  const availableLessons = useMemo(() => {
    if (!lessons.length) return [];
    
    // ✅ الدروس المتاحة = المشتراة + المجانية (price = 0)
    return lessons.filter((lesson: any) => {
      const isFree = parseFloat(lesson.price) === 0;
      return hasPurchasedFullCourse || lesson.is_purchased === true || isFree;
    });
  }, [lessons, hasPurchasedFullCourse]);
  
  return {
    purchasedLessons,    // الدروس المشتراة
    availableLessons,    // الدروس المتاحة (مشتراة + مجانية)
    allLessons: lessons,
    hasPurchasedFullCourse,
    isLoading,
  };
};

export default {
  useStudentCourses,
  useIsEnrolledInCourse,
  useCourseDetails,
  useCourseLessons,
  useCourseInfo,
  useCourseWithEnrollment,
  useLessonFromEnrolledCourses,
  useLessonDetails,
  useCourseProgress,
  useLastWatchedLesson,
  useLessonPurchaseStatus,
  usePurchasedLessons,
};