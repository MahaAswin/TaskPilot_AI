import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Zap, Brain, CheckSquare, BookOpen,
  Flame, Award, Target, Clock, Sparkles, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import ProgressRing from '../../components/common/ProgressRing';
import { SKILL_CATEGORIES, TIMELINE_GROWTH } from '../../constants/skillMockData';
import { PRODUCTIVITY_STATS, TIME_ANALYSIS, WEEKLY_REPORT } from '../../constants/productivityMockData';

const TABS = [
  { id: 'overview',     label: 'Overview',      icon: BarChart3 },
  { id: 'skills',       label: 'Skill Growth',  icon: Brain },
  { id: 'tasks',        label: 'Task Metrics',  icon: CheckSquare },
  { id: 'productivity', label: 'Focus & Time',  icon: Zap },
  { id: 'learning',     label: 'Learning',      icon: BookOpen },
];

const WEEKLY_XP = [
  { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 200 }, { day: 'Wed', xp: 80 },
  { day: 'Thu', xp: 260 }, { day: 'Fri', xp: 180 }, { day: 'Sat', xp: 310 }, { day: 'Sun', xp: 150 },
];

const TASK_CATEGORIES = [
  { label: 'Study Daily',   count: 12, color: 'bg-indigo-500',  pct: 34 },
  { label: 'Practice DSA',  count: 18, color: 'bg-purple-500',  pct: 51 },
  { label: 'Read Books',    count: 5,  color: 'bg-emerald-500', pct: 14 },
];

const LEARNING_ACTIVITY = [
  { week: 'W1', flashcards: 24, quizzes: 3, sessions: 5 },
  { week: 'W2', flashcards: 36, quizzes: 5, sessions: 8 },
  { week: 'W3', flashcards: 28, quizzes: 4, sessions: 6 },
  { week: 'W4', flashcards: 48, quizzes: 7, sessions: 10 },
];

const maxXP = Math.max(...WEEKLY_XP.map(d => d.xp));

// Minimal inline bar chart
const BarChart = ({ data, valueKey, labelKey, color = 'bg-indigo-500', maxVal }) => {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d[valueKey] / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`w-full ${color} rounded-t-md min-h-[4px]`}
          />
          <span className="text-[8px] font-bold text-slate-400">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
};

// Stat card
const StatCard = ({ label, value, sub, icon: Icon, color, gradient }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`rounded-2xl p-4 shadow-soft flex flex-col justify-between ${gradient || 'bg-white border border-slate-200'}`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-[9px] font-black uppercase tracking-wider ${gradient ? 'text-white/70' : 'text-slate-400'}`}>{label}</span>
      <Icon className={`w-4 h-4 ${color || 'text-indigo-600'}`} />
    </div>
    <div className="mt-2">
      <div className={`text-xl font-black ${gradient ? 'text-white' : 'text-slate-800'}`}>{value}</div>
      {sub && <span className={`text-[9px] font-semibold ${gradient ? 'text-white/60' : 'text-slate-400'}`}>{sub}</span>}
    </div>
  </motion.div>
);

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600 animate-pulse" />
            <span>ANALYTICS PANEL</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Cross-agent unified performance metrics & growth tracking</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-black text-emerald-700">+6.2% this week</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6 select-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >

          {/* ── OVERVIEW ─────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Top KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Productivity Score" value={`${PRODUCTIVITY_STATS.productivityScore}%`} sub="↑ +4% vs last week" icon={Zap} color="text-amber-500" />
                <StatCard label="Overall Skill Score" value="78 / 100" sub="Master rank" icon={Brain} color="text-indigo-600" />
                <StatCard label="Tasks Completed" value="18 / 21" sub="85% completion rate" icon={CheckSquare} color="text-emerald-600" />
                <StatCard label="Learning Streak" value="14 Days" sub="🔥 On fire" icon={Flame} color="text-orange-500" gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
              </div>

              {/* XP Bar Chart + Completion Ring */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2 p-5 bg-white border border-slate-200 shadow-soft">
                  <div className="flex items-center justify-between mb-4 select-none">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Weekly XP Earned</h4>
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">1,300 XP Total</span>
                  </div>
                  <BarChart data={WEEKLY_XP} valueKey="xp" labelKey="day" color="bg-indigo-500" />
                </GlassCard>

                <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft flex flex-col items-center justify-center gap-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 self-start select-none">Overall Progress</h4>
                  <ProgressRing radius={52} stroke={8} progress={78} color="stroke-indigo-600" />
                  <div className="text-center select-none">
                    <p className="text-[10px] font-black text-slate-700">Master Rank</p>
                    <p className="text-[9px] text-slate-400 font-semibold">Top 5% of learners</p>
                  </div>
                </GlassCard>
              </div>

              {/* Weekly summary banner */}
              <GlassCard className="p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-glow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-indigo-200">Weekly Summary — {WEEKLY_REPORT.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-100 max-w-xl">{WEEKLY_REPORT.summary}</p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    {[
                      { label: 'Learning', value: WEEKLY_REPORT.weeklyLearning },
                      { label: 'Tasks', value: '85%' },
                      { label: 'Skill ↑', value: WEEKLY_REPORT.skillImprovement },
                    ].map(m => (
                      <div key={m.label} className="text-center">
                        <div className="text-sm font-black text-white">{m.value}</div>
                        <div className="text-[8px] font-bold text-indigo-200 uppercase tracking-wider">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Time breakdown */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Time Allocation This Week</h4>
                <div className="space-y-3">
                  {TIME_ANALYSIS.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-600 w-32 shrink-0">{t.category}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${t.percentage}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08 }}
                          className={`h-full ${t.color} rounded-full`}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 w-10 text-right">{t.hours}h</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {/* ── SKILL GROWTH ─────────────────────────────────────────── */}
          {activeTab === 'skills' && (
            <>
              {/* Growth timeline */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">4-Week Skill Score Growth</h4>
                <div className="flex items-end gap-3 h-28">
                  {TIMELINE_GROWTH.map((w, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[9px] font-black text-indigo-600">{w.score}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(w.score / 100) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg min-h-[8px]"
                      />
                      <span className="text-[8px] font-bold text-slate-400">{w.week}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 select-none">
                  <span>Topics Mastered: <span className="text-indigo-600">16</span></span>
                  <span>Avg Quiz Score: <span className="text-emerald-600">88%</span></span>
                  <span>Growth: <span className="text-emerald-600">+19pts</span></span>
                </div>
              </GlassCard>

              {/* Top skill domains */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILL_CATEGORIES.slice(0, 6).map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-black">{cat.score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-800 truncate">{cat.title}</span>
                        <span className="text-[8px] font-bold text-slate-400 ml-2 shrink-0">{cat.level}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.progress}%` }}
                          transition={{ duration: 0.5, delay: i * 0.06 }}
                          className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* ── TASK METRICS ─────────────────────────────────────────── */}
          {activeTab === 'tasks' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Tasks" value="35" sub="All time" icon={CheckSquare} color="text-indigo-600" />
                <StatCard label="Completed" value="18" sub="This week" icon={Award} color="text-emerald-600" />
                <StatCard label="Overdue" value="2" sub="Needs attention" icon={Target} color="text-rose-500" />
                <StatCard label="Avg XP / Task" value="28 XP" sub="Per completion" icon={Sparkles} color="text-purple-600" gradient="bg-gradient-to-br from-indigo-600 to-purple-700" />
              </div>

              {/* Category breakdown */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Task Category Breakdown</h4>
                <div className="space-y-4">
                  {TASK_CATEGORIES.map((cat, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-700">{cat.label}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400">{cat.count} tasks · {cat.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.pct}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className={`h-full ${cat.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Weekly task bar chart */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Daily Task Completions This Week</h4>
                <BarChart
                  data={[
                    { day: 'Mon', count: 3 }, { day: 'Tue', count: 5 }, { day: 'Wed', count: 2 },
                    { day: 'Thu', count: 6 }, { day: 'Fri', count: 4 }, { day: 'Sat', count: 7 }, { day: 'Sun', count: 3 },
                  ]}
                  valueKey="count" labelKey="day" color="bg-emerald-500"
                />
              </GlassCard>
            </>
          )}

          {/* ── PRODUCTIVITY / FOCUS ─────────────────────────────────── */}
          {activeTab === 'productivity' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Focus Hours" value={`${PRODUCTIVITY_STATS.focusHours}h`} sub="This week" icon={Clock} color="text-amber-500" />
                <StatCard label="Productivity" value={`${PRODUCTIVITY_STATS.productivityScore}%`} sub="Score" icon={Zap} color="text-indigo-600" />
                <StatCard label="Consistency" value={`${PRODUCTIVITY_STATS.consistencyScore}%`} sub="Habit rate" icon={Flame} color="text-orange-500" gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
                <StatCard label="Goals Done" value={PRODUCTIVITY_STATS.goalsCompleted} sub="This month" icon={Target} color="text-emerald-600" />
              </div>

              {/* Focus time bar chart */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Daily Focus Time (hours)</h4>
                <BarChart
                  data={[
                    { day: 'Mon', hrs: 3.5 }, { day: 'Tue', hrs: 4.2 }, { day: 'Wed', hrs: 2.8 },
                    { day: 'Thu', hrs: 5.0 }, { day: 'Fri', hrs: 3.8 }, { day: 'Sat', hrs: 5.5 }, { day: 'Sun', hrs: 4.0 },
                  ]}
                  valueKey="hrs" labelKey="day" color="bg-amber-500"
                />
              </GlassCard>

              {/* Time allocation */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Time Allocation Breakdown</h4>
                <div className="space-y-3">
                  {TIME_ANALYSIS.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${t.color} shrink-0`} />
                      <span className="text-[10px] font-bold text-slate-600 w-36 shrink-0">{t.category}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${t.percentage}%` }}
                          transition={{ duration: 0.5, delay: i * 0.08 }}
                          className={`h-full ${t.color} rounded-full`}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 w-12 text-right">{t.percentage}%</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {/* ── LEARNING ─────────────────────────────────────────────── */}
          {activeTab === 'learning' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Study Hours" value={`${PRODUCTIVITY_STATS.learningHours}h`} sub="This week" icon={BookOpen} color="text-blue-600" />
                <StatCard label="Flashcards" value="136" sub="Total reviewed" icon={Sparkles} color="text-purple-600" />
                <StatCard label="Quizzes" value="19" sub="Completed" icon={Award} color="text-emerald-600" gradient="bg-gradient-to-br from-indigo-600 to-purple-700" />
                <StatCard label="Avg Score" value="88%" sub="Quiz accuracy" icon={TrendingUp} color="text-teal-600" />
              </div>

              {/* Learning activity chart */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Weekly Learning Activity</h4>
                <div className="space-y-5">
                  {[
                    { label: 'Flashcards Reviewed', key: 'flashcards', color: 'bg-indigo-500' },
                    { label: 'Quizzes Completed',   key: 'quizzes',    color: 'bg-purple-500' },
                    { label: 'Study Sessions',       key: 'sessions',   color: 'bg-emerald-500' },
                  ].map((metric, mi) => {
                    const max = Math.max(...LEARNING_ACTIVITY.map(d => d[metric.key]));
                    return (
                      <div key={mi}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{metric.label}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400">
                            Total: {LEARNING_ACTIVITY.reduce((a, d) => a + d[metric.key], 0)}
                          </span>
                        </div>
                        <div className="flex items-end gap-2 h-14">
                          {LEARNING_ACTIVITY.map((w, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(w[metric.key] / max) * 100}%` }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                className={`w-full ${metric.color} rounded-t min-h-[4px]`}
                              />
                              <span className="text-[7px] font-bold text-slate-400">{w.week}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Recent quiz scores */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Recent Quiz Performance</h4>
                <div className="space-y-2">
                  {[
                    { topic: 'Binary Trees & BST Traversals',       score: 94, delta: '+6%' },
                    { topic: 'SQL Indexing & B-Trees',               score: 90, delta: '+2%' },
                    { topic: 'System Design Load Balancers',         score: 86, delta: '+4%' },
                    { topic: 'Dynamic Programming 2D Memoization',   score: 68, delta: '-3%' },
                    { topic: 'TCP/IP 4-Layer Architecture',          score: 70, delta: '+5%' },
                  ].map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-700 truncate max-w-[60%]">{q.topic}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-bold flex items-center gap-0.5 ${q.delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {q.delta.startsWith('+') ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                          {q.delta}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border font-mono ${
                          q.score >= 85 ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : q.score >= 70 ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}>{q.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
};

export default Analytics;
