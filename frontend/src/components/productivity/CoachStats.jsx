import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Clock, BookOpen, CheckSquare, Flame, Target, Award, TrendingUp 
} from 'lucide-react';
import ProgressRing from '../common/ProgressRing';

export const CoachStats = ({ stats = {} }) => {
  const productivityScore = stats.productivityScore || 88;
  const todayFocusTime = stats.todayFocusTime || '3h 45m';
  const learningHours = stats.learningHours || 18.2;
  const taskCompletionRate = stats.taskCompletionRate || 85;
  const consistencyScore = stats.consistencyScore || 92;
  const currentStreak = stats.currentStreak || 14;
  const goalsCompleted = stats.goalsCompleted || 8;
  const achievementsCount = stats.achievementsCount || 12;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
      
      {/* 1. Productivity Score */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between col-span-2 sm:col-span-1">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Productivity Index</span>
          <div className="text-2xl font-black text-slate-900">{productivityScore} / 100</div>
          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +5.2% this week
          </span>
        </div>
        <ProgressRing radius={34} stroke={6} progress={productivityScore} color="stroke-amber-500" />
      </motion.div>

      {/* 2. Today's Focus Time */}
      <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-5 shadow-glow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-amber-100 block tracking-wider">Today's Focus</span>
          <Clock className="w-5 h-5 text-amber-100 animate-pulse" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black">{todayFocusTime}</div>
          <span className="text-[9px] font-semibold text-amber-100 block">3 Focus Sessions Completed</span>
        </div>
      </motion.div>

      {/* 3. Consistency Score & Streak */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Habit Consistency</span>
          <Flame className="w-4 h-4 text-orange-500" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black text-slate-900">{consistencyScore}%</div>
          <span className="text-[9px] font-bold text-amber-600 block">🔥 {currentStreak} Day Streak</span>
        </div>
      </motion.div>

      {/* 4. Goals Completed & Task Completion */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Task Completion</span>
          <CheckSquare className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black text-slate-900">{taskCompletionRate}%</div>
          <span className="text-[9px] font-semibold text-indigo-600 block">{goalsCompleted} Goals Achieved</span>
        </div>
      </motion.div>

    </div>
  );
};

export default CoachStats;
