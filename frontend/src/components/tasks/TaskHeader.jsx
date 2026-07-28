import React from 'react';
import { CheckSquare, Sparkles, RefreshCw, Bell, Layers } from 'lucide-react';

export const TaskHeader = ({ 
  totalCount = 0, 
  completedCount = 0,
  xp = 450,
  level = 4
}) => {
  return (
    <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span>TASK CENTER MATRIX</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
          <span>Planner execution queue, habits tracking, level rank and accomplishments</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-purple-600 font-bold flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Planner Agent Synced
          </span>
        </p>
      </div>

      {/* Ranks & Notifications Header Badge */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-3 py-1.5 flex items-center gap-3">
          
          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider block">Level Rank</span>
            <span className="text-xs font-black text-slate-800">Lvl {level} Explorer</span>
          </div>

          <div className="w-px h-6 bg-indigo-200/60" />

          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider block">Experience Pool</span>
            <span className="text-xs font-black text-indigo-600">{xp} XP</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TaskHeader;
