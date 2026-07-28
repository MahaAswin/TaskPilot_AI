import React from 'react';
import { 
  LayoutDashboard, Compass, Layers, ListFilter, BarChart3, 
  TrendingUp, Award, Lightbulb, FileText, Settings 
} from 'lucide-react';

export const SkillSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Skill Dashboard', icon: LayoutDashboard },
    { id: 'overview', label: 'Skill Overview', icon: Compass },
    { id: 'categories', label: 'Skill Categories', icon: Layers },
    { id: 'topics', label: 'Topic Analysis', icon: ListFilter },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3 },
    { id: 'timeline', label: 'Performance Timeline', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'reports', label: 'Progress Reports', icon: FileText },
    { id: 'settings', label: 'Skill Settings', icon: Settings }
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
                ? 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-xs'
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

export default SkillSidebar;
