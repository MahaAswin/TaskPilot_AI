import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { GraduationCap } from 'lucide-react';

export const Knowledge = () => {
  return (
    <PageContainer>
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-600" />
          <span>KNOWLEDGE ARCHIVE</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Study materials summaries and keynotes list</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Summarized Concept Guide</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-mono font-semibold">
            // Scaffolding Active. <br />
            // Summarized note structures can be logged here.
          </p>
        </GlassCard>

        <GlassCard>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Study Tips</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            The knowledge agent summary route `/api/knowledge/summarize` is ready for implementation.
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
};

export default Knowledge;
