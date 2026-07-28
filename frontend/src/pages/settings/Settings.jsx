import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  return (
    <PageContainer>
      <div className="border-b border-white/5 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-zinc-400" />
          <span>SYSTEM CONFIGURATION</span>
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1">Configure workspace rules and API endpoints</p>
      </div>

      <GlassCard>
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">API Environment Keys</h4>
        <div className="border border-white/5 bg-zinc-950/20 p-4 rounded-xl space-y-4">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-zinc-500 font-mono">VITE_API_URL</span>
            <span className="text-indigo-400 font-bold font-mono">http://localhost:5000/api</span>
          </div>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Settings;
