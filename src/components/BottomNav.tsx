import React from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../i18n/translations';
import { Home, PlusCircle, Search, FileText, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { language } = useAuth();
  const t = translations[language];

  const items = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'track', label: t.navTrack, icon: Search },
    { id: 'report', label: t.navReport, icon: PlusCircle, isPrimary: true },
    { id: 'complaints', label: t.navComplaints, icon: FileText },
    { id: 'profile', label: t.navProfile, icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 safe-bottom shadow-lg">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className="flex flex-col items-center -mt-5 focus:outline-hidden"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-sky-300 transform active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-sky-700 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 max-w-[64px] truncate text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
