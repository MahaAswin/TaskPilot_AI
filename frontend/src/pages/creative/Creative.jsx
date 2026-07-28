import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Palette } from 'lucide-react';

export const Creative = () => {
  return (
    <PageContainer>
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
          <Palette className="w-5 h-5 text-fuchsia-600" />
          <span>CREATIVE HUB</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Generated graphics and diagrams manager</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Diagram Placeholders</h4>
          <div className="border border-slate-200 bg-slate-50 aspect-[4/3] rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono font-bold">
            Mermaid compile canvas active
          </div>
        </GlassCard>

        <GlassCard>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Graphics Generation</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            The creative generator endpoints are mapped in the backend configurations.
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
};

export default Creative;
