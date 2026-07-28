import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Clock, CheckCircle2 } from 'lucide-react';
import ProviderStatus from './ProviderStatus';
import { PROVIDERS_LIST } from '../../constants/aiMockData';

export const ProviderHealthCard = ({ healthList = PROVIDERS_LIST }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AI Provider Health & Fallback Telemetry</span>
          </h3>
          <p className="text-[10px] text-slate-400">Live latency and system availability across registered LLM providers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {healthList.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -1 }}
            className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-soft flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-900">{p.name}</h4>
              <span className="text-[10px] font-mono text-slate-400">Avg Latency: {p.latency}</span>
            </div>
            <ProviderStatus status={p.status} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProviderHealthCard;
