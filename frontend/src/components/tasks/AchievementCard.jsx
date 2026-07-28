import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Sun, Moon, CheckSquare, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

export const AchievementCard = ({ achievements = [] }) => {
  const defaultAchievements = achievements.length > 0 ? achievements : [
    { id: 'ach-1', title: 'First Task Completed', description: 'Crossed the starting line.', unlocked: true, unlockedAt: new Date(), xpReward: 50, icon: 'CheckSquare' },
    { id: 'ach-2', title: '7 Day Streak', description: 'Maintained a week-long streak of daily plans completed.', unlocked: true, unlockedAt: new Date(), xpReward: 100, icon: 'Flame' },
    { id: 'ach-3', title: '30 Day Streak', description: 'Dedicated consistency for 30 consecutive days.', unlocked: false, unlockedAt: null, xpReward: 250, icon: 'Award' },
    { id: 'ach-4', title: '100 Tasks Completed', description: 'Finished 100 manual or suggested tasks.', unlocked: false, unlockedAt: null, xpReward: 300, icon: 'CheckSquare' },
    { id: 'ach-5', title: '1000 XP Milestone', description: 'Earned a total of 1000 XP across all activities.', unlocked: true, unlockedAt: new Date(), xpReward: 150, icon: 'Sparkles' },
    { id: 'ach-6', title: 'Early Bird', description: 'Completed a task before 8:00 AM.', unlocked: true, unlockedAt: new Date(), xpReward: 50, icon: 'Sun' },
    { id: 'ach-7', title: 'Night Owl', description: 'Finished a coding session past midnight.', unlocked: false, unlockedAt: null, xpReward: 50, icon: 'Moon' },
    { id: 'ach-8', title: 'Focused Learner', description: 'Completed 5 learning sessions without interruptions.', unlocked: true, unlockedAt: new Date(), xpReward: 100, icon: 'Award' }
  ];

  const iconMap = {
    CheckSquare,
    Flame,
    Award,
    Sparkles,
    Sun,
    Moon
  };

  return (
    <section className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Badges & Achievements</span>
          </h3>
          <p className="text-[10px] text-slate-400">Unlock level rewards, multiplier streaks, and dedication tags.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {defaultAchievements.map((ach) => {
          const IconComponent = iconMap[ach.icon] || Award;
          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 relative ${
                ach.unlocked
                  ? 'bg-white border-indigo-100 shadow-soft'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-2xl border ${
                    ach.unlocked 
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-300" />
                  )}
                </div>

                <h4 className="text-xs font-extrabold text-slate-900">{ach.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{ach.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono">
                <span className="text-indigo-600 font-bold">+{ach.xpReward} XP</span>
                <span className="text-slate-400">
                  {ach.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AchievementCard;
