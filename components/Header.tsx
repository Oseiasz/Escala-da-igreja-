import React from 'react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600";

  return (
    <div className="flex p-1 bg-gray-200 dark:bg-slate-900 rounded-lg">
      <button
        onClick={() => setViewMode('member')}
        className={`${baseClasses} ${viewMode === 'member' ? activeClasses : inactiveClasses}`}
      >
        <i className="fa-solid fa-eye mr-2"></i>
        Member View
      </button>
      <button
        onClick={() => setViewMode('admin')}
        className={`${baseClasses} ${viewMode === 'admin' ? activeClasses : inactiveClasses}`}
      >
        <i className="fa-solid fa-user-shield mr-2"></i>
        Admin View
      </button>
    </div>
  );
};


interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}


const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode, theme, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm w-full p-4 mb-6">
      <div className="container mx-auto flex items-center justify-between">
         <div className="flex items-center">
            <i className="fa-solid fa-church text-xl text-blue-600 dark:text-blue-400 mr-3"></i>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Weekly Roster</h1>
         </div>
         <div className="flex items-center space-x-4">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Toggle dark mode"
            >
                {theme === 'light' ? (
                    <i className="fa-solid fa-moon text-lg"></i>
                ) : (
                    <i className="fa-solid fa-sun text-lg"></i>
                )}
            </button>
         </div>
      </div>
    </header>
  );
};

export default Header;