// src/pages/student-dashboard/components/Sidebar.tsx

import { motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { SidebarProps } from "../StudentDashboard.types";

export const Sidebar = ({
  tabs,
  activeTab,
  setActiveTab,
  studentInfo,
  logout,
  lang,
  isNature,
  isDark,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {
  const isRtl = lang === 'ar';
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";

  const getSidebarTextColor = () => isDark ? 'text-white' : 'text-gray-800';
  const getSidebarMutedColor = () => isDark ? 'text-gray-300' : 'text-gray-500';
  const getSidebarHoverBg = () => isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const getActiveTabBg = () => {
    if (isDark) return 'bg-white/20 text-white font-semibold backdrop-blur-sm';
    return isNature ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary';
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent text-white"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-24 lg:top-28 left-0 h-[calc(100vh-6rem)] w-72 lg:w-80
        bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl
        border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out z-40
        overflow-y-auto custom-scrollbar
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isRtl ? 'lg:right-0 lg:left-auto lg:border-l lg:border-r-0' : ''}
      `}>
        <div className="p-5">
          {/* Profile Section */}
          <div className="text-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${primaryGradient} p-0.5 mb-3`}>
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden">
                <span className={`text-2xl font-bold ${getSidebarTextColor()}`}>
                  {studentInfo?.name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>
            </div>
            <h3 className={`font-bold text-lg truncate ${getSidebarTextColor()}`}>
              {studentInfo?.name}
            </h3>
            <p className={`text-xs ${getSidebarMutedColor()} mt-1`}>
              {studentInfo?.email || studentInfo?.phone}
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab === tab.id 
                    ? getActiveTabBg()
                    : `${getSidebarHoverBg()} ${getSidebarTextColor()}`
                  }
                  ${isRtl ? 'flex-row-reverse' : ''}
                `}
              >
                <span className={activeTab === tab.id && isDark ? 'text-white' : ''}>
                  {tab.icon}
                </span>
                <span className={activeTab === tab.id && isDark ? 'font-semibold' : ''}>
                  {lang === 'ar' ? tab.labelAr : tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`w-1.5 h-1.5 rounded-full bg-${isNature ? 'amber' : 'primary'}-500 ml-auto ${isRtl ? 'mr-auto ml-0' : ''}`}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isDark 
                  ? 'text-red-400 hover:bg-white/10' 
                  : 'text-red-600 hover:bg-red-50'
                }
              `}
            >
              <LogOut className="w-5 h-5" />
              <span>{lang === "ar" ? "تسجيل الخروج" : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// ✅ إضافة Menu
import { Menu } from "lucide-react";