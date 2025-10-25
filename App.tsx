import React, { useState, useEffect, useMemo } from 'react';
import { WeeklySchedule, ViewMode, DaySetting, Member } from './types';
import { INITIAL_MEMBERS, INITIAL_DAY_SETTINGS } from './constants';
import { generateWeeklySchedule } from './services/geminiService';
import Header from './components/Header';
import MemberView from './views/MemberView';
import AdminView from './views/AdminView';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('member');
  const [theme, setTheme] = useState<Theme>('light');
  
  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem('church_members');
    return savedMembers ? JSON.parse(savedMembers) : INITIAL_MEMBERS;
  });

  const [daySettings, setDaySettings] = useState<DaySetting[]>(() => {
    const savedSettings = localStorage.getItem('church_day_settings');
    return savedSettings ? JSON.parse(savedSettings) : INITIAL_DAY_SETTINGS;
  });
  
  const [announcement, setAnnouncement] = useState<string>(() => {
    return localStorage.getItem('church_announcement') || '';
  });

  const [currentUser, setCurrentUser] = useState<string>(members[0]?.name || '');
  
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
    const savedSchedule = localStorage.getItem('church_schedule');
    return savedSchedule ? JSON.parse(savedSchedule) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to handle service worker messages and notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        // When the service worker confirms the background sync is complete,
        // we reload the page to fetch the latest schedule.
        if (event.data && event.data.type === 'SCHEDULE_SYNC_COMPLETE') {
          console.log('Received sync complete message. Reloading...');
          // Set loading state to provide feedback before reload
          setLoading(true);
          window.location.reload();
        }
      });
    }

    // Request notification permission on app load
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('church_members', JSON.stringify(members));
    if (!members.some(m => m.name === currentUser)) {
      setCurrentUser(members[0]?.name || '');
    }
  }, [members, currentUser]);
  
  useEffect(() => {
    localStorage.setItem('church_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('church_day_settings', JSON.stringify(daySettings));
  }, [daySettings]);
  
  useEffect(() => {
    localStorage.setItem('church_announcement', announcement);
  }, [announcement]);


  const handleGenerateSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const memberNames = members.map(m => m.name);
      const newSchedule = await generateWeeklySchedule(memberNames, daySettings);
      setSchedule(newSchedule);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const notifications = useMemo(() => {
    if (!schedule || schedule.length === 0) {
      return [];
    }
    const userNotifications: string[] = [];
    schedule.forEach(day => {
      if (day.ushers.includes(currentUser)) {
        userNotifications.push(`${day.day}: Usher`);
      }
      day.hymns.forEach(hymn => {
        if (hymn.person === currentUser) {
          userNotifications.push(`${day.day}: Hymn ${hymn.hymn}`);
        }
      });
    });
    return userNotifications;
  }, [schedule, currentUser]);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen font-sans">
      <Header viewMode={viewMode} setViewMode={setViewMode} theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-6">
        {viewMode === 'member' ? (
          <MemberView
            schedule={schedule}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            notifications={notifications}
            members={members}
            announcement={announcement}
          />
        ) : (
          <AdminView
            members={members}
            onMembersChange={setMembers}
            onGenerateSchedule={handleGenerateSchedule}
            loading={loading}
            error={error}
            daySettings={daySettings}
            onDaySettingsChange={setDaySettings}
            announcement={announcement}
            onAnnouncementChange={setAnnouncement}
            schedule={schedule}
          />
        )}
      </main>
      <footer className="text-center py-4 mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Developed with <i className="fa-solid fa-heart text-red-500"></i> and the Gemini API</p>
      </footer>
    </div>
  );
};

export default App;