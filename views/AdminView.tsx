import React, { useState } from 'react';
import MemberManager from '../components/admin/MemberManager';
import DaySettingsManager from '../components/admin/DaySettingsManager';
import { DaySetting, WeeklySchedule, Member } from '../types';

interface AdminViewProps {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
  onGenerateSchedule: () => Promise<void>;
  loading: boolean;
  error: string | null;
  daySettings: DaySetting[];
  onDaySettingsChange: (settings: DaySetting[]) => void;
  announcement: string;
  onAnnouncementChange: (announcement: string) => void;
  schedule: WeeklySchedule;
}

const AdminView: React.FC<AdminViewProps> = ({
  members,
  onMembersChange,
  onGenerateSchedule,
  loading,
  error,
  daySettings,
  onDaySettingsChange,
  announcement,
  onAnnouncementChange,
  schedule,
}) => {
  const [syncPending, setSyncPending] = useState(false);

  const handleGenerateClick = async () => {
    // Check if offline and if background sync is supported
    if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const sw = await navigator.serviceWorker.ready;
        // Fix: Cast service worker registration to `any` to access the `sync` property,
        // which may not be in the default TypeScript lib. The existence of 'SyncManager' is already checked.
        await (sw as any).sync.register('generate-schedule-sync');
        setSyncPending(true);
        console.log('Schedule generation queued for background sync.');
      } catch (err) {
        console.error('Background sync registration failed:', err);
        // Fallback to the original method, which will likely show an error
        await onGenerateSchedule();
      }
    } else {
      // If online or sync is not supported, generate immediately
      await onGenerateSchedule();
    }
  };

  const handleExport = () => {
    if (!schedule || schedule.length === 0) return;

    let exportText = "Weekly Church Roster\n\n";

    schedule.forEach(day => {
      exportText += `--- ${day.day.toUpperCase()} ---\n`;
      if (day.service !== 'No Service') {
        exportText += `Service: ${day.service}\n`;
        exportText += `Ushers: ${day.ushers.join(', ')}\n`;
        exportText += `Hymns:\n`;
        day.hymns.forEach(hymn => {
          exportText += `  - ${hymn.person} (Hymn ${hymn.hymn})\n`;
        });
      } else {
        exportText += "No service on this day.\n";
      }
      exportText += "\n";
    });

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'weekly_roster.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const getErrorDetails = (errorMessage: string) => {
    const lowerCaseError = errorMessage.toLowerCase();
    
    if (lowerCaseError.includes('network') || lowerCaseError.includes('connection')) {
        return { icon: "fa-solid fa-wifi", title: "Network Error" };
    }
    if (lowerCaseError.includes('api key')) {
        return { icon: "fa-solid fa-key", title: "Configuration Error" };
    }
    if (lowerCaseError.includes('quota') || lowerCaseError.includes('limit')) {
        return { icon: "fa-solid fa-hourglass-end", title: "API Limit Reached" };
    }
    if (lowerCaseError.includes('invalid format') || lowerCaseError.includes('non-json')) {
        return { icon: "fa-solid fa-file-circle-xmark", title: "Invalid API Response" };
    }
    
    return { icon: "fa-solid fa-triangle-exclamation", title: "An Error Occurred" };
  };

  const errorDetails = error ? getErrorDetails(error) : null;


  return (
    <div className="space-y-8">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-slate-700 pb-3 mb-4 flex items-center">
            <i className="fa-solid fa-bullhorn mr-3 text-blue-600 dark:text-blue-400"></i>
            Announcements
        </h2>
        <textarea
            value={announcement}
            onChange={(e) => onAnnouncementChange(e.target.value)}
            placeholder="Enter an announcement for the church..."
            className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
        />
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The announcement will be saved automatically.</p>
      </div>

       <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-slate-700 pb-3 mb-4 flex items-center">
            <i className="fa-solid fa-calendar-days mr-3 text-blue-600 dark:text-blue-400"></i>
            Configure Weekdays
        </h2>
        <DaySettingsManager settings={daySettings} onSettingsChange={onDaySettingsChange} />
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-slate-700 pb-3 mb-4 flex items-center">
            <i className="fa-solid fa-users-cog mr-3 text-blue-600 dark:text-blue-400"></i>
            Manage Members
        </h2>
        <MemberManager members={members} onMembersChange={onMembersChange} />
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-slate-700 pb-3 mb-4 flex items-center">
            <i className="fa-solid fa-calendar-plus mr-3 text-blue-600 dark:text-blue-400"></i>
            Manage Schedule
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Click the button below to generate a new weekly schedule based on the member list and day settings. The old schedule will be replaced.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
            <button
            onClick={handleGenerateClick}
            disabled={loading || syncPending}
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed dark:disabled:bg-blue-800"
            >
            {loading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
                </>
            ) : syncPending ? (
                <><i className="fa-solid fa-cloud-arrow-up mr-2"></i> Queued for Sync</>
            ) : (
                <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate New Schedule</>
            )}
            </button>
            <button
              onClick={handleExport}
              disabled={!schedule || schedule.length === 0}
              className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed dark:disabled:bg-green-800"
            >
              <i className="fa-solid fa-file-export mr-2"></i> Export Schedule
            </button>
        </div>
        {syncPending && (
            <div className="mt-4 text-center p-3 bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-500/50 text-blue-700 dark:text-blue-300 rounded-lg">
                <p>You are currently offline. The schedule will be generated automatically when you reconnect to the internet.</p>
            </div>
        )}
        {error && errorDetails && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500 dark:border-red-600 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0 pt-0.5">
                <i className={`${errorDetails.icon} text-red-500 text-xl`}></i>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-bold text-red-800 dark:text-red-300">{errorDetails.title}</h3>
                <p className="text-sm text-red-700 dark:text-red-300/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;