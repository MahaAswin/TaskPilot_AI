import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/workspace', label: 'AI Workspace' },
    { path: '/email-agent', label: 'Email Agent' },
  ];

  return (
    <header className="sticky top-3 z-40 px-4 mb-3 transition-all">
      <nav className="floating-navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between h-14 transition-all">
        
        {/* Logo & Platform Status Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo-icon.png" alt="TaskPilot AI Logo" className="w-6 h-6 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-bold text-sm tracking-tight text-[#ECEAE3]">
              TaskPilot <span className="text-[#E8B45D]">AI</span>
            </span>
          </Link>

          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(87,181,168,0.14)] border border-[#57B5A8]/30 text-[#57B5A8] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#57B5A8] animate-pulse" />
            Multi-Agent Active
          </span>
        </div>

        {/* Floating Center Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#242832] p-1 rounded-xl border border-white/10">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E8B45D] text-[#14161B] shadow-md font-extrabold'
                    : 'text-[#C6C9D1] hover:text-[#ECEAE3] hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-2.5">
          {user && (
            <div className="hidden sm:flex flex-col items-end leading-none pr-1">
              <span className="text-xs font-bold text-[#ECEAE3]">{user.name}</span>
              <span className="text-[9px] font-extrabold text-[#57B5A8] font-mono mt-0.5 px-1.5 py-0.5 rounded-md bg-[rgba(87,181,168,0.14)] border border-[#57B5A8]/30">
                PRO ACTIVE
              </span>
            </div>
          )}

          <button
            className="p-1.5 rounded-xl border border-white/10 hover:border-[#E8B45D]/40 text-[#C6C9D1] hover:text-[#E8B45D] bg-[#242832] transition-all shadow-sm"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>

          <Link
            to="/settings"
            className="p-1.5 rounded-xl border border-white/10 hover:border-[#E8B45D]/40 text-[#C6C9D1] hover:text-[#E8B45D] bg-[#242832] transition-all shadow-sm"
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <Link
            to="/profile"
            className="w-8 h-8 rounded-xl border border-indigo-200 bg-gradient-to-r from-[#5B5FEF] to-[#7C3AED] text-white font-bold text-xs flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          >
            {user?.name?.[0]?.toUpperCase() || 'TP'}
          </Link>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
