import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Cpu, GraduationCap, Palette, User, Settings,
  BookOpen, Brain, Mail, FileText, Briefcase 
} from 'lucide-react';

export const Sidebar = () => {
  const sections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'EMAIL INTELLIGENCE',
      items: [
        { to: '/email-agent', label: 'AI Email Agent', icon: Mail, badge: 'CORE' },
        { to: '/email-briefing', label: 'AI Email Briefing', icon: Mail, badge: 'NEW' },
        { to: '/email-coach', label: 'AI Email Coach', icon: Mail, badge: 'NEW' }
      ]
    },
    {
      title: 'CAREER & DOCUMENTS',
      items: [
        { to: '/career-intelligence', label: 'AI Career Intelligence', icon: GraduationCap, badge: 'NEW' },
        { to: '/job-application', label: 'AI Job Application Agent', icon: Briefcase, badge: 'NEW' },
        { to: '/document-generator', label: 'AI Document Generator', icon: FileText, badge: 'NEW' }
      ]
    },
    {
      title: 'STUDY & KNOWLEDGE',
      items: [
        { to: '/learning', label: 'Learning Hub', icon: BookOpen },
        { to: '/skills', label: 'Skill Analyzer', icon: Brain }
      ]
    },
    {
      title: 'CREATIVE',
      items: [
        { to: '/creative', label: 'Creative Hub', icon: Palette }
      ]
    },
    {
      title: 'PLATFORM',
      items: [
        { to: '/workspace', label: 'AI Workspace', icon: Cpu, badge: 'AI' }
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { to: '/profile', label: 'Profile Settings', icon: User },
        { to: '/settings', label: 'System Configuration', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 my-3 ml-4 h-[calc(100vh-5.5rem)] rounded-3xl bg-[#1B1E25] border border-white/10 shadow-2xl flex flex-col shrink-0 transition-all select-none overflow-hidden z-20">
      {/* Sidebar Header Brand Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <img src="/logo-icon.png" alt="TaskPilot AI Icon" className="w-5 h-5 object-contain" />
        <span className="font-bold text-xs tracking-tight text-[#ECEAE3] uppercase">
          TaskPilot <span className="text-[#E8B45D]">AI</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-thin">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#868C99] uppercase select-none">
              {sec.title}
            </div>
            {sec.items.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide border-l-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-[rgba(232,180,93,0.14)] border-[#E8B45D] text-[#E8B45D] font-bold shadow-sm'
                        : 'bg-transparent border-transparent text-[#C6C9D1] hover:bg-[#242832] hover:text-[#ECEAE3] font-medium'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#868C99] group-hover:text-[#E8B45D] transition-colors" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      link.badge === 'NEW'
                        ? 'bg-[rgba(232,180,93,0.14)] text-[#E8B45D] border border-[#E8B45D]/30'
                        : link.badge === 'CORE'
                        ? 'bg-[rgba(87,181,168,0.14)] text-[#57B5A8] border border-[#57B5A8]/30'
                        : 'bg-[rgba(87,181,168,0.14)] text-[#57B5A8] border border-[#57B5A8]/30'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Footer info badge */}
      <div className="p-3 border-t border-white/10 bg-transparent text-[10px] text-[#868C99] font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <img src="/logo-icon.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
          <span>TaskPilot Pro AI</span>
        </span>
        <span className="font-semibold text-[#868C99]">v1.2.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
