import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, Settings, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/workspace', label: 'AI Workspace' },
    { path: '/email-agent', label: 'Email Agent' },
  ];

  return (
    <nav className="glassmorphism w-full border-b border-slate-200/80 bg-white/85 sticky top-0 z-50 backdrop-blur-xl flex flex-col shadow-sm">
      {/* Top ambient gradient line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 via-cyan-500 to-emerald-400" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Status Badge */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-black text-base tracking-tight text-slate-900">
                TaskPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
              </span>
            </Link>

            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Multi-Agent Engine Active
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Utility Tools & User Profile */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex flex-col items-end leading-none pr-1">
                <span className="text-xs font-extrabold text-slate-800">{user.name}</span>
                <span className="text-[9px] font-black text-emerald-600 font-mono mt-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  XP SCORE: {user.productivityScore || 95}%
                </span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/60 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-white/60 hover:bg-white transition-all shadow-sm"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
            </button>

            <Link
              to="/settings"
              className="p-2 rounded-xl border border-slate-200/60 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-white/60 hover:bg-white transition-all shadow-sm"
              title="System Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <Link
              to="/profile"
              className="w-9 h-9 rounded-xl border-2 border-indigo-200 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-indigo-100 hover:scale-105 transition-transform"
            >
              {user?.name?.[0]?.toUpperCase() || 'TP'}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
