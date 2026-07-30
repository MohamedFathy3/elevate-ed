// src/pages/semesters/components/SemestersSkeleton.tsx

export const SemestersSkeleton = ({ isNature }: { isNature: boolean }) => {
  const bgClass = isNature ? 'bg-amber-200/60' : 'bg-gray-200/60 dark:bg-gray-700/60';
  const lightBg = isNature ? 'bg-amber-100/60' : 'bg-gray-200/60 dark:bg-gray-700/60';
  const cardBg = isNature ? 'bg-white/80 border border-amber-200/60' : 'bg-card/80';
  
  return (
    <div className={`min-h-screen pt-28 pb-20 bg-white dark:bg-gray-950`}>
      <div className="container-tight">
        <div className="mb-6">
          <div className={`h-4 w-48 rounded mb-4 ${bgClass}`} />
          <div className={`h-10 w-64 rounded-lg ${bgClass}`} />
          <div className={`h-4 w-72 mt-2 rounded ${lightBg}`} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`rounded-2xl p-5 ${cardBg}`}>
              <div className={`h-40 rounded-xl mb-4 ${bgClass}`} />
              <div className={`h-6 rounded-lg mb-2 w-3/4 ${bgClass}`} />
              <div className={`h-4 rounded-lg w-1/2 mb-3 ${lightBg}`} />
              <div className={`h-8 rounded-lg w-1/3 mb-3 ${bgClass}`} />
              <div className="flex gap-3">
                <div className={`h-9 flex-1 rounded-xl ${bgClass}`} />
                <div className={`h-9 w-24 rounded-xl ${bgClass}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};