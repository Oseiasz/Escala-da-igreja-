import React from 'react';
import { DaySetting } from '../../types';

interface DaySettingsManagerProps {
  settings: DaySetting[];
  onSettingsChange: (settings: DaySetting[]) => void;
}

const DaySettingsManager: React.FC<DaySettingsManagerProps> = ({ settings, onSettingsChange }) => {
  
  const handleToggleService = (index: number) => {
    const newSettings = [...settings];
    newSettings[index].hasService = !newSettings[index].hasService;
    onSettingsChange(newSettings);
  };

  const handleServiceNameChange = (index: number, newName: string) => {
    const newSettings = [...settings];
    newSettings[index].serviceName = newName;
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Define which days will have a service and the name of the corresponding service. Changes are saved automatically.
        </p>
      {settings.map((daySetting, index) => (
        <div 
          key={daySetting.day} 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-md"
        >
          <div className="flex items-center mb-2 sm:mb-0">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={daySetting.hasService} 
                  onChange={() => handleToggleService(index)}
                />
                <div className="block bg-gray-300 dark:bg-slate-600 w-10 h-6 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${daySetting.hasService ? 'transform translate-x-full bg-blue-500' : 'dark:bg-slate-400'}`}></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-200 font-medium">{daySetting.day}</div>
            </label>
          </div>

          <input
            type="text"
            value={daySetting.serviceName}
            onChange={(e) => handleServiceNameChange(index, e.target.value)}
            disabled={!daySetting.hasService}
            className="w-full sm:w-64 p-1.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-slate-700 dark:disabled:text-gray-400"
          />
        </div>
      ))}
    </div>
  );
};

export default DaySettingsManager;