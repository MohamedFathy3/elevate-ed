// src/pages/student-dashboard/components/DashboardSkeleton.tsx

export const DashboardSkeleton = ({ isNature, isRtl }: { isNature: boolean; isRtl: boolean }) => (
  <div className={`min-h-screen pt-24 pb-20 bg-white dark:bg-gray-950 ${isRtl ? 'rtl' : 'ltr'}`}>
    <div className="container-tight">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-80">
          <div className={`h-[calc(100vh-6rem)] rounded-xl animate-pulse bg-gray-100 dark:bg-gray-900`} />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className={`h-12 w-48 rounded-lg animate-pulse bg-gray-100 dark:bg-gray-800`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-24 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`} />
            ))}
          </div>
          <div className={`h-40 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`} />
          <div className={`h-32 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
      </div>
    </div>
  </div>
);