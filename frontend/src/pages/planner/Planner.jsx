import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Target, Map, BookOpen, RotateCcw, Plus, Check,
  Trash2, ChevronRight, Clock, Flag, Sparkles, Sun, Sunset, Moon, Star
} from 'lucide-react';

import PlannerStats from '../../components/planner/PlannerStats';
import CalendarUI from '../../components/planner/CalendarUI';
import RoadmapCard from '../../components/planner/RoadmapCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { useToast } from '../../context/ToastProvider';

// ─── constants ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: CalendarDays },
  { id: 'daily',      label: 'Daily',      icon: Sun },
  { id: 'weekly',     label: 'Weekly',     icon: Clock },
  { id: 'calendar',   label: 'Calendar',   icon: CalendarDays },
  { id: 'goals',      label: 'Goals',      icon: Target },
  { id: 'roadmaps',   label: 'Roadmaps',   icon: Map },
  { id: 'revision',   label: 'Revision',   icon: RotateCcw },
];

const PRIORITY_COLORS = {
  high:   'bg-rose-50 border-rose-200 text-rose-700',
  medium: 'bg-amber-50 border-amber-200 text-amber-700',
  low:    'bg-emerald-50 border-emerald-200 text-emerald-700',
};

const GOAL_TYPE_COLORS = {
  'short-term': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  'long-term':  'bg-purple-50 border-purple-200 text-purple-700',
  career:       'bg-rose-50 border-rose-200 text-rose-700',
  study:        'bg-emerald-50 border-emerald-200 text-emerald-700',
  project:      'bg-amber-50 border-amber-200 text-amber-700',
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_SLOTS = [
  { id: 'morning',   label: 'Morning',   icon: Sun,    time: '6 AM – 12 PM' },
  { id: 'afternoon', label: 'Afternoon', icon: Sunset, time: '12 PM – 6 PM'  },
  { id: 'evening',   label: 'Evening',   icon: Star,   time: '6 PM – 10 PM'  },
  { id: 'night',     label: 'Night',     icon: Moon,   time: '10 PM – 12 AM' },
];

export const Planner = () => {
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Data state
  const [plans, setPlans]           = useState([]);
  const [goals, setGoals]           = useState([]);
  const [roadmaps, setRoadmaps]     = useState([]);
  const [events, setEvents]         = useState([]);
  const [revisions, setRevisions]   = useState([]);

  // New plan form
  const [showPlanForm, setShowPlanForm]     = useState(false);
  const [planTitle, setPlanTitle]           = useState('');
  const [planCategory, setPlanCategory]     = useState('daily');
  const [planPriority, setPlanPriority]     = useState('medium');
  const [planDuration, setPlanDuration]     = useState(30);
  const [planDate, setPlanDate]             = useState(new Date().toISOString().split('T')[0]);
  const [planSlot, setPlanSlot]             = useState('morning');
  const [submittingPlan, setSubmittingPlan] = useState(false);

  // New goal form
  const [showGoalForm, setShowGoalForm]   = useState(false);
  const [goalTitle, setGoalTitle]         = useState('');
  const [goalType, setGoalType]           = useState('study');
  const [goalDate, setGoalDate]           = useState('');
  const [goalDesc, setGoalDesc]           = useState('');
  const [submittingGoal, setSubmittingGoal] = useState(false);

  // Revision form
  const [showRevForm, setShowRevForm]     = useState(false);
  const [revTopic, setRevTopic]           = useState('');
  const [revInterval, setRevInterval]     = useState(7);
  const [submittingRev, setSubmittingRev] = useState(false);

  // ── fetch all data ──────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [plansRes, goalsRes, rmRes, calRes, revRes] = await Promise.all([
        axios.get('/planner/all'),
        axios.get('/planner/goals'),
        axios.get('/planner/roadmaps'),
        axios.get('/planner/calendar'),
        axios.get('/planner/revisions'),
      ]);
      if (plansRes.data?.success)  setPlans(plansRes.data.data);
      if (goalsRes.data?.success)  setGoals(goalsRes.data.data);
      if (rmRes.data?.success)     setRoadmaps(rmRes.data.data);
      if (calRes.data?.success)    setEvents(calRes.data.data);
      if (revRes.data?.success)    setRevisions(revRes.data.data);
    } catch {
      showError('Failed to load planner data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planTitle) return showError('Plan title is required.');
    setSubmittingPlan(true);
    try {
      const res = await axios.post('/planner/create', {
        title: planTitle, category: planCategory,
        priority: planPriority, estimatedDuration: planDuration,
        plannedDate: planDate, description: `Slot: ${planSlot}`
      });
      if (res.data?.success) {
        setPlans(prev => [res.data.data, ...prev]);
        showSuccess('Plan item created!');
        setPlanTitle(''); setShowPlanForm(false);
      }
    } catch { showError('Failed to create plan.'); }
    finally { setSubmittingPlan(false); }
  };

  const handleDeletePlan = async (id) => {
    try {
      await axios.delete('/planner/delete', { data: { id } });
      setPlans(prev => prev.filter(p => p._id !== id));
      showSuccess('Plan removed.');
    } catch { showError('Failed to delete plan.'); }
  };

  const handleMarkComplete = async (plan) => {
    try {
      const res = await axios.put('/planner/update', {
        id: plan._id, status: plan.status === 'completed' ? 'pending' : 'completed',
        completedDate: new Date()
      });
      if (res.data?.success) setPlans(prev => prev.map(p => p._id === plan._id ? res.data.data : p));
    } catch { showError('Failed to update plan.'); }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalTitle || !goalDate) return showError('Title and target date are required.');
    setSubmittingGoal(true);
    try {
      const res = await axios.post('/planner/goals', {
        title: goalTitle, type: goalType, targetDate: goalDate, description: goalDesc
      });
      if (res.data?.success) {
        setGoals(prev => [res.data.data, ...prev]);
        showSuccess('Goal created!');
        setGoalTitle(''); setGoalDesc(''); setGoalDate(''); setShowGoalForm(false);
      }
    } catch { showError('Failed to create goal.'); }
    finally { setSubmittingGoal(false); }
  };

  const handleCreateRevision = async (e) => {
    e.preventDefault();
    if (!revTopic) return showError('Topic is required.');
    setSubmittingRev(true);
    try {
      const res = await axios.post('/planner/revisions', { topic: revTopic, interval: revInterval });
      if (res.data?.success) {
        setRevisions(prev => [res.data.data, ...prev]);
        showSuccess('Revision plan added!');
        setRevTopic(''); setShowRevForm(false);
      }
    } catch { showError('Failed to create revision plan.'); }
    finally { setSubmittingRev(false); }
  };

  // ── derived helpers ─────────────────────────────────────────────────────────
  const todayStr = new Date().toDateString();
  const todayPlans = plans.filter(p => new Date(p.plannedDate).toDateString() === todayStr);
  const completedCount = plans.filter(p => p.status === 'completed').length;
  const pendingCount   = plans.filter(p => p.status === 'pending').length;

  const plansBySlot = (slot) =>
    todayPlans.filter(p => (p.description || '').includes(slot));

  const plansByDay = (day) => {
    const dayIdx = DAYS_OF_WEEK.indexOf(day);
    return plans.filter(p => {
      const d = new Date(p.plannedDate);
      return d.getDay() === (dayIdx + 1) % 7;
    });
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <span>PLANNER HUB</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Daily schedules, goals, roadmaps, and revision plans</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
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
      </div>

      {isLoading ? (
        <LoadingSpinner size="large" />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >

            {/* ── DASHBOARD ─────────────────────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* AI Planning Canvas Hero Banner */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-5 sm:p-6 text-white shadow-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-wider border border-white/30">
                        New Feature
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight">AI Planning Canvas & Roadmap Builder</h2>
                    <p className="text-xs text-indigo-100 max-w-xl">
                      Describe any goal in natural language and visualize complete execution roadmaps, milestone graphs, and daily time slots.
                    </p>
                  </div>
                  <Link
                    to="/planning-canvas"
                    className="px-5 py-2.5 bg-white hover:bg-slate-100 text-indigo-700 text-xs font-black rounded-2xl shadow-sm flex items-center justify-center gap-2 shrink-0 transition-all"
                  >
                    <span>Launch AI Canvas</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <PlannerStats stats={{ today: todayPlans.length, weekly: plans.length, completed: completedCount, pending: pendingCount, goals: goals.length, upcoming: events.length }} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's schedule */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Today's Schedule</h3>
                      <button onClick={() => setActiveTab('daily')} className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5 hover:underline">
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    {todayPlans.length === 0 ? (
                      <GlassCard className="p-8 text-center text-slate-400 text-[10px] font-bold font-mono uppercase border-dashed">
                        No plans scheduled for today. Add one →
                      </GlassCard>
                    ) : (
                      <div className="space-y-2">
                        {todayPlans.slice(0, 5).map(plan => (
                          <div key={plan._id} className={`flex items-center gap-3 px-4 py-2.5 border rounded-xl bg-white shadow-soft ${plan.status === 'completed' ? 'opacity-60' : ''}`}>
                            <button onClick={() => handleMarkComplete(plan)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${plan.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                              {plan.status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                            </button>
                            <span className={`flex-1 text-[10px] font-bold ${plan.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{plan.title}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[plan.priority]}`}>{plan.priority}</span>
                            <span className="text-[8px] font-mono text-slate-400">{plan.estimatedDuration}m</span>
                            <button onClick={() => handleDeletePlan(plan._id)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upcoming events sidebar */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 select-none">Upcoming Events</h3>
                    <GlassCard className="p-4 bg-white border border-slate-200 shadow-soft space-y-3">
                      {events.slice(0, 5).map((ev, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: ev.color || '#4F46E5' }} />
                          <div>
                            <span className="block text-[10px] font-bold text-slate-700">{ev.title}</span>
                            <span className="text-[8px] font-mono text-slate-400">{new Date(ev.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      ))}
                    </GlassCard>
                  </div>
                </div>
              </div>
            )}

            {/* ── DAILY PLANNER ─────────────────────────────────────────── */}
            {activeTab === 'daily' && (
              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Daily Planner — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setShowPlanForm(!showPlanForm)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Plan
                  </button>
                </div>

                {/* Add plan form */}
                <AnimatePresence>
                  {showPlanForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <GlassCard className="p-5 bg-white border border-indigo-100 shadow-soft space-y-4">
                        <form onSubmit={handleCreatePlan} className="space-y-3">
                          <input
                            value={planTitle} onChange={e => setPlanTitle(e.target.value)}
                            placeholder="Plan title (e.g. Study Binary Trees)"
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <select value={planSlot} onChange={e => setPlanSlot(e.target.value)}
                              className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 focus:outline-none">
                              {DAY_SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                            <select value={planPriority} onChange={e => setPlanPriority(e.target.value)}
                              className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 focus:outline-none">
                              <option value="high">High Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="low">Low Priority</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Duration (min)</label>
                              <input type="number" min={5} max={480} value={planDuration} onChange={e => setPlanDuration(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                            </div>
                            <div>
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Date</label>
                              <input type="date" value={planDate} onChange={e => setPlanDate(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                            </div>
                          </div>
                          <button type="submit" disabled={submittingPlan}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer disabled:opacity-50 transition-all">
                            {submittingPlan ? 'Saving...' : 'Save Plan'}
                          </button>
                        </form>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Time slots */}
                {DAY_SLOTS.map(slot => {
                  const Icon = slot.icon;
                  const slotPlans = plansBySlot(slot.id);
                  return (
                    <div key={slot.id} className="space-y-2">
                      <div className="flex items-center gap-2 select-none">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{slot.label}</span>
                        <span className="text-[8px] font-mono text-slate-350">{slot.time}</span>
                      </div>
                      {slotPlans.length === 0 ? (
                        <div className="px-4 py-3 border border-dashed border-slate-200 rounded-xl text-[9px] text-slate-350 font-mono text-center">
                          No plans in this slot
                        </div>
                      ) : (
                        slotPlans.map(plan => (
                          <div key={plan._id} className={`flex items-center gap-3 px-4 py-2.5 border rounded-xl bg-white shadow-soft ${plan.status === 'completed' ? 'opacity-60' : ''}`}>
                            <button onClick={() => handleMarkComplete(plan)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${plan.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-400'}`}>
                              {plan.status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                            </button>
                            <span className={`flex-1 text-[10px] font-bold ${plan.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{plan.title}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[plan.priority]}`}>{plan.priority}</span>
                            <span className="text-[8px] font-mono text-slate-400">{plan.estimatedDuration}m</span>
                            <button onClick={() => handleDeletePlan(plan._id)} className="p-1 text-slate-300 hover:text-rose-500 cursor-pointer">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── WEEKLY PLANNER ────────────────────────────────────────── */}
            {activeTab === 'weekly' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 select-none">Weekly Planner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                  {DAYS_OF_WEEK.map(day => {
                    const dayPlans = plansByDay(day);
                    return (
                      <div key={day} className="bg-white border border-slate-200 rounded-2xl shadow-soft p-3 flex flex-col gap-2 min-h-[140px]">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block border-b border-slate-100 pb-1.5">{day.slice(0, 3)}</span>
                        {dayPlans.length === 0 ? (
                          <span className="text-[8px] text-slate-350 font-mono flex-1 flex items-center justify-center">Free</span>
                        ) : (
                          dayPlans.map(p => (
                            <div key={p._id} className={`px-2 py-1 rounded-lg border text-[8px] font-bold truncate ${PRIORITY_COLORS[p.priority]}`}>
                              {p.title}
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CALENDAR ──────────────────────────────────────────────── */}
            {activeTab === 'calendar' && (
              <div className="max-w-2xl mx-auto">
                <GlassCard className="p-6 bg-white border border-slate-200 shadow-soft">
                  <CalendarUI events={events} />
                </GlassCard>
              </div>
            )}

            {/* ── GOALS ─────────────────────────────────────────────────── */}
            {activeTab === 'goals' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Goals</h3>
                  <button onClick={() => setShowGoalForm(!showGoalForm)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all">
                    <Plus className="w-3.5 h-3.5" /> New Goal
                  </button>
                </div>

                <AnimatePresence>
                  {showGoalForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <GlassCard className="p-5 bg-white border border-indigo-100 shadow-soft">
                        <form onSubmit={handleCreateGoal} className="space-y-3">
                          <input value={goalTitle} onChange={e => setGoalTitle(e.target.value)} placeholder="Goal title"
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                          <input value={goalDesc} onChange={e => setGoalDesc(e.target.value)} placeholder="Description (optional)"
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                          <div className="grid grid-cols-2 gap-3">
                            <select value={goalType} onChange={e => setGoalType(e.target.value)}
                              className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 focus:outline-none">
                              <option value="short-term">Short-Term</option>
                              <option value="long-term">Long-Term</option>
                              <option value="career">Career</option>
                              <option value="study">Study</option>
                              <option value="project">Project</option>
                            </select>
                            <input type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)}
                              className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                          </div>
                          <button type="submit" disabled={submittingGoal}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer disabled:opacity-50">
                            {submittingGoal ? 'Creating...' : 'Create Goal'}
                          </button>
                        </form>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {goals.map((goal, idx) => (
                    <div key={goal._id || idx} className="bg-white border border-slate-200 rounded-2xl shadow-soft p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${GOAL_TYPE_COLORS[goal.type] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            {goal.type}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${goal.status === 'achieved' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                            {goal.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800">{goal.title}</h4>
                        {goal.description && <p className="text-[9px] text-slate-500 mt-0.5">{goal.description}</p>}
                        <p className="text-[8px] font-mono text-slate-400 mt-1">
                          Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <Flag className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ROADMAPS ──────────────────────────────────────────────── */}
            {activeTab === 'roadmaps' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 select-none">Learning Roadmaps</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {roadmaps.map((rm, idx) => (
                    <RoadmapCard key={rm._id || idx} roadmap={rm} />
                  ))}
                </div>
              </div>
            )}

            {/* ── REVISION PLANNER ──────────────────────────────────────── */}
            {activeTab === 'revision' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Revision Planner</h3>
                  <button onClick={() => setShowRevForm(!showRevForm)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all">
                    <Plus className="w-3.5 h-3.5" /> Add Topic
                  </button>
                </div>

                <AnimatePresence>
                  {showRevForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <GlassCard className="p-5 bg-white border border-indigo-100 shadow-soft">
                        <form onSubmit={handleCreateRevision} className="space-y-3">
                          <input value={revTopic} onChange={e => setRevTopic(e.target.value)} placeholder="Topic to revise (e.g. Binary Trees)"
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                          <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Revision Interval (days)</label>
                            <input type="number" min={1} max={60} value={revInterval} onChange={e => setRevInterval(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400" />
                          </div>
                          <button type="submit" disabled={submittingRev}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer disabled:opacity-50">
                            {submittingRev ? 'Saving...' : 'Add Revision Plan'}
                          </button>
                        </form>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {revisions.map((rv, idx) => (
                    <div key={rv._id || idx} className="bg-white border border-slate-200 rounded-2xl shadow-soft p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xs font-black text-slate-800">{rv.topic}</h4>
                          <p className="text-[8px] font-mono text-slate-400 mt-0.5">Every {rv.interval} days</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm font-black font-mono text-indigo-600">{rv.progress}%</span>
                          <span className="text-[8px] text-slate-400">progress</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                        <motion.div className="h-full bg-indigo-500 rounded-full"
                          initial={{ width: 0 }} animate={{ width: `${rv.progress}%` }} transition={{ duration: 0.4 }} />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-slate-400">
                        <span>Last: {rv.lastRevised ? new Date(rv.lastRevised).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not yet'}</span>
                        <span className="text-indigo-600 font-bold">Next: {rv.nextRevision ? new Date(rv.nextRevision).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}
    </PageContainer>
  );
};

export default Planner;
