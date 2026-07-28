import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export const LevelCard = ({ currentLevel = 4 }) => {
  const levels = [
    { level: 1, title: 'Beginner', xpRequired: '0 XP', desc: 'Starting your personal development journey.' },
    { level: 3, title: 'Learner', xpRequired: '250 XP', desc: 'Establishing daily routines and learning habits.' },
    { level: 6, title: 'Explorer', xpRequired: '600 XP', desc: 'Exploring challenging topics and system architectures.' },
    { level: 10, title: 'Intermediate', xpRequired: '1200 XP', desc: 'Consistently maintaining streaks and milestones.' },
    { level: 15, title: 'Advanced', xpRequired: '2500 XP', desc: 'Tackling complex specifications and projects.' },
    { level: 20, title: 'Expert', xpRequired: '5000 XP', desc: 'Mentoring peers and solving advanced algorithmic scenarios.' },
    { level: 25, title: 'Master', xpRequired: '8000 XP', desc: 'Exhibiting absolute command over target skills.' },
    { level: 30, title: 'Legend', xpRequired: '12000 XP', desc: 'Ultimate status unlocked. Peer Coordinator enabled.' }
  ];

  return (
    <section className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>XP Ranks & Level Tiers</span>
          </h3>
          <p className="text-[10px] text-slate-400">Advance through ranks by collecting XP from completed tasks and active habits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {levels.map((lvl) => {
          const isUnlocked = currentLevel >= lvl.level;
          return (
            <motion.div
              key={lvl.level}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                isUnlocked
                  ? 'bg-white border-indigo-100 shadow-soft ring-1 ring-indigo-50/50'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Level {lvl.level}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>

                <h4 className="text-xs font-black text-slate-900">{lvl.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{lvl.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 text-right">
                {lvl.xpRequired}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default LevelCard;
