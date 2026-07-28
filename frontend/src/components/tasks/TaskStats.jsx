import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Award, Target, Sparkles, CheckSquare, ListTodo, ClipboardCheck, LayoutGrid 
} from 'lucide-react';
import ProgressRing from '../common/ProgressRing';

export const TaskStats = ({ 
  stats = {
    totalTasks: 18,
    completed: 12,
    pending: 6,
    completionRate: 66,
    xp: 450,
    level: 4,
    currentStreak: 14,
    habits: 5,
    achievements: 5
  }
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
      
      {/* 1. Streak */}
      <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-glow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-amber-100 block tracking-wider">Habit Streak</span>
          <Flame className="w-5 h-5 text-white/90 animate-bounce" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black">{stats.currentStreak} Days</div>
          <span className="text-[9px] font-semibold text-amber-100 block">🔥 On Fire</span>
        </div>
      </motion.div>

      {/* 2. XP */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Experience</span>
          <Sparkles className="w-4 h-4 text-indigo-600 animate-spin-slow" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black text-slate-800">{stats.xp} XP</div>
          <span className="text-[9px] font-semibold text-indigo-500 block">Next level: 500 XP</span>
        </div>
      </motion.div>

      {/* 3. Level */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Level Ranks</span>
          <Award className="w-4 h-4 text-purple-600" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black text-slate-800">Lvl {stats.level}</div>
          <span className="text-[9px] font-semibold text-purple-600 block">Rank: Explorer</span>
        </div>
      </motion.div>

      {/* 4. Completion Rate Ring */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft flex items-center justify-between col-span-2 lg:col-span-2">
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Completion Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-800">{stats.completionRate}%</span>
            <span className="text-[9px] font-bold text-slate-400">Optimal velocity</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-400 block">{stats.completed} of {stats.totalTasks} completed</span>
        </div>
        
        <ProgressRing radius={35} stroke={6} progress={stats.completionRate} color="stroke-indigo-600" />
      </motion.div>

      {/* 5. Habits & Badges overview */}
      <motion.div whileHover={{ y: -2 }} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[9px] font-black uppercase tracking-wider block">Achievements</span>
          <LayoutGrid className="w-3.5 h-3.5" />
        </div>
        <div className="mt-2 flex justify-between items-baseline">
          <div>
            <div className="text-xl font-black text-slate-800">{stats.achievements}</div>
            <span className="text-[9px] font-semibold text-slate-400 block">Unlocked</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-slate-800">{stats.habits}</div>
            <span className="text-[8px] font-bold text-slate-400 block uppercase">Habits</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default TaskStats;
