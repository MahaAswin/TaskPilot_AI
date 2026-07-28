import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Filter, Search, CalendarDays, ClipboardList, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import TaskCard from './TaskCard';

export const TaskList = ({ 
  tasks = [], 
  onToggleComplete, 
  onSelectTask, 
  onDeleteTask, 
  onAddTask,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskDuration, setNewTaskDuration] = useState(30);

  const filters = [
    { id: 'all', label: 'All Tasks', icon: ClipboardList },
    { id: 'today', label: 'Today', icon: CalendarDays },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'high', label: 'High Priority', icon: AlertTriangle }
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      category: newTaskCategory,
      estimatedTime: Number(newTaskDuration),
      xpReward: 20,
      status: 'pending'
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(t => {
    // Search filter
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.priority.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // View filter
    if (activeFilter === 'today') return t.status !== 'completed';
    if (activeFilter === 'upcoming') return t.status !== 'completed' && t.dueDate;
    if (activeFilter === 'completed') return t.status === 'completed';
    if (activeFilter === 'high') return t.priority === 'high' && t.status !== 'completed';
    return true;
  });

  return (
    <div className="space-y-5 select-none">
      
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, category, priority..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 shadow-soft transition-all"
          />
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Add Form Dialog Placeholder */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleCreate} className="p-5 bg-white border border-indigo-100 rounded-3xl shadow-soft space-y-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Task title (e.g. Master dynamic programming)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
              <textarea
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                placeholder="Description / notes (optional)"
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <input
                  type="text"
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value)}
                  placeholder="Category (e.g. Study Daily)"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
                />

                <input
                  type="number"
                  value={newTaskDuration}
                  onChange={e => setNewTaskDuration(e.target.value)}
                  placeholder="Estimated minutes"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow cursor-pointer"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Cards List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
            <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">No matching tasks in queue</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Add a new task or adjust filters to get started.</p>
          </div>
        ) : (
          filteredTasks.map(t => (
            <TaskCard
              key={t._id || t.id}
              task={t}
              onToggleComplete={onToggleComplete}
              onSelectTask={onSelectTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default TaskList;
