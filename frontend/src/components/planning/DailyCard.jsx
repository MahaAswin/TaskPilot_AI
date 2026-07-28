import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Star, Clock, CheckCircle2, Check, Flag } from 'lucide-react';

export const DailyCard = ({ slotData, onTaskToggle }) => {
  if (!slotData) return null;

  const slotIcons = {
    morning: { icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    afternoon: { icon: Sunset, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    evening: { icon: Star, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    night: { icon: Moon, color: 'text-purple-500 bg-purple-50 border-purple-200' }
  };

  const currentSlot = slotIcons[slotData.slot] || slotIcons.morning;
  const Icon = currentSlot.icon;

  const priorityColors = {
    high: 'bg-rose-50 border-rose-200 text-rose-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3"
    >
      {/* Time Slot Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${currentSlot.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">{slotData.label}</h4>
            <span className="text-[10px] font-mono text-slate-400">{slotData.time}</span>
          </div>
        </div>

        {slotData.focus && (
          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 hidden sm:inline">
            Focus: {slotData.focus}
          </span>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {slotData.tasks?.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskToggle && onTaskToggle(task.id)}
            className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
              task.completed
                ? 'bg-slate-50 border-slate-200/60 opacity-75'
                : 'bg-white border-slate-200 hover:border-indigo-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-500'
              }`}>
                {task.completed && <Check className="w-2.5 h-2.5" />}
              </button>

              <span className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.medium}`}>
                {task.priority}
              </span>
              <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-slate-400" /> {task.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DailyCard;
