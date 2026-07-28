import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, Sparkles, AlertCircle, CheckCircle2, 
  Clock, Flame, Brain, Target, Shield 
} from 'lucide-react';
import ProgressRing from '../common/ProgressRing';

export const SkillStats = ({ profileData = {} }) => {
  const overallScore = profileData.overallScore || 78;
  const currentRank = profileData.currentRank || 'Master';
  const strongestSkill = profileData.strongestSkill || 'React Frontend (92%)';
  const weakestSkill = profileData.weakestSkill || 'Machine Learning (55%)';
  const topicsMastered = profileData.topicsMastered || 16;
  const topicsInProgress = profileData.topicsInProgress || 8;
  const learningStreak = profileData.learningStreak || 14;
  const weeklyImprovement = profileData.weeklyImprovement || '+6.2%';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 select-none">
      
      {/* 1. Overall Skill Score */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex items-center justify-between col-span-2 sm:col-span-1">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Overall Skill Score</span>
          <div className="text-2xl font-black text-slate-900">{overallScore} / 100</div>
          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {weeklyImprovement} this week
          </span>
        </div>
        <ProgressRing radius={34} stroke={6} progress={overallScore} color="stroke-indigo-600" />
      </motion.div>

      {/* 2. Current Rank */}
      <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-5 shadow-glow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-indigo-100 block tracking-wider">Global Rank</span>
          <Award className="w-5 h-5 text-amber-300 animate-bounce" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-black">{currentRank}</div>
          <span className="text-[9px] font-semibold text-indigo-100 block">Top 5% Learner</span>
        </div>
      </motion.div>

      {/* 3. Strongest Skill */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Strongest Domain</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-2">
          <h4 className="text-xs font-black text-slate-900 truncate" title={strongestSkill}>{strongestSkill}</h4>
          <span className="text-[9px] font-semibold text-emerald-600 block">Mastery Rating: Elite</span>
        </div>
      </motion.div>

      {/* 4. Weakest Skill */}
      <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Target Focus Area</span>
          <AlertCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <h4 className="text-xs font-black text-slate-900 truncate" title={weakestSkill}>{weakestSkill}</h4>
          <span className="text-[9px] font-semibold text-amber-600 block">Recommended Practice</span>
        </div>
      </motion.div>

      {/* 5. Topics Breakdown */}
      <motion.div whileHover={{ y: -2 }} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-4 flex items-center justify-between col-span-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white border border-slate-200 rounded-2xl text-indigo-600">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Topic Mastery State</span>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              <span className="text-indigo-600 font-extrabold">{topicsMastered} Mastered</span> • <span className="text-amber-600 font-bold">{topicsInProgress} In Progress</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2.5 py-1 rounded-xl border border-slate-200/80">
          24 Topics Total
        </span>
      </motion.div>

      {/* 6. Learning Streak */}
      <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-4 flex items-center justify-between col-span-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 border border-white/20 rounded-2xl text-white">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-100 block tracking-wider">Learning Streak</span>
            <div className="text-xs font-extrabold text-white mt-0.5">{learningStreak} Consecutive Days</div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-xl border border-white/30">
          🔥 Consistency Bonus
        </span>
      </motion.div>

    </div>
  );
};

export default SkillStats;
