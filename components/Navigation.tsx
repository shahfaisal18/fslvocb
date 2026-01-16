
import React from 'react';
import { Home, BookOpen, Brain, TrendingUp, Settings } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'generator', icon: BookOpen, label: 'Learn' },
    { id: 'practice', icon: Brain, label: 'Quiz' },
    { id: 'progress', icon: TrendingUp, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentTab === tab.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <tab.icon size={24} className={currentTab === tab.id ? 'fill-indigo-50' : ''} />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
