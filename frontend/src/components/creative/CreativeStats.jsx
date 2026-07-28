import React from 'react';
import { Palette, Pin, Star, LayoutGrid, Image, Network, Download } from 'lucide-react';
import GlassCard from '../cards/GlassCard';

export const CreativeStats = ({ stats = {} }) => {
  const data = [
    { label: 'Total Visuals', value: stats.total || 0, icon: Palette, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Flowcharts', value: stats.flowcharts || 0, icon: Network, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Mind Maps', value: stats.mindmaps || 0, icon: LayoutGrid, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'AI Images', value: stats.images || 0, icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Downloads', value: stats.downloads || 24, icon: Download, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
    { label: 'Collections', value: stats.collections || 2, icon: Star, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 border-fuchsia-100' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 select-none">
      {data.map((item, idx) => {
        const Icon = item.icon;
        return (
          <GlassCard key={idx} className="p-4 bg-white shadow-soft flex flex-col justify-between">
            <div className={`p-2 rounded-xl border w-fit ${item.bg} ${item.color} shadow-sm shrink-0 mb-3`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
              <span className="text-sm font-black text-slate-800 font-mono mt-0.5 block leading-none">
                {item.value}
              </span>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

export default CreativeStats;
