import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Clock, Flag, Tag, Trash2, Edit2, AlertCircle, Sparkles, RefreshCw
} from 'lucide-react';

export const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onSelectTask, 
  onDeleteTask 
}) => {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  const priorityColors = {
    high: 'bg-rose-50 border-rose-200 text-rose-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white border rounded-2xl p-4 shadow-soft transition-all flex items-start gap-4 ${
        isCompleted 
          ? 'border-slate-200/80 bg-slate-50/50 opacity-70' 
          : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      {/* Checkbox Trigger with custom scale animation */}
      <div className="pt-0.5 shrink-0 select-none">
        <button
          onClick={() => onToggleComplete(task._id || task.id, task.xpReward)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
            isCompleted 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-slate-300 hover:border-indigo-500 bg-white'
          }`}
        >
          {isCompleted && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="w-3.5 h-3.5 stroke-[3px]" />
            </motion.div>
          )}
        </button>
      </div>

      {/* Main info clickable to select task details */}
      <div 
        className="flex-1 min-w-0 cursor-pointer space-y-1"
        onClick={() => onSelectTask(task)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.medium}`}>
            {task.priority}
          </span>
          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {task.category || 'General'}
          </span>
          {task.isRecurring && (
            <span className="text-[8px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.25 flex items-center gap-0.5">
              <RefreshCw className="w-2.5 h-2.5" /> Recurring
            </span>
          )}
        </div>

        <h4 className={`text-xs font-black truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {task.title}
        </h4>
        
        {task.description && (
          <p className="text-[11px] text-slate-500 truncate">{task.description}</p>
        )}

        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
          {task.estimatedTime > 0 && (
            <span className="flex items-center gap-1 font-bold">
              <Clock className="w-3 h-3 text-slate-400" /> {task.estimatedTime} mins
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-slate-400" /> Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 px-1 rounded">+{task.xpReward || 20} XP</span>
        </div>
      </div>

      {/* Action Buttons Right */}
      <div className="flex items-center gap-1.5 shrink-0 self-center">
        <button
          onClick={() => onSelectTask(task)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-transparent"
          title="Edit Details"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDeleteTask(task._id || task.id)}
          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
          title="Delete Task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

    </motion.div>
  );
};

export default TaskCard;
