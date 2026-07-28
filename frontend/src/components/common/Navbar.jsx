import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, Settings, User, Bell, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/workspace', label: 'Workspace' },
    { path: '/tasks', label: 'Tasks' },
  ];

  return (
    <nav className="glassmorphism w-full border-b border-white/5 bg-[#09090b]/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span className="font-extrabold text-sm tracking-wider text-white uppercase">
              TaskPilot <span className="text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-semibold tracking-wide transition-all ${
                    isActive ? 'text-indigo-400 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Utility Tools */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col items-end leading-none pr-1">
                <span className="text-[10px] font-bold text-zinc-300">{user.name}</span>
                <span className="text-[8px] font-black text-emerald-400 font-mono mt-1">SCORE: {user.productivityScore}%</span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="text-zinc-400 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              <Bell className="w-4 h-4" />
            </button>

            <Link
              to="/settings"
              className="text-zinc-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            <Link
              to="/profile"
              className="w-8 h-8 rounded-lg border border-white/10 bg-zinc-800 flex items-center justify-center font-bold text-xs text-white"
            >
              {user?.name?.[0]?.toUpperCase() || 'OP'}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
