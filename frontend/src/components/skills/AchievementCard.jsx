import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Database, Award, CheckCircle2, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../../constants/skillMockData';

export const AchievementCard = ({ achievements = ACHIEVEMENTS }) => {
  const iconMap = {
    Trophy,
    Flame,
    Zap,
    Database,
    Award
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Skill Milestones & Badges</span>
          </h3>
          <p className="text-[10px] text-slate-400">Accomplishments earned through quiz accuracy, code submissions, and study consistency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          const Icon = iconMap[ach.icon] || Award;
          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                    {ach.badge}
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900">{ach.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{ach.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>Earned {ach.date}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementCard;
