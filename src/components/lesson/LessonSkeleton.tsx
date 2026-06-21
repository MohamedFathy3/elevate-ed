// components/lesson/LessonSkeleton.tsx
import { motion } from "framer-motion";

interface LessonSkeletonProps {
  lang: string;
}

export const LessonSkeleton = ({ lang }: LessonSkeletonProps) => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container-tight max-w-7xl mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Video Player Skeleton */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card aspect-video animate-pulse"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600" />
                </div>
              </div>
            </motion.div>

            {/* Current Part Info Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            </motion.div>

            {/* Lesson Info Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
              
              <div className="flex flex-wrap gap-4">
                <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Parts List Skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Required Exam Card Skeleton */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl animate-pulse" />
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
              <div className="flex gap-4 mb-4">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="w-full h-10 bg-amber-500/30 rounded-xl animate-pulse" />
            </div>

            {/* Back Button Skeleton */}
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};