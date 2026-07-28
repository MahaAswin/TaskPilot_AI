import React from 'react';
import { 
  LayoutDashboard, GitBranch, History, Cpu, FileCode, Terminal, Settings 
} from 'lucide-react';

export const AgentSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Agent Dashboard', icon: LayoutDashboard },
    { id: 'monitor', label: 'Workflow Monitor', icon: GitBranch },
    { id: 'timeline', label: 'Execution Timeline', icon: History },
    { id: 'context', label: 'Context Viewer', icon: Cpu },
    { id: 'history', label: 'Workflow History', icon: FileCode },
    { id: 'logs', label: 'Execution Logs', icon: Terminal },
    { id: 'settings', label: 'Agent Settings', icon: Settings }
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
                ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-xs font-bold'
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

export default AgentSidebar;
