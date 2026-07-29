import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Cpu, Calendar, CheckSquare, 
  GraduationCap, Palette, BarChart3, TrendingUp, User, Settings, BookOpen, Sparkles, Brain, Zap, Network, ShieldCheck, Mail, FileText, Briefcase 
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
        { to: '/email-briefing', label: '📬 AI Email Briefing', icon: Mail, badge: 'NEW' },
        { to: '/email-coach', label: 'AI Email Coach', icon: Mail, badge: 'NEW' }
      ]
    },
    {
      title: 'CAREER & DOCUMENTS',
      items: [
        { to: '/career-intelligence', label: '💼 AI Career Intelligence', icon: GraduationCap, badge: 'NEW' },
        { to: '/job-application', label: '💼 AI Job Application Agent', icon: Briefcase, badge: 'NEW' },
        { to: '/document-generator', label: '📄 AI Document Generator', icon: FileText, badge: 'NEW' }
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
    <aside className="w-64 border-r border-slate-200/80 bg-white/70 backdrop-blur-xl h-[calc(100vh-4rem)] flex flex-col shrink-0 transition-all select-none">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="px-3 py-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase select-none opacity-80">
              {sec.title}
            </div>
            {sec.items.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50/90 to-purple-50/50 border-indigo-200/80 text-indigo-700 shadow-sm font-bold glow-border-indigo'
                        : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      link.badge === 'NEW' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-indigo-100 text-indigo-700'
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
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          TaskPilot Pro AI
        </span>
        <span className="font-semibold text-slate-400">v1.2.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
