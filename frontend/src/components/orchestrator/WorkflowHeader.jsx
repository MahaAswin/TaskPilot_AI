import React from 'react';
import { Network, Cpu, Play, RefreshCw, Layers, Sparkles } from 'lucide-react';

export const WorkflowHeader = ({ 
  totalExecutions = 142, 
  activeAgentsCount = 8,
  onRunWorkflow,
  onReplayWorkflow,
  isRunning
}) => {
  return (
    <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span>MULTI-AGENT ORCHESTRATION ENGINE</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
          <span>Agentic AI Operating System — Routing all 8 sub-agents through Coordinator Agent</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-purple-600 font-bold flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Shared Context Memory Online
          </span>
        </p>
      </div>

      {/* Stats Badges & Actions */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-3.5 py-1.5 flex items-center gap-3">
          
          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider block">Agents Pool</span>
            <span className="text-xs font-black text-slate-900">{activeAgentsCount} Agents Active</span>
          </div>

          <div className="w-px h-6 bg-indigo-200/60" />

          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider block">Total Pipeline Runs</span>
            <span className="text-xs font-black text-indigo-600">{totalExecutions} Executions</span>
          </div>

        </div>

        <button
          onClick={onRunWorkflow}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'Orchestrating...' : 'Run Goal Pipeline'}</span>
        </button>

        <button
          onClick={onReplayWorkflow}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/60"
          title="Replay Last Workflow"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Replay</span>
        </button>
      </div>

    </div>
  );
};

export default WorkflowHeader;
