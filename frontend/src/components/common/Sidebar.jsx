import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Cpu, Calendar, CheckSquare, 
  GraduationCap, Palette, BarChart3, User, Settings 
} from 'lucide-react';

export const Sidebar = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workspace', label: 'AI Workspace', icon: Cpu },
    { to: '/planner', label: 'Plan Matrix', icon: Calendar },
    { to: '/tasks', label: 'Tasks Queue', icon: CheckSquare },
    { to: '/knowledge', label: 'Knowledge Base', icon: GraduationCap },
    { to: '/creative', label: 'Creative Hub', icon: Palette },
    { to: '/analytics', label: 'Analytics Panel', icon: BarChart3 },
    { to: '/profile', label: 'Profile settings', icon: User },
    { to: '/settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#09090b]/40 backdrop-blur-md h-[calc(100vh-4rem)] flex flex-col shrink-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 shadow-sm'
                    : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="p-4 border-t border-white/5 text-[10px] text-zinc-600 font-mono flex items-center justify-between">
        <span>Scaffolding Active</span>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
