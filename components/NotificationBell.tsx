
import React, { useState, useRef, useEffect } from 'react';

interface NotificationBellProps {
  notifications: string[];
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificationCount = notifications.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
      >
        <i className="fa-solid fa-bell text-2xl"></i>
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-slate-700">
          <div className="py-2">
            <div className="px-4 py-2 font-bold text-slate-700 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700">Your Assignments</div>
            {notificationCount > 0 ? (
              <ul>
                {notifications.map((note, index) => (
                  <li key={index} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">You have no assignments this week.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;