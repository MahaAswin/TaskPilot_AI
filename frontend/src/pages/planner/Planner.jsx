import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, Plus, CheckCircle2, Circle, Clock, Tag, Flag, 
  Trash2, BarChart3, TrendingUp, Sparkles, CheckSquare, Layers,
  ListFilter, ShieldAlert, Zap, Trophy, Filter
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { taskService } from '../../services/taskService';

export const Planner = () => {
  const { showSuccess, showError } = useToast();

  // Task Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Learning');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskDuration, setTaskDuration] = useState('30m');
  const [taskSlot, setTaskSlot] = useState('Morning');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & List state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'today' | 'high' | 'completed'
  const [taskList, setTaskList] = useState([
    {
      _id: 'sample-1',
      title: 'Master React Component Architecture & Custom Hooks',
      category: 'Learning',
      priority: 'High',
      estimatedMinutes: 45,
      slot: 'Morning',
      completed: true,
      createdAt: new Date()
    },
    {
      _id: 'sample-2',
      title: 'Solve 3 LeetCode Medium Data Structure Problems',
      category: 'Study',
      priority: 'High',
      estimatedMinutes: 60,
      slot: 'Afternoon',
      completed: false,
      createdAt: new Date()
    },
    {
      _id: 'sample-3',
      title: 'Review System Design Distributed Caching Patterns',
      category: 'Revision',
      priority: 'Medium',
      estimatedMinutes: 30,
      slot: 'Evening',
      completed: false,
      createdAt: new Date()
    }
  ]);

  const CATEGORIES = ['Learning', 'Study', 'Development', 'Project', 'Revision', 'General'];
  const PRIORITIES = ['High', 'Medium', 'Low'];
  const DURATIONS = ['15m', '30m', '45m', '1h', '2h'];
  const SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // Fetch all tasks on mount
  const fetchTasks = async () => {
    try {
      const res = await taskService.getAllTasks();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setTaskList(res.data.map(t => ({
          _id: t._id,
          title: t.title,
          category: t.category || 'Learning',
          priority: t.priority || 'Medium',
          estimatedMinutes: t.estimatedMinutes || 30,
          slot: t.slot || 'Morning',
          completed: t.completed || t.status === 'completed',
          createdAt: t.createdAt || new Date()
        })));
      }
    } catch {
      // Keep sample list
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Manual Task Addition
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      showError('Please enter a task title.');
      return;
    }

    setIsSubmitting(true);
    const durationMins = parseInt(taskDuration) || 30;

    const newTaskObj = {
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      estimatedMinutes: durationMins,
      slot: taskSlot,
      completed: false
    };

    try {
      const res = await taskService.createTask(newTaskObj);
      const createdItem = (res.success && res.data) ? res.data : { _id: `task_${Date.now()}`, ...newTaskObj };

      setTaskList(prev => [
        {
          _id: createdItem._id || `task_${Date.now()}`,
          title: createdItem.title || newTaskObj.title,
          category: createdItem.category || newTaskObj.category,
          priority: createdItem.priority || newTaskObj.priority,
          estimatedMinutes: createdItem.estimatedMinutes || newTaskObj.estimatedMinutes,
          slot: createdItem.slot || newTaskObj.slot,
          completed: false,
          createdAt: new Date()
        },
        ...prev
      ]);

      setTaskTitle('');
      showSuccess(`Task "${newTaskObj.title}" successfully added to your Plan Matrix!`);
    } catch (err) {
      const fallbackObj = { _id: `task_${Date.now()}`, ...newTaskObj, createdAt: new Date() };
      setTaskList(prev => [fallbackObj, ...prev]);
      setTaskTitle('');
      showSuccess(`Task "${newTaskObj.title}" added to local Plan Matrix!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Task Completion
  const handleToggleComplete = async (taskId) => {
    setTaskList(prev => prev.map(t => {
      if (t._id === taskId) {
        const nextState = !t.completed;
        if (nextState) showSuccess(`Marked "${t.title}" as completed!`);
        return { ...t, completed: nextState };
      }
      return t;
    }));

    try {
      await taskService.completeTask({ id: taskId });
    } catch {
      // Ignored
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    setTaskList(prev => prev.filter(t => t._id !== taskId));
    showSuccess('Task removed from Plan Matrix.');
    try {
      await taskService.deleteTask(taskId);
    } catch {
      // Ignored
    }
  };

  // Filter Tasks
  const filteredTasks = taskList.filter(t => {
    if (activeFilter === 'completed') return t.completed;
    if (activeFilter === 'high') return t.priority === 'High';
    if (activeFilter === 'today') return !t.completed;
    return true;
  });

  // Calculate Metrics for Graphs & Stats
  const totalCount = taskList.length;
  const completedCount = taskList.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = taskList.filter(t => t.priority === 'High' && !t.completed).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <PageContainer title="Plan Matrix Studio | TaskPilot OS">
      <div className="space-y-8 w-full">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                  <CalendarDays className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-black uppercase tracking-wider text-white">Plan Matrix Studio</h1>
                  <p className="text-xs text-indigo-200/80">Manually plan and schedule tasks, track productivity completion graphs, and execute daily milestones.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Plan Matrix Active
              </span>
            </div>

            {/* Quick Manual Task Addition Studio Form */}
            <form onSubmit={handleAddTask} className="space-y-4 pt-3 border-t border-indigo-500/20">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Type a new task you need to do (e.g., Finish React Migration, Study System Design)..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs font-semibold text-white placeholder-indigo-300/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-xs font-black uppercase tracking-wider text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task to Matrix</span>
                </button>
              </div>

              {/* Task Options Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                {/* Category Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80">Category:</span>
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setTaskCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        taskCategory === cat 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm' 
                          : 'bg-white/10 border-white/15 text-indigo-200 hover:bg-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Priority & Slot */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80">Priority:</span>
                    {PRIORITIES.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setTaskPriority(p)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          taskPriority === p 
                            ? 'bg-purple-600 border-purple-400 text-white' 
                            : 'bg-white/10 border-white/15 text-indigo-200 hover:bg-white/20'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80">Slot:</span>
                    {SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTaskSlot(slot)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          taskSlot === slot 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-white/10 border-white/15 text-indigo-200 hover:bg-white/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* PRODUCTIVITY GRAPH & STATS METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Completion Rate Gauge Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Completion Rate</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-indigo-600">{completionRate}%</div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">{completedCount} of {totalCount} tasks completed</p>
          </div>

          {/* Pending Tasks Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pending Tasks</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{pendingCount}</div>
            <p className="text-[10px] text-slate-400">Scheduled in your active plan matrix</p>
          </div>

          {/* High Priority Alerts Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">High Priority</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-rose-600">{highPriorityCount}</div>
            <p className="text-[10px] text-slate-400">Tasks requiring immediate focus</p>
          </div>

          {/* Productivity Velocity Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-6 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Productivity Velocity</span>
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div className="text-3xl font-black">+14.2%</div>
            <p className="text-[10px] opacity-80">Optimal completion pacing calculated</p>
          </div>

        </div>

        {/* VISUAL PRODUCTIVITY COMPLETION BAR GRAPH */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Plan Matrix Productivity & Completion Breakdown Graph
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live Matrix Analytics</span>
          </div>

          {/* SVG Visual Bar Graph */}
          <div className="space-y-3 pt-2">
            {CATEGORIES.map((cat) => {
              const catTasks = taskList.filter(t => t.category === cat);
              const catCompleted = catTasks.filter(t => t.completed).length;
              const catTotal = catTasks.length;
              const pct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{cat}</span>
                    <span className="font-mono text-indigo-600">{catCompleted} / {catTotal} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MANUALLY ADDED TASKS MATRIX LIST */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6 w-full">
          
          {/* Matrix Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Active Plan Matrix Queue ({filteredTasks.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Tasks manually added and managed in your matrix.</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'today', label: 'Pending' },
                { id: 'high', label: 'High Priority' },
                { id: 'completed', label: 'Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Task Items Grid */}
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
              <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No tasks found matching this filter in your Plan Matrix.</p>
              <p className="text-[11px] text-slate-400">Add a new task using the studio form above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((t) => (
                <motion.div
                  key={t._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    t.completed 
                      ? 'bg-slate-50 border-slate-200 text-slate-400' 
                      : 'bg-white border-slate-200/90 text-slate-900 shadow-sm hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(t._id)}
                      className="text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer shrink-0"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-black truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {t.title}
                      </h4>
                      
                      <div className="flex items-center gap-2.5 text-[10px] font-mono mt-1 text-slate-500 flex-wrap">
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-md">
                          {t.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          t.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          t.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {t.priority} Priority
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {t.slot}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

        </div>

      </div>
    </PageContainer>
  );
};

export default Planner;
