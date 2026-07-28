import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Palette } from 'lucide-react';

export const Creative = () => {
  return (
    <PageContainer>
      <div className="border-b border-white/5 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
          <Palette className="w-5 h-5 text-fuchsia-400" />
          <span>CREATIVE HUB</span>
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1">Generated graphics and diagrams manager</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Diagram Placeholders</h4>
          <div className="border border-white/5 bg-zinc-950/40 aspect-[4/3] rounded-xl flex items-center justify-center text-xs text-zinc-500 font-mono">
            Mermaid compile canvas active
          </div>
        </GlassCard>

        <GlassCard>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Graphics Generation</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The creative generator endpoints are mapped in the backend configurations.
          </p>
        </GlassCard>
      </div>
    </PageContainer>
  );
};

export default Creative;
