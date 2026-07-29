import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Cpu, ShieldCheck, Zap, Lock } from 'lucide-react';
import PageContainer from '../components/common/PageContainer';
import GlassCard from '../components/cards/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <PageContainer className="flex flex-col items-center justify-center text-center py-20 gap-8">
      
      {/* Title Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 text-indigo-600 text-xs font-extrabold tracking-wider uppercase shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>TaskPilot Multi-Agent OS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
          Your Intelligent <br />
          <span className="text-gradient-primary">Productivity Co-Pilot</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          TaskPilot is an enterprise-grade Multi-Agent operating system designed to collaborate on tasks, schedules, study plans, and graphic assets.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to={isAuthenticated ? '/dashboard' : '/login'}>
          <GradientButton className="flex items-center gap-2 px-6 py-3 text-xs font-extrabold shadow-lg shadow-indigo-200">
            <span>{isAuthenticated ? 'Enter Dashboard' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </GradientButton>
        </Link>

        {!isAuthenticated && (
          <Link to="/register">
            <button className="px-6 py-3 rounded-xl text-xs font-extrabold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 shadow-sm hover:border-indigo-200">
              Sign Up Free
            </button>
          </Link>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-12 text-left">
        <GlassCard delay={0.1}>
          <Cpu className="w-6 h-6 text-indigo-600 mb-3" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Multi-Agent Gateway</h4>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
            Requests are parsed by a Coordinator Agent that routes tasks dynamically across 5 specialized sub-agents.
          </p>
        </GlassCard>

        <GlassCard delay={0.2}>
          <Zap className="w-6 h-6 text-purple-600 mb-3" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Structured Schedulers</h4>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
            Automatically compile timetables, timelines, checklists, and summary notes directly linked to databases.
          </p>
        </GlassCard>

        <GlassCard delay={0.3}>
          <ShieldCheck className="w-6 h-6 text-teal-600 mb-3" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Enterprise Security</h4>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
            Equipped with helmet protections, payload validation checkers, and authorization tokens.
          </p>
        </GlassCard>
      </div>

    </PageContainer>
  );
};

export default Landing;
