/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/semester-details/hooks/useSemesterData.ts

import { useSemesterCourses } from "@/hooks/useCourses";
import { useTeacher } from "@/context/TeacherContext";

export const useSemesterData = (semesterId: number) => {
  const { teacher, pick } = useTeacher();
  const { data: coursesData, isLoading, refetch } = useSemesterCourses(semesterId);

  const semester = teacher?.website?.semesters?.find((s: any) => s.id === semesterId);
  
  // ✅ فلترة الكورسات: بس اللي semester_id = null
  const allCourses = coursesData?.data || [];
  const filteredCourses = allCourses.filter((course: any) => course.semester_id === null);
  
  const totalStudents = filteredCourses.reduce((acc: number, c: any) => acc + (c.count_student || 0), 0);
  const semesterName = pick(semester?.name, semester?.name_ar) || "";

  return {
    semester,
    semesterName,
    courses: filteredCourses, // ✅ بس اللي semester_id = null
    totalStudents,
    isLoading,
    refetch,
    pick,
  };
};