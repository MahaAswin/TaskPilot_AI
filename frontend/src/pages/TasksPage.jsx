import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, CheckSquare, Trash2, Calendar, ShieldAlert, Sparkles, 
  Tag, ListTodo, PlusCircle, CheckCircle, Clock, Loader2 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useToast } from '../context/ToastContext';

const TasksPage = () => {
  const { addToast } = useToast();
  
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newCategory, setNewCategory] = useState('General');
  const [newDueDate, setNewDueDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const fetchTasksData = async () => {
    try {
      setIsLoading(true);
      const resTasks = await axios.get('/tasks');
      const resRecs = await axios.get('/tasks/recommendations');

      if (resTasks.data?.success) setTasks(resTasks.data.tasks);
      if (resRecs.data?.success) setRecommendations(resRecs.data.recommendations);
    } catch (err) {
      addToast('Failed to fetch tasks list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setIsAdding(true);
    try {
      const res = await axios.post('/tasks', {
        title: newTitle,
        description: newDesc,
        dueDate: new Date(newDueDate),
        priority: newPriority,
        category: newCategory
      });

      if (res.data?.success) {
        setTasks((prev) => [...prev, res.data.task]);
        setNewTitle('');
        setNewDesc('');
        addToast('Task created successfully!', 'success');
        
        // Refresh recommendations
        const resRecs = await axios.get('/tasks/recommendations');
        if (resRecs.data?.success) setRecommendations(resRecs.data.recommendations);
      }
    } catch (err) {
      addToast('Failed to add task.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const targetStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const res = await axios.put(`/tasks/${taskId}`, { status: targetStatus });
      if (res.data?.success) {
        setTasks((prev) => prev.map((t) => t._id === taskId ? res.data.task : t));
        addToast(targetStatus === 'completed' ? 'Task checked off!' : 'Task re-opened.', 'success');
        
        // Refresh recommendations
        const resRecs = await axios.get('/tasks/recommendations');
        if (resRecs.data?.success) setRecommendations(resRecs.data.recommendations);
      }
    } catch (err) {
      addToast('Failed to toggle status.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await axios.delete(`/tasks/${taskId}`);
      if (res.data?.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        addToast('Task deleted.', 'success');

        // Refresh recommendations
        const resRecs = await axios.get('/tasks/recommendations');
        if (resRecs.data?.success) setRecommendations(resRecs.data.recommendations);
      }
    } catch (err) {
      addToast('Failed to delete task.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6 items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="text-zinc-500 text-sm font-semibold tracking-wider uppercase font-mono">
          Loading checklists...
        </span>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans flex items-center gap-3">
          <ListTodo className="w-8 h-8 text-indigo-500" />
          <span>Productivity Checklists</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1 font-medium">
          Create, execute, and monitor task matrices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Center: Tasks list + Addition */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick task addition form */}
          <GlassCard className="!p-5">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Queue New Task Item</span>
            </h3>
            
            <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task title (e.g. Submit homework checklist)"
                  className="w-full px-4 py-2.5 rounded-xl glassmorphism-input text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short description (optional details)"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl glassmorphism-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glassmorphism-input text-xs appearance-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glassmorphism-input text-xs"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glassmorphism-input text-xs"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-xs font-bold text-white rounded-xl shadow-glow transition-all"
                >
                  {isAdding ? 'Creating...' : 'Deploy Task to Matrix'}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Active Tasks Grid */}
          <div className="space-y-4">
            <h2 className="text-md font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Active Operations ({activeTasks.length})</span>
            </h2>

            {activeTasks.length === 0 ? (
              <div className="text-center py-10 text-xs text-zinc-500 bg-white/2 rounded-2xl border border-white/5 border-dashed">
                All done! Zero pending tasks. Use the Chat to add more checklist plans.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className="p-4 rounded-xl border border-white/5 bg-zinc-900/40 flex flex-col justify-between hover:border-indigo-500/20 transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                          task.priority === 'high' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : task.priority === 'medium' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {task.priority}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleTaskStatus(task._id, task.status)}
                            className="p-1 hover:bg-emerald-950/20 border border-transparent hover:border-emerald-500/20 rounded-md text-zinc-500 hover:text-emerald-400 transition-all"
                            title="Complete Task"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/20 rounded-md text-zinc-500 hover:text-rose-400 transition-all"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                      {task.description && (
                        <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-2.5 text-[10px] text-zinc-400 leading-none font-medium">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        {task.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks section */}
          {completedTasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-md font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Completed Archive</span>
              </h2>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {completedTasks.map((task) => (
                  <div key={task._id} className="p-3 bg-zinc-900/20 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle 
                        className="w-4.5 h-4.5 text-emerald-400 cursor-pointer shrink-0" 
                        onClick={() => handleToggleTaskStatus(task._id, task.status)}
                      />
                      <span className="text-xs text-zinc-500 line-through truncate font-medium">{task.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1 hover:bg-rose-950/20 rounded text-zinc-500 hover:text-rose-400 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right column: AI Task analysis suggestions */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">AI Scheduler Analysis</h3>
            </div>
            
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
              TaskPilot AI analyzes your database checklist in the background. Here are smart tips to optimize your day:
            </p>

            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-600">
                  No alerts computed yet.
                </div>
              ) : (
                recommendations.map((rec, i) => (
                  <div key={i} className="p-3.5 bg-white/2 border border-white/5 rounded-xl flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-zinc-300 font-semibold leading-relaxed">
                      {rec.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            <hr className="border-white/5" />

            <div className="text-center">
              <p className="text-[9px] text-zinc-600 font-medium">
                Tip: Type "Create a task for project presentation" in Chat to let the Task Agent configure dates dynamically.
              </p>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default TasksPage;
