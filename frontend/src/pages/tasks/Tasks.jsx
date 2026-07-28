import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { CheckSquare, PlusCircle } from 'lucide-react';

export const Tasks = () => {
  return (
    <PageContainer>
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-400" />
          <span>TASKS MATRIX</span>
        </h1>
        <button 
          disabled
          className="flex items-center gap-2 px-3.5 py-2 bg-zinc-800 text-[10px] text-zinc-500 font-bold rounded-xl cursor-not-allowed"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Queue Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex justify-between items-center text-[10px] text-zinc-500">
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded">High Priority</span>
              <span>Due: Tomorrow</span>
            </div>
            <h4 className="text-xs font-bold text-white mt-3">Refactor Monorepo Middleware Stack</h4>
            <p className="text-[10px] text-zinc-500 mt-1">Implement standard validation checks across all folders.</p>
          </GlassCard>
        </div>

        <GlassCard className="h-fit">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Queue Analytics</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Link the task model to allow CRUD actions in the next phase.
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
};

export default Tasks;
