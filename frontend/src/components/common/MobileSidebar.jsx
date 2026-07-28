import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Cpu, Calendar, CheckSquare, GraduationCap, Palette, BarChart3, User, Settings } from 'lucide-react';

export const MobileSidebar = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative flex flex-col w-64 max-w-xs bg-white border-r border-slate-200 shadow-xl h-full z-10 p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Navigation Menu</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
