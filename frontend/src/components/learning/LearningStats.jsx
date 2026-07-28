import React from 'react';
import { BookOpen, Award, GraduationCap, Star, Clock, AlertCircle } from 'lucide-react';
import GlassCard from '../cards/GlassCard';

export const LearningStats = ({ stats = {} }) => {
  const data = [
    { label: 'Study Hours', value: stats.hours || '4.2h', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Topics Completed', value: stats.topics || 12, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Flashcards Reviewed', value: stats.flashcards || 36, icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Quiz Scores Avg', value: stats.quizScore || '88%', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Bookmarks Count', value: stats.bookmarks || 5, icon: Star, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
    { label: 'Study Streak', value: stats.streak || '4 Days 🔥', icon: AlertCircle, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 border-fuchsia-100' }
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

export default LearningStats;
