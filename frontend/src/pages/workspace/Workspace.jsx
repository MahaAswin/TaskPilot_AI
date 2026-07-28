import React from 'react';
import { Send, Cpu, ShieldCheck } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';

export const Workspace = () => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {/* Workspace Header */}
      <div className="border-b border-slate-200 bg-white/80 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">AI Agent Workspace</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Coordinator Active</span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-slate-50/50">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <GlassCard hover={false} className="border-indigo-100 bg-white/90">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1.5">Coordinator Agent</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              TaskPilot AI foundation is configured. Future steps can extend the `CoordinatorAgent` implementation to route queries.
            </p>
          </GlassCard>

          <GlassCard hover={false} className="border-slate-200 ml-auto max-w-[85%] bg-indigo-50/40">
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1.5">User Prompt (Placeholder)</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Generate a water cycle flowchart diagram and save a biology study plan.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Chat input box */}
      <div className="p-4 border-t border-slate-200 bg-white z-10 shadow-soft">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            disabled
            placeholder="AI Chat workspace is locked in Scaffolding Mode..."
            className="w-full pl-4 pr-12 py-3 rounded-xl glassmorphism-input text-xs text-slate-800 disabled:opacity-60 border-slate-200 bg-slate-50/30"
          />
          <button
            disabled
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 text-slate-400 rounded-lg shrink-0 cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
