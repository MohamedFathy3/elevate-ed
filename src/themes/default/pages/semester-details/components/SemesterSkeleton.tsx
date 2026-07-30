// src/pages/semester-details/components/SemesterSkeleton.tsx

import { SemesterSkeletonProps } from "../SemesterDetails.types";

export const SemesterSkeleton = ({ isNature }: SemesterSkeletonProps) => {
  const bgClass = isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700';
  const lightBg = isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700';
  const cardBg = isNature ? 'bg-white border border-amber-200' : 'bg-card';
  
  return (
    <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className={`h-8 w-48 rounded-lg mb-8 ${bgClass}`} />
        <div className={`h-12 w-3/4 rounded-lg mb-4 ${bgClass}`} />
        <div className={`h-4 w-1/2 rounded ${lightBg}`} />
        
        <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
          {[1, 2].map(i => (
            <div key={i} className={`h-24 rounded-xl ${bgClass}`} />
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className={`rounded-2xl p-6 ${cardBg}`}>
              <div className="flex gap-4">
                <div className={`w-24 h-24 rounded-xl ${bgClass}`} />
                <div className="flex-1">
                  <div className={`h-6 rounded w-1/3 mb-2 ${bgClass}`} />
                  <div className={`h-4 rounded w-1/2 ${lightBg}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};