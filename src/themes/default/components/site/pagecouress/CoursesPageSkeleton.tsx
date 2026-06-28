// src/components/site/CoursesPageSkeleton.tsx

interface CoursesPageSkeletonProps {
  isNature: boolean;
}

export const CoursesPageSkeleton = ({ isNature }: CoursesPageSkeletonProps) => {
  return (
    <section className={`pt-36 md:pt-40 pb-24 min-h-screen ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="text-center mb-12">
          <div className={`h-8 w-32 rounded-full mx-auto mb-5 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-12 w-64 rounded-lg mx-auto animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        <div className="mb-10">
          <div className={`h-12 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`rounded-xl overflow-hidden animate-pulse
              ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className={`h-44 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className="p-4">
                <div className={`h-4 rounded w-1/2 mb-3 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`h-5 rounded mb-2 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`h-4 rounded w-3/4 mb-3 ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className="flex gap-2">
                  <div className={`h-9 flex-1 rounded-xl ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  <div className={`h-9 w-16 rounded-xl ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesPageSkeleton;