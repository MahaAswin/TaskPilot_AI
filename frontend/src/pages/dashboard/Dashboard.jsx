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
    label: 'AI Workspace',
    desc: 'Chat with the Coordinator Agent — generate notes, quizzes, and roadmaps intelligently.',
    badge: 'CORE'
  },
  {
    to: '/job-application',
    icon: Briefcase,
    label: 'AI Job Application Agent',
    desc: 'Automate job searching, match scoring, HR email drafting, cover letter PDF creation, and HR email delivery.',
    badge: 'NEW'
  },
  {
    to: '/document-generator',
    icon: FileText,
    label: 'AI Document Generator',
    desc: 'Transform raw text into downloadable PDF & Word (.docx) documents with AI formatting.',
    badge: 'NEW'
  },
  {
    to: '/career-intelligence',
    icon: GraduationCap,
    label: 'AI Career Intelligence',
    desc: 'Parse resumes, match skills against live Adzuna jobs, identify gaps, and generate career roadmaps.',
    badge: 'NEW'
  },
  {
    to: '/email-briefing',
    icon: Mail,
    label: 'AI Email Briefing',
    desc: 'Upload email files (.txt, .pdf, .docx, .eml) for executive summaries, tasks, and deadlines.',
    badge: 'NEW'
  },
  {
    to: '/email-coach',
    icon: Sparkles,
    label: 'AI Email Writing Coach',
    desc: 'Inspect emails using LanguageTool API + AI to score writing, detect mistakes, and track progress.',
    badge: 'NEW'
  },
  {
    to: '/email-agent',
    icon: Mail,
    label: 'AI Email Agent (Gmail)',
    desc: 'Connect Gmail via Google OAuth 2.0 to draft, refine, and send emails via Gmail API.',
    badge: 'CORE'
  },
  {
    to: '/learning',
    icon: BookOpen,
    label: 'Learning Hub',
    desc: 'AI-generated flashcards, MCQ quizzes, and revision checklists for exam prep.',
    badge: 'AI'
  },
  {
    to: '/skills',
    icon: Brain,
    label: 'Skill Analyzer',
    desc: 'Analyze your skill gaps, topic progress, and competency radar visualization.',
    badge: 'AI'
  },
  {
    to: '/creative',
    icon: Palette,
    label: 'Creative Agent',
    desc: 'Generate flashcard decks, cheatsheets, mind maps, and creative diagrams.',
    badge: 'AI'
  }
];

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      {/* Premium Workspace Header */}
      <div className="bg-[#1B1E25] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E8B45D]">
            <img src="/logo-icon.png" alt="TaskPilot Logo" className="w-4 h-4 object-contain" />
            <span>ENTERPRISE MULTI-AGENT PLATFORM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#ECEAE3] tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-xs sm:text-sm text-[#C6C9D1] font-normal max-w-xl leading-relaxed pt-1">
            Your specialized AI agents are active and synchronized across email intelligence, career intelligence, document generation, and skill analytics.
          </p>
        </div>

        <Link
          to="/workspace"
          className="btn-primary px-5 py-3 text-xs flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto shadow-lg text-[#14161B]"
        >
          <img src="/logo-icon.png" alt="TaskPilot Logo" className="w-4 h-4 object-contain" />
          <span>Launch AI Workspace</span>
          <ArrowRight className="w-4 h-4 text-[#14161B]" />
        </Link>
      </div>

      {/* Pro Tip Highlight Bar */}
      <div className="p-4 bg-[#1B1E25] border border-white/10 rounded-2xl flex items-center gap-3.5 shadow-md">
        <div className="w-8 h-8 rounded-xl bg-[rgba(232,180,93,0.14)] border border-[#E8B45D]/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-[#E8B45D]" />
        </div>
        <p className="text-xs font-medium text-[#C6C9D1] leading-relaxed">
          <span className="font-bold text-[#E8B45D] uppercase tracking-wider mr-1.5">Agent Workflow:</span>
          Use the <strong className="text-[#ECEAE3]">AI Job Application Agent</strong> to match live jobs, generate custom cover letters, and auto-navigate to the <strong className="text-[#ECEAE3]">AI Email Agent</strong> with pre-filled content!
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agentCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="app-card app-card-hover group flex flex-col justify-between gap-4 select-none"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#242832] border border-white/10 flex items-center justify-center text-[#E8B45D] group-hover:bg-[rgba(232,180,93,0.14)] group-hover:border-[#E8B45D]/40 transition-all">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    card.badge === 'NEW'
                      ? 'bg-[rgba(232,180,93,0.14)] text-[#E8B45D] border border-[#E8B45D]/30'
                      : card.badge === 'CORE'
                      ? 'bg-[rgba(87,181,168,0.14)] text-[#57B5A8] border border-[#57B5A8]/30'
                      : 'bg-[rgba(87,181,168,0.14)] text-[#57B5A8] border border-[#57B5A8]/30'
                  }`}>
                    {card.badge}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-[#ECEAE3] group-hover:text-[#E8B45D] transition-colors">
                  {card.label}
                </h3>
                <p className="text-xs text-[#C6C9D1] mt-1.5 leading-relaxed font-normal">
                  {card.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#868C99] group-hover:text-[#E8B45D] transition-colors pt-3 border-t border-white/5 mt-2">
                <span>Open Agent</span>
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
