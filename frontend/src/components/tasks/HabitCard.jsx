import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Flame, Check, Bookmark, Calendar, Award } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const HabitCard = ({ onHabitComplete }) => {
  const { showSuccess } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');
  const [habits, setHabits] = useState([
    { id: 'h-1', title: 'Study Daily', streak: 12, completedToday: true },
    { id: 'h-2', title: 'Practice DSA', streak: 8, completedToday: false },
    { id: 'h-3', title: 'Read Books', streak: 4, completedToday: true },
    { id: 'h-4', title: 'Exercise', streak: 14, completedToday: false },
    { id: 'h-5', title: 'Meditation', streak: 2, completedToday: true }
  ]);

  const handleToggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextCompleted = !h.completedToday;
        const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
        if (nextCompleted) {
          showSuccess(`Habit "${h.title}" completed! Streak extended to ${nextStreak} days! (+15 XP)`);
          if (onHabitComplete) onHabitComplete(h.title, 15);
        }
        return { ...h, completedToday: nextCompleted, streak: nextStreak };
      }
      return h;
    }));
  };

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const newH = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle,
      streak: 0,
      completedToday: false
    };
    setHabits([newH, ...habits]);
    setNewHabitTitle('');
    setShowAddForm(false);
    showSuccess(`Habit "${newH.title}" registered in Habit tracker.`);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Habit & Routine Tracker</span>
          </h3>
          <p className="text-[10px] text-slate-400">Track daily consistency and protect your completion streak.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Add Habit Inline Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleCreateHabit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <input
                type="text"
                value={newHabitTitle}
                onChange={e => setNewHabitTitle(e.target.value)}
                placeholder="e.g. Code for 30 minutes"
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-400"
              />
              <div className="flex items-center justify-between gap-3">
                <select
                  value={newHabitFrequency}
                  onChange={e => setNewHabitFrequency(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-600 focus:outline-none"
                >
                  <option value="daily">Daily Habit</option>
                  <option value="weekly">Weekly Routine</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            whileHover={{ y: -2 }}
            className={`p-4 bg-white border rounded-2xl shadow-soft flex items-center justify-between gap-3 transition-all ${
              habit.completedToday 
                ? 'border-emerald-200 bg-emerald-50/10' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <h4 className="text-xs font-black text-slate-800 truncate">{habit.title}</h4>
              <div className="flex items-center gap-1.5">
                <Flame className={`w-3.5 h-3.5 ${habit.streak > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                <span className="text-[10px] font-mono font-bold text-slate-500">{habit.streak} day streak</span>
              </div>
            </div>

            {/* Check Toggle Trigger */}
            <button
              onClick={() => handleToggleHabit(habit.id)}
              className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                habit.completedToday
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-soft'
                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50 text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3px]" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Spaced Streaks Heatmap Placeholder */}
      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
        <span className="text-[9px] font-black uppercase text-indigo-600 block tracking-wider mb-2">Consistency Grid (Last 30 Days)</span>
        <div className="flex flex-wrap gap-1">
          {[...Array(30)].map((_, i) => {
            const completed = i % 4 !== 0;
            return (
              <span 
                key={i} 
                className={`w-3 h-3 rounded-sm ${
                  completed ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
                title={`Day ${i + 1}: ${completed ? 'Completed' : 'Missed'}`}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default HabitCard;
