import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, CheckCircle2, Clock, BookOpen, 
  ListTodo, ChevronDown, ChevronUp, Check
} from 'lucide-react';

export const WeeklyCard = ({ weekData, onTaskToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!weekData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold rounded-full text-[10px] uppercase">
              {weekData.week}
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {weekData.hoursEstimated} Hours
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900">{weekData.title}</h4>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>Weekly Progress</span>
          <span className="font-bold">{weekData.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${weekData.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2"
          >
            {/* Objectives */}
            {weekData.objectives?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Weekly Objectives</span>
                <ul className="space-y-1">
                  {weekData.objectives.map((obj, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics Pills */}
            {weekData.topics?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1">Topics:</span>
                {weekData.topics.map((topic, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200/80 text-slate-700 rounded-lg text-[10px] font-bold">
                    {topic}
                  </span>
                ))}
              </div>
            )}

            {/* Tasks Checklist */}
            {weekData.tasks?.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tasks</span>
                {weekData.tasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => onTaskToggle && onTaskToggle(task.id)}
                    className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {task.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeeklyCard;
