import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, LayoutDashboard, MessageSquareCode, CheckSquare, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/chat', label: 'Co-Pilot Chat', icon: MessageSquareCode },
    { path: '/tasks', label: 'Tasks Board', icon: CheckSquare },
    { path: '/profile', label: 'Settings', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/25 rounded-xl group-hover:border-indigo-400 group-hover:bg-indigo-500/20 transition-all duration-300">
            <Cpu className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white font-sans uppercase">
              TaskPilot <span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider font-semibold uppercase leading-none">
              Productivity OS
            </span>
          </div>
        </Link>

        {/* Center Actions */}
        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 shadow-glow' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Info: User profile score and actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs font-bold text-zinc-200">{user.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider">
                  SCORE: <span className="text-emerald-400 font-mono font-black">{user.productivityScore}%</span>
                </span>
              </div>
            </div>
          )}

          {/* Quick Logout */}
          <button
            onClick={handleLogout}
            className="p-2 border border-white/5 bg-zinc-900/30 hover:bg-rose-950/20 hover:border-rose-900/40 rounded-xl text-zinc-400 hover:text-rose-400 transition-all"
            title="Log Out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
