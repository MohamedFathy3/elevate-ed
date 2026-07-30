// src/pages/subjects/components/SubjectsSkeleton.tsx

export const SubjectsSkeleton = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-gray-950">
      <div className="container-tight">
        <div className="mb-8">
          <div className="h-4 w-32 rounded mb-4 bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 w-64 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-72 mt-2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="h-12 rounded-xl mb-8 bg-gray-200 dark:bg-gray-700" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl mb-4 bg-blue-100 dark:bg-blue-900/30" />
              <div className="h-6 rounded-lg mb-2 w-3/4 bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 rounded-lg w-1/2 bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};