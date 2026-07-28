import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Cpu, ShieldCheck, Zap } from 'lucide-react';
import PageContainer from '../components/common/PageContainer';
import GlassCard from '../components/cards/GlassCard';
import GradientButton from '../components/ui/GradientButton';

export const Landing = () => {
  return (
    <PageContainer className="flex flex-col items-center justify-center text-center py-20 gap-8">
      
      {/* Title Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/35 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold tracking-wider uppercase animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TaskPilot AI Scaffolding</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
          Your Intelligent <br />
          <span className="text-gradient-primary">Productivity Co-Pilot</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          TaskPilot is an enterprise-grade Multi-Agent operating system designed to collaborate on tasks, schedules, study plans, and graphic assets.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link to="/login">
          <GradientButton className="flex items-center gap-2">
            <span>Access Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </GradientButton>
        </Link>
        <Link to="/register">
          <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-300">
            Sign Up Operator
          </button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-12 text-left">
        <GlassCard delay={0.1}>
          <Cpu className="w-6 h-6 text-indigo-400 mb-3" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Agent Gateway</h4>
          <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
            Requests are parsed by a Coordinator Agent that routes tasks dynamically across 5 specialized sub-agents.
          </p>
        </GlassCard>

        <GlassCard delay={0.2}>
          <Zap className="w-6 h-6 text-fuchsia-400 mb-3" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Structured Schedulers</h4>
          <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
            Automatically compile timetables, timelines, checklists, and summary notes directly linked to databases.
          </p>
        </GlassCard>

        <GlassCard delay={0.3}>
          <ShieldCheck className="w-6 h-6 text-teal-400 mb-3" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Enterprise Security</h4>
          <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
            Equipped with helmet protections, payload validation checkers, and authorization tokens.
          </p>
        </GlassCard>
      </div>

    </PageContainer>
  );
};

export default Landing;
