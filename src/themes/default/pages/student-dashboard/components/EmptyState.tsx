/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/student-dashboard/components/EmptyState.tsx

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const EmptyState = ({ icon, title, message, actionLink, actionText, isNature, isDark }: any) => {
  const getTextColor = () => isDark ? 'text-white' : 'text-gray-900';
  const getMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  
  return (
    <div className="text-center py-12">
      <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isNature ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'} grid place-items-center`}>
        <div className={`w-12 h-12 ${isNature ? 'text-amber-400' : 'text-gray-400'}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${getTextColor()}`}>{title}</h3>
      <p className={`${getMutedColor()} mb-4`}>{message}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className={`inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold`}
        >
          {actionText}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};