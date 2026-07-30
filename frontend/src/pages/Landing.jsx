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
      <div className="space-y-5 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E8B45D]/30 bg-[#E8B45D]/10 text-[#E8B45D] text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-amber-500/5">
          <Sparkles className="w-4 h-4 text-[#E8B45D] animate-pulse" />
          <span>TaskPilot Multi-Agent OS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Your Intelligent <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8B45D] via-[#F3CE8A] to-[#57B5A8]">
            Productivity Co-Pilot
          </span>
        </h1>

        <p className="text-sm md:text-base text-[#C6C9D1] max-w-xl mx-auto leading-relaxed font-medium">
          TaskPilot is an enterprise-grade Multi-Agent operating system designed to collaborate on tasks, schedules, study plans, and graphic assets.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to={isAuthenticated ? '/dashboard' : '/login'}>
          <button className="flex items-center gap-2 px-7 py-3 text-xs font-extrabold text-[#14161B] bg-[#E8B45D] hover:bg-[#D4A253] rounded-xl shadow-xl shadow-amber-500/15 hover:scale-105 transition-all cursor-pointer">
            <span>{isAuthenticated ? 'Enter Dashboard' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        {!isAuthenticated && (
          <Link to="/register">
            <button className="px-7 py-3 rounded-xl text-xs font-extrabold text-[#ECEAE3] bg-[#242832] border border-white/10 hover:bg-[#2A2F3D] hover:border-[#E8B45D]/40 transition-all duration-300 shadow-sm cursor-pointer">
              Sign Up Free
            </button>
          </Link>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-12 text-left">
        <div className="bg-[#1B1E25] border border-white/10 p-6 rounded-2xl shadow-2xl space-y-3 hover:border-[#E8B45D]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E8B45D]/10 flex items-center justify-center border border-[#E8B45D]/20 mb-3">
            <Cpu className="w-5 h-5 text-[#E8B45D]" />
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Multi-Agent Gateway</h4>
          <p className="text-xs text-[#868C99] leading-relaxed font-semibold">
            Requests are parsed by a Coordinator Agent that routes tasks dynamically across 5 specialized sub-agents.
          </p>
        </div>

        <div className="bg-[#1B1E25] border border-white/10 p-6 rounded-2xl shadow-2xl space-y-3 hover:border-[#57B5A8]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#57B5A8]/10 flex items-center justify-center border border-[#57B5A8]/20 mb-3">
            <Zap className="w-5 h-5 text-[#57B5A8]" />
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Structured Schedulers</h4>
          <p className="text-xs text-[#868C99] leading-relaxed font-semibold">
            Automatically compile timetables, timelines, checklists, and summary notes directly linked to databases.
          </p>
        </div>

        <div className="bg-[#1B1E25] border border-white/10 p-6 rounded-2xl shadow-2xl space-y-3 hover:border-[#E2836A]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E2836A]/10 flex items-center justify-center border border-[#E2836A]/20 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#E2836A]" />
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Enterprise Security</h4>
          <p className="text-xs text-[#868C99] leading-relaxed font-semibold">
            Equipped with helmet protections, payload validation checkers, and authorization tokens.
          </p>
        </div>
      </div>

    </PageContainer>
  );
};

export default Landing;
