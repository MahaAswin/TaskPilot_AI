import React from 'react';
import { BookOpen, Pin, Star, FileEdit, Award } from 'lucide-react';
import GlassCard from '../cards/GlassCard';

export const KnowledgeStats = ({ stats }) => {
  const data = [
    { label: 'Total Notes', value: stats.total || 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Pinned Guides', value: stats.pinned || 0, icon: Pin, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Favorites', value: stats.favorites || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Drafts', value: stats.drafts || 0, icon: FileEdit, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item, idx) => {
        const Icon = item.icon;
        return (
          <GlassCard key={idx} className="p-4 bg-white shadow-soft flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${item.bg} ${item.color} shadow-sm shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
              <span className="text-lg font-black text-slate-800 font-mono leading-none mt-1 block">
                {item.value}
              </span>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

export default KnowledgeStats;
