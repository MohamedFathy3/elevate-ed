/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/stages/components/StagesStats.tsx

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { StagesStatsProps } from "../StagesPage.types";

const StatCard = ({ icon, value, label, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
    className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg text-center`}
  >
    <div className="flex items-center justify-center mb-3">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
    </div>
    <div className="text-2xl md:text-3xl font-black">{value}</div>
    <div className="text-xs opacity-90 mt-1">{label}</div>
  </motion.div>
);

export const StagesStats = ({ stages, lang }: StagesStatsProps) => {
  const totalCourses = stages?.reduce((acc, stage) => acc + (stage.courses_count || 0), 0) || 0;
  const totalStudents = stages?.reduce((acc, stage) => acc + (stage.students_count || 0), 0) || 0;

  const stats = [
    {
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      value: stages?.length || 0,
      label: lang === "ar" ? "مرحلة دراسية" : "Stages",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      value: `${totalCourses}+`,
      label: lang === "ar" ? "كورس تعليمي" : "Courses",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      value: `${totalStudents}+`,
      label: lang === "ar" ? "طالب مسجل" : "Students",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      value: "100%",
      label: lang === "ar" ? "رضا الطلاب" : "Satisfaction",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
    >
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </motion.div>
  );
};