import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Cpu, Brain, Code, Wind, HardDrive, Shield, CheckCircle2 } from 'lucide-react';
import ProviderStatus from './ProviderStatus';

export const ProviderCard = ({ provider, isSelected, onSelectProvider }) => {
  const iconMap = {
    Sparkles,
    Zap,
    Cpu,
    Brain,
    Code,
    Wind,
    HardDrive,
    Shield
  };

  const Icon = iconMap[provider.icon] || Sparkles;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelectProvider && onSelectProvider(provider)}
      className={`p-4 rounded-3xl border transition-all cursor-pointer select-none space-y-3 flex flex-col justify-between ${
        isSelected
          ? 'bg-white border-indigo-500 ring-2 ring-indigo-200 shadow-md'
          : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-soft'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Icon className="w-4.5 h-4.5" />
          </div>
          <ProviderStatus status={provider.status} />
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <span>{provider.name}</span>
            {provider.isDefault && (
              <span className="px-1.5 py-0.25 bg-amber-50 border border-amber-200 text-amber-700 text-[8px] font-mono font-bold rounded">
                Default
              </span>
            )}
          </h4>
          <span className="text-[10px] font-mono text-slate-400">Model: {provider.model}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span>Latency: {provider.latency}</span>
        <span>Priority #{provider.priority}</span>
      </div>
    </motion.div>
  );
};

export default ProviderCard;
