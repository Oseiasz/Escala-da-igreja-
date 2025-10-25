import React from 'react';
import { WeeklySchedule, Member } from '../types';
import UserSelector from '../components/UserSelector';
import NotificationBell from '../components/NotificationBell';
import ScheduleCard from '../components/ScheduleCard';

interface MemberViewProps {
  schedule: WeeklySchedule;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  notifications: string[];
  members: Member[];
  announcement: string;
}

const MemberView: React.FC<MemberViewProps> = ({
  schedule,
  currentUser,
  setCurrentUser,
  notifications,
  members,
  announcement,
}) => {
  const hasSchedule = schedule && schedule.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
        <UserSelector
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          members={members}
        />
        <NotificationBell notifications={notifications} />
      </div>
      
      {announcement && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/40 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fa-solid fa-bullhorn text-amber-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-md font-bold text-amber-800 dark:text-amber-300">Announcements</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1 whitespace-pre-wrap">{announcement}</p>
            </div>
          </div>
        </div>
      )}

      {hasSchedule ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schedule.map((daySchedule, index) => (
            <ScheduleCard key={index} schedule={daySchedule} currentUser={currentUser} members={members} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <i className="fa-solid fa-calendar-times text-5xl text-gray-400 dark:text-gray-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Schedule Generated</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            This week's schedule has not been created yet. Ask an administrator to generate it.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberView;