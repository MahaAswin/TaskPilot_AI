import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  return (
    <PageContainer>
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-slate-600" />
          <span>SYSTEM CONFIGURATION</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 font-semibold">Configure workspace rules and API endpoints</p>
      </div>

      <GlassCard>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">API Environment Keys</h3>
        <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl space-y-4">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-mono font-bold">VITE_API_URL</span>
            <span className="text-indigo-600 font-extrabold font-mono">http://localhost:5000/api</span>
          </div>
        </div>
      </GlassCard>
    </PageContainer>
  );
};

export default Settings;
