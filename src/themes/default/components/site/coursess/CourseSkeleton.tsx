// src/components/site/courses/CourseSkeleton.tsx

export const CourseSkeleton = ({ isNature, isDark }: { isNature: boolean; isDark: boolean }) => {
  if (isNature) {
    return (
      <section className="py-24 md:py-32 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-tight">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-amber-200 dark:bg-amber-800 rounded-full mx-auto mb-5" />
            <div className="h-12 w-80 bg-amber-100 dark:bg-amber-900 rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[2rem] p-1.5 bg-amber-200 dark:bg-amber-800">
                <div className="bg-white dark:bg-gray-800 rounded-[1.7rem] overflow-hidden">
                  <div className="h-72 bg-amber-100 dark:bg-gray-700" />
                  <div className="p-6 text-center">
                    <div className="h-6 bg-amber-100 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-4 bg-amber-50 dark:bg-gray-800 rounded w-1/2 mx-auto mb-4" />
                    <div className="h-8 bg-amber-100 dark:bg-gray-700 rounded w-1/3 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="h-12 bg-amber-100 dark:bg-amber-900 rounded-lg w-3/4 mx-auto" />
              <div className="h-4 bg-amber-50 dark:bg-gray-800 rounded w-1/2 mx-auto mt-4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
      <div className="container-tight">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-5" />
          <div className="h-12 w-80 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="h-36 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};