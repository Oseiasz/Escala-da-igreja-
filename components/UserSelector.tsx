import React from 'react';
import { Member } from '../types';

interface UserSelectorProps {
  currentUser: string;
  setCurrentUser: (user: string) => void;
  members: Member[];
}

const UserSelector: React.FC<UserSelectorProps> = ({ currentUser, setCurrentUser, members }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="user-select" className="text-sm font-medium text-gray-600 dark:text-gray-300">
        <i className="fa-solid fa-user mr-2"></i>
        Viewing as:
      </label>
      <select
        id="user-select"
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value)}
        className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
      >
        {members.map((member) => (
          <option key={member.name} value={member.name}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;