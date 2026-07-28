import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Cpu, LayoutDashboard, Calendar, CheckSquare, GraduationCap, Palette, BarChart3, User, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workspace', label: 'AI Workspace', icon: Cpu },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/knowledge', label: 'Knowledge', icon: GraduationCap },
    { to: '/creative', label: 'Creative', icon: Palette },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 border border-white/10 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white"
        title="Open Navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Slide-over menu panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-white/5 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                    <span className="font-extrabold text-sm tracking-wider text-white uppercase">TaskPilot</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-500 hover:text-white"
                    title="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                            isActive
                              ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
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
              </div>

              <div className="text-[10px] text-zinc-600 font-mono">
                TaskPilot AI Scaffolding
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSidebar;
