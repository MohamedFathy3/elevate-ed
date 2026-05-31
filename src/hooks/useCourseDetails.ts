/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCourseDetails.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useMemo } from "react";

export interface CourseDetail {
  id: number;
  course_id: number;
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
      console.log("📚 Fetching student enrolled courses...");
      const response = await api.get('/my-student/learn');
      console.log("✅ Student courses response:", response.data);
      
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
// 🟢 Hook لتفاصيل الكورس (الدروس)
// ============================================

export const useCourseDetails = (courseId: number | undefined) => {
  const token = Cookies.get('student_token');
  
  return useQuery({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");
      
      console.log("📚 Fetching course details for course:", courseId);
      const response = await api.post('/course-detail/index', {
        filters: {
          course_id: courseId
        },
        orderBy: "id",
        orderByDirection: "asc",
        perPage: 100,
        paginate: false,
        delete: false
      });
      console.log("✅ Course details response:", response.data);
      return response.data;
    },
    enabled: !!courseId && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ============================================
// 🟢 Hook متكامل لصفحة الكورس (يجمع البيانات)
// ============================================

export const useCourseWithEnrollment = (courseId: number | undefined) => {
  // جلب تفاصيل الكورس (الدروس)
  const { 
    data: courseDetailsData, 
    isLoading: detailsLoading, 
    refetch: refetchDetails 
  } = useCourseDetails(courseId);
  
  // جلب كورسات الطالب والتحقق من الاشتراك
  const { 
    isEnrolled, 
    enrolledCourse, 
    isLoading: enrollmentLoading 
  } = useIsEnrolledInCourse(courseId);
  
  const isLoading = detailsLoading || enrollmentLoading;
  
  // الدروس من تفاصيل الكورس
  const lessons = courseDetailsData?.data || [];
  
  // هل الطالب اشترى الكورس (أي درس من الدروس attended = true أو موجود في كورساته)
  const hasPurchasedFullCourse = useMemo(() => {
    if (isEnrolled) return true;
    if (lessons.length > 0) {
      return lessons.some((lesson: any) => lesson.attended === true);
    }
    return false;
  }, [isEnrolled, lessons]);
  
  // معلومات الكورس من بيانات الطالب المشترك (إذا وجد)
  const courseInfo = enrolledCourse;
  
  return {
    lessons,
    courseInfo,
    isEnrolled,
    hasPurchasedFullCourse,
    isLoading,
    refetchDetails,
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

// استيراد useState و useEffect للـ useLessonFromEnrolledCourses
import { useState, useEffect } from "react";