import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenCheck, CheckSquare, Brain, Zap, Cpu, Calendar, 
  Palette, ArrowRight, Sparkles, GraduationCap, Network
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { useAuth } from '../../context/AuthContext';

const agentCards = [
  {
    to: '/workspace',
    icon: Cpu,
    color: 'indigo',
    label: 'AI Workspace',
    desc: 'Chat with the Coordinator Agent — generate notes, quizzes, roadmaps by keyword.',
    badge: 'Core'
  },
  {
    to: '/knowledge',
    icon: BookOpenCheck,
    color: 'violet',
    label: 'Knowledge Studio',
    desc: 'Type a keyword and get full structured study notes instantly via AI.',
    badge: 'Notes'
  },
  {
    to: '/learning',
    icon: GraduationCap,
    color: 'blue',
    label: 'Learning Hub',
    desc: 'AI-generated flashcards, MCQ quizzes, and revision checklists for exam prep.',
    badge: 'Exam'
  },
  {
    to: '/tasks',
    icon: CheckSquare,
    color: 'emerald',
    label: 'Task Agent',
    desc: 'Track tasks, earn XP, build streaks, and manage your study queue.',
    badge: 'Tasks'
  },
  {
    to: '/skills',
    icon: Brain,
    color: 'purple',
    label: 'Skill Analyzer',
    desc: 'Analyze your skill gaps, topic progress, and competency radar.',
    badge: 'Skills'
  },
  {
    to: '/productivity',
    icon: Zap,
    color: 'amber',
    label: 'Productivity Coach',
    desc: 'Pomodoro focus sessions, habit tracking, and distraction analytics.',
    badge: 'Focus'
  },
  {
    to: '/planner',
    icon: Calendar,
    color: 'teal',
    label: 'Planner Agent',
    desc: 'Generate daily study schedules, milestone matrices, and roadmaps.',
    badge: 'Plan'
  },
  {
    to: '/creative',
    icon: Palette,
    color: 'rose',
    label: 'Creative Agent',
    desc: 'Generate flashcard decks, cheatsheets, mind maps, and diagrams.',
    badge: 'Creative'
  },
  {
    to: '/orchestrator',
    icon: Network,
    color: 'slate',
    label: 'Orchestrator',
    desc: 'View the multi-agent pipeline execution graph and workflow engine.',
    badge: 'System'
  }
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', icon: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-500' },
  emerald:{ bg: 'bg-emerald-50',border: 'border-emerald-200',icon: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700',  bar: 'bg-amber-500' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-200',   icon: 'text-teal-600',   badge: 'bg-teal-100 text-teal-700',   bar: 'bg-teal-500' },
  rose:   { bg: 'bg-rose-50',   border: 'border-rose-200',   icon: 'text-rose-600',   badge: 'bg-rose-100 text-rose-700',   bar: 'bg-rose-500' },
  slate:  { bg: 'bg-slate-50',  border: 'border-slate-200',  icon: 'text-slate-600',  badge: 'bg-slate-100 text-slate-700', bar: 'bg-slate-500' },
};

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">
            Your AI-powered student operating system — 8 agents ready to help you study smarter.
          </p>
        </div>
        <Link
          to="/workspace"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shadow-sm transition-all uppercase tracking-wider shrink-0"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Open AI Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick tip banner */}
      <div className="mb-6 p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-[10px] font-semibold text-indigo-700 leading-relaxed">
          <span className="font-black">Quick Start:</span> Go to <strong>AI Workspace</strong> and type a keyword like <em>"notes on photosynthesis"</em> or <em>"quiz on React hooks"</em> — the Coordinator Agent will automatically route it to the right sub-agent.
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agentCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <Link
              key={card.to}
              to={card.to}
              className={`group p-5 bg-white border ${c.border} rounded-2xl shadow-soft hover:shadow-md transition-all duration-200 flex flex-col gap-3 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 ${c.bg} rounded-xl`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badge}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">{card.label}</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">{card.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors mt-auto">
                <span>Open</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
