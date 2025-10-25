import React from 'react';
import { DaySchedule, Member } from '../types';

interface ScheduleCardProps {
  schedule: DaySchedule;
  currentUser: string;
  members: Member[];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, currentUser, members }) => {
  const hasService = schedule.service !== 'No Service';

  const findMemberAvatar = (name: string): string => {
    const member = members.find(m => m.name === name);
    return member?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&rounded=true&size=40`;
  };

  const isCurrentUser = (name: string) => name === currentUser;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">{schedule.day}</h3>
      
      {hasService ? (
        <div className="space-y-4 flex-grow">
          <div>
            <h4 className="font-semibold text-gray-600 dark:text-gray-300 flex items-center text-sm">
              <i className="fa-solid fa-book-open w-5 mr-2 text-blue-500 dark:text-blue-400"></i>
              Service
            </h4>
            <p className="text-gray-800 dark:text-gray-100 ml-7">{schedule.service}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-600 dark:text-gray-300 flex items-center text-sm">
              <i className="fa-solid fa-people-group w-5 mr-2 text-blue-500 dark:text-blue-400"></i>
              Ushers
            </h4>
            <ul className="list-inside ml-7 text-gray-800 dark:text-gray-100 space-y-1 mt-1">
              {schedule.ushers.map((usher, index) => (
                <li key={index} className="flex items-center">
                  <img src={findMemberAvatar(usher)} alt={`${usher}'s avatar`} className="w-6 h-6 rounded-full mr-2" />
                  <span className={`${isCurrentUser(usher) ? 'bg-yellow-200 dark:bg-yellow-400/20 font-semibold text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded' : ''}`}>
                    {usher}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600 dark:text-gray-300 flex items-center text-sm">
              <i className="fa-solid fa-music w-5 mr-2 text-blue-500 dark:text-blue-400"></i>
              Hymns
            </h4>
            <div className="grid grid-cols-2 gap-2 mt-2 ml-7">
              {schedule.hymns.map((h, index) => (
                <div key={index} className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg flex flex-col items-center justify-center text-center text-sm">
                   <img src={findMemberAvatar(h.person)} alt={`${h.person}'s avatar`} className="w-8 h-8 rounded-full mb-1" />
                   <p className="font-medium text-gray-800 dark:text-gray-200 truncate w-full">
                    <span className={`${isCurrentUser(h.person) ? 'bg-yellow-200 dark:bg-yellow-400/20 font-semibold text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded' : ''}`}>
                      {h.person}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hymn {h.hymn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-house-chimney-window text-4xl mb-3"></i>
            <p className="font-semibold">No service on this day</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;