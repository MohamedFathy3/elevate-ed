// src/components/site/EmptyState.tsx

import { motion } from "framer-motion";
import { Leaf, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  lang: string;
  isNature: boolean;
}

export const EmptyState = ({ lang, isNature }: EmptyStateProps) => {
  return (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`w-24 h-24 mx-auto mb-4 rounded-full grid place-items-center
          ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'}`}
      >
        {isNature ? <Leaf className="w-12 h-12 text-amber-400" /> : <AlertCircle className="w-12 h-12 text-foreground/30" />}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">
        {lang === "ar" ? "لا توجد نتائج" : "No results found"}
      </h3>
      <p className="text-foreground/60">
        {lang === "ar"
          ? "لم نجد أي كورسات تطابق معايير البحث الخاصة بك"
          : "No courses match your search criteria"}
      </p>
    </motion.div>
  );
};

export default EmptyState;