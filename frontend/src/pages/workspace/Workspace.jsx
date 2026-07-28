import React from 'react';
import { Send, Cpu, ShieldCheck } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';

export const Workspace = () => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {/* Workspace Header */}
      <div className="border-b border-white/5 bg-[#09090b]/80 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">AI Agent Workspace</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Coordinator Active</span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-glow-radial">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <GlassCard hover={false} className="border-indigo-500/10">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1.5">Coordinator Agent</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              TaskPilot AI foundation is configured. Future steps can extend the `CoordinatorAgent` implementation to route queries.
            </p>
          </GlassCard>

          <GlassCard hover={false} className="border-fuchsia-500/10 ml-auto max-w-[85%]">
            <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-wide mb-1.5">User Prompt (Placeholder)</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Generate a water cycle flowchart diagram and save a biology study plan.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Chat input box */}
      <div className="p-4 border-t border-white/5 bg-[#09090b]/50 z-10">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            disabled
            placeholder="AI Chat workspace is locked in Scaffolding Mode..."
            className="w-full pl-4 pr-12 py-3 rounded-xl glassmorphism-input text-xs text-white disabled:opacity-50"
          />
          <button
            disabled
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-800 text-zinc-500 rounded-lg shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
