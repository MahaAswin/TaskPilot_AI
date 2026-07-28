import React from 'react';
import { 
  LayoutDashboard, CalendarDays, Calendar, Clock, 
  PieChart, Flame, Lightbulb, Target, History, Settings 
} from 'lucide-react';

export const CoachSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily', label: 'Daily Report', icon: CalendarDays },
    { id: 'weekly', label: 'Weekly Report', icon: Calendar },
    { id: 'monthly', label: 'Monthly Report', icon: Calendar },
    { id: 'focus', label: 'Focus Sessions', icon: Clock },
    { id: 'time', label: 'Time Analysis', icon: PieChart },
    { id: 'habits', label: 'Habit Analytics', icon: Flame },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'goals', label: 'Goals Progress', icon: Target },
    { id: 'timeline', label: 'Insights Timeline', icon: History },
    { id: 'settings', label: 'Coach Settings', icon: Settings }
  ];

  return (
    <aside className="w-full lg:w-56 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide border shrink-0 transition-all cursor-pointer text-left lg:w-full ${
              isActive
                ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs font-bold'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default CoachSidebar;
