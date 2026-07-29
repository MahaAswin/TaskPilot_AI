import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Cpu, Palette, ArrowRight, Sparkles, GraduationCap,
  Mail, FileText, Briefcase, BookOpen
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
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
    to: '/job-application',
    icon: Briefcase,
    color: 'emerald',
    label: '💼 AI Job Application Agent',
    desc: 'Automate job searching, match scoring, tailored HR email drafting, cover letter PDF creation, and HR email delivery.',
    badge: 'New Orchestrator'
  },
  {
    to: '/document-generator',
    icon: FileText,
    color: 'blue',
    label: '📄 AI Document Generator',
    desc: 'Transform raw text into downloadable PDF & Word (.docx) documents with optional Gemini 2.5 Flash enhancements.',
    badge: 'New Generator'
  },
  {
    to: '/career-intelligence',
    icon: GraduationCap,
    color: 'emerald',
    label: '💼 AI Career Intelligence',
    desc: 'Parse resumes, match skills against live Adzuna jobs, identify skill gaps, and generate career roadmaps.',
    badge: 'New Advisor'
  },
  {
    to: '/email-briefing',
    icon: Mail,
    color: 'blue',
    label: '📬 AI Email Briefing',
    desc: 'Paste or upload emails (.txt, .pdf, .docx, .eml) for executive summaries, tasks, and deadlines in <30s.',
    badge: 'Executive AI'
  },
  {
    to: '/email-coach',
    icon: Sparkles,
    color: 'purple',
    label: 'AI Email Writing Coach',
    desc: 'Inspect emails using LanguageTool API + AI to score writing, detect mistakes, and track progress.',
    badge: 'New Coach'
  },
  {
    to: '/email-agent',
    icon: Mail,
    color: 'rose',
    label: 'AI Email Agent (Gmail)',
    desc: 'Connect Gmail via Google OAuth 2.0 to draft, refine, and send emails via Gmail API.',
    badge: 'Core'
  },
  {
    to: '/learning',
    icon: BookOpen,
    color: 'purple',
    label: 'Learning Hub',
    desc: 'AI-generated flashcards, MCQ quizzes, and revision checklists for exam prep.',
    badge: 'Exam'
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
    to: '/creative',
    icon: Palette,
    color: 'rose',
    label: 'Creative Agent',
    desc: 'Generate flashcard decks, cheatsheets, mind maps, and diagrams.',
    badge: 'Creative'
  }
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50/80 border-indigo-200/80 text-indigo-600', badge: 'bg-indigo-100/80 text-indigo-700' },
  violet: { bg: 'bg-violet-50/80 border-violet-200/80 text-violet-600', badge: 'bg-violet-100/80 text-violet-700' },
  blue:   { bg: 'bg-blue-50/80 border-blue-200/80 text-blue-600', badge: 'bg-blue-100/80 text-blue-700' },
  emerald:{ bg: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-600', badge: 'bg-emerald-100/80 text-emerald-700' },
  purple: { bg: 'bg-purple-50/80 border-purple-200/80 text-purple-600', badge: 'bg-purple-100/80 text-purple-700' },
  amber:  { bg: 'bg-amber-50/80 border-amber-200/80 text-amber-600', badge: 'bg-amber-100/80 text-amber-700' },
  teal:   { bg: 'bg-teal-50/80 border-teal-200/80 text-teal-600', badge: 'bg-teal-100/80 text-teal-700' },
  rose:   { bg: 'bg-rose-50/80 border-rose-200/80 text-rose-600', badge: 'bg-rose-100/80 text-rose-700' },
  slate:  { bg: 'bg-slate-50/80 border-slate-200/80 text-slate-600', badge: 'bg-slate-100/80 text-slate-700' },
};

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            <span>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            TaskPilot Multi-Agent OS — Autonomous AI agents ready to assist you.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/workspace"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all shrink-0"
          >
            <Cpu className="w-4 h-4" />
            <span>Open AI Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick tip banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-indigo-50/90 border border-indigo-200/80 rounded-2xl flex items-start gap-3 shadow-sm">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
          <span className="font-black text-indigo-700 uppercase tracking-wide mr-1">Pro Tip:</span>
          Use the <strong>AI Job Application Agent</strong> to match live jobs, generate custom cover letters, and send emails directly to HR through the AI Email Agent!
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {agentCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group p-5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col gap-3.5 hover:-translate-y-1 hover:border-indigo-300"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 ${c.bg} rounded-2xl border shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${c.badge}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">{card.label}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{card.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 group-hover:text-indigo-600 transition-colors mt-auto pt-2 border-t border-slate-100">
                <span>Launch Agent</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
