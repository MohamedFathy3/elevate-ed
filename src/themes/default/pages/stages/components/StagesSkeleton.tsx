// src/pages/stages/components/StagesSkeleton.tsx

export const StagesSkeleton = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-white dark:bg-gray-950">
      <div className="container-tight">
        <div className="text-center mb-12">
          <div className="h-8 w-48 rounded-full mx-auto mb-5 bg-blue-100 dark:bg-blue-900/30" />
          <div className="h-12 w-96 rounded-lg mx-auto bg-blue-100 dark:bg-blue-900/30" />
          <div className="h-4 w-64 rounded-lg mx-auto mt-4 bg-blue-50 dark:bg-blue-900/20" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30" />
              <div className="h-8 w-16 rounded-lg mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30" />
              <div className="h-3 w-20 rounded mx-auto bg-blue-50 dark:bg-blue-900/20" />
            </div>
          ))}
        </div>
        
        <div className="h-12 rounded-xl mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="h-52 bg-blue-100 dark:bg-blue-900/30" />
              <div className="p-6">
                <div className="h-6 rounded-lg mb-2 w-3/4 bg-blue-100 dark:bg-blue-900/30" />
                <div className="h-10 rounded-lg mb-4 bg-blue-50 dark:bg-blue-900/20" />
                <div className="h-4 rounded w-1/2 bg-blue-50 dark:bg-blue-900/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};