// src/pages/semester-details/components/StatCard.tsx

import { motion } from "framer-motion";
import { StatCardProps } from "../SemesterDetails.types";

export const StatCard = ({ icon, label, value, color, isNature }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="opacity-90">{icon}</div>
        <span className="text-2xl font-black">{value}</span>
      </div>
      <p className="text-sm opacity-90 mt-2">{label}</p>
    </motion.div>
  );
};