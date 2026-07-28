import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { SHARED_CONTEXT } from '../../constants/orchestratorMockData';

export const ContextCard = ({ context = SHARED_CONTEXT }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-5 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Shared Memory & Context Viewer</span>
          </h3>
          <p className="text-[10px] text-slate-400">Live memory object synchronized across all 8 sub-agent dispatches.</p>
        </div>

        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-mono font-bold rounded-full">
          State: {context.executionState}
        </span>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Active Intent & Goal</span>
          <div className="font-bold text-slate-900">{context.activeIntent}</div>
          <p className="text-[11px] text-slate-600 font-mono">Goal: "{context.goal}"</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Workflow Pattern</span>
          <div className="font-bold text-indigo-600">{context.workflowType}</div>
          <div className="flex flex-wrap gap-1 pt-1">
            {context.selectedAgents.map((ag, i) => (
              <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono text-slate-700 font-bold">
                {ag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Shared Memory JSON Box */}
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Shared Memory Snapshot</span>
        <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
          {JSON.stringify(context.sharedMemory, null, 2)}
        </pre>
      </div>

    </div>
  );
};

export default ContextCard;
