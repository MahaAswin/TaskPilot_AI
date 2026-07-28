import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, PlusCircle, Calendar, Sparkles, Trophy, Bell, Settings,
  Clock, AlertTriangle, AlertCircle, Bookmark, CheckCircle2, RefreshCw
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { useToast } from '../../context/ToastProvider';
import { taskService } from '../../services/taskService';

// Component imports
import TaskHeader from '../../components/tasks/TaskHeader';
import TaskSidebar from '../../components/tasks/TaskSidebar';
import TaskStats from '../../components/tasks/TaskStats';
import TaskList from '../../components/tasks/TaskList';
import TaskDetail from '../../components/tasks/TaskDetail';
import HabitCard from '../../components/tasks/HabitCard';
import XPCard from '../../components/tasks/XPCard';
import AchievementCard from '../../components/tasks/AchievementCard';
import LevelCard from '../../components/tasks/LevelCard';
import AnalyticsCard from '../../components/tasks/AnalyticsCard';

export const Tasks = () => {
  const { showSuccess, showError } = useToast();

  // Active sub-page tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Task & User stats states
  const [tasks, setTasks] = useState([]);
  const [xpData, setXpData] = useState({
    currentXP: 450,
    nextLevel: 500,
    xpProgress: 90,
    currentLevel: 4,
    levelTitle: 'Explorer',
    history: []
  });
  const [achievements, setAchievements] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Active selected task for Details side pane
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Settings states
  const [notifyReminder, setNotifyReminder] = useState(true);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [notifyCompleted, setNotifyCompleted] = useState(true);
  const [notifyAchievements, setNotifyAchievements] = useState(true);

  // Fetch all initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, xpRes, achRes, analyticsRes] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getXP(),
        taskService.getAchievements(),
        taskService.getAnalytics()
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (xpRes.success) setXpData(xpRes.data);
      if (achRes.success) setAchievements(achRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);

    } catch (err) {
      showError('Failed to fetch task dashboard pools');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Complete a task and award XP
  const handleToggleComplete = async (id, xpReward = 20) => {
    try {
      // Find if task is currently completed
      const taskIndex = tasks.findIndex(t => (t._id || t.id) === id);
      if (taskIndex === -1) return;
      const task = tasks[taskIndex];
      const isCompleted = task.status === 'completed';

      const nextStatus = isCompleted ? 'pending' : 'completed';
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...task, status: nextStatus };
      setTasks(updatedTasks);

      if (!isCompleted) {
        // Award XP animation
        showSuccess(`Task Completed! +${xpReward} XP earned! Streak updated.`);
        setXpData(prev => {
          const nextXP = prev.currentXP + xpReward;
          const nextLevelThreshold = prev.nextLevel;
          const didLevelUp = nextXP >= nextLevelThreshold;
          
          if (didLevelUp) {
            showSuccess(`🎉 Level Up! You reached Level ${prev.currentLevel + 1}! unlocked new ranks.`);
          }

          return {
            ...prev,
            currentXP: didLevelUp ? nextXP - nextLevelThreshold : nextXP,
            currentLevel: didLevelUp ? prev.currentLevel + 1 : prev.currentLevel,
            xpProgress: Math.min(100, Math.round(((didLevelUp ? nextXP - nextLevelThreshold : nextXP) / nextLevelThreshold) * 100))
          };
        });
      }
      
      await taskService.completeTask(id);
    } catch {
      showError('Failed to complete task.');
    }
  };

  // Add task to list
  const handleAddTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.success) {
        setTasks([res.data, ...tasks]);
        showSuccess('Task added to the execution queue successfully!');
      }
    } catch {
      showError('Failed to create task.');
    }
  };

  // Update notes/description on select detail view
  const handleUpdateTask = async (updatedTask) => {
    try {
      setTasks(prev => prev.map(t => (t._id || t.id) === (updatedTask._id || updatedTask.id) ? updatedTask : t));
      await taskService.updateTask(updatedTask);
    } catch {
      showError('Failed to save notes.');
    }
  };

  // Delete task from list
  const handleDeleteTask = async (id) => {
    try {
      setTasks(prev => prev.filter(t => (t._id || t.id) !== id));
      if (selectedTask && (selectedTask._id || selectedTask.id) === id) {
        setSelectedTask(null);
      }
      await taskService.deleteTask(id);
      showSuccess('Task removed.');
    } catch {
      showError('Failed to delete task.');
    }
  };

  // Mock habit completion
  const handleHabitComplete = (title, xpReward) => {
    setXpData(prev => {
      const nextXP = prev.currentXP + xpReward;
      const nextLevelThreshold = prev.nextLevel;
      const didLevelUp = nextXP >= nextLevelThreshold;
      return {
        ...prev,
        currentXP: didLevelUp ? nextXP - nextLevelThreshold : nextXP,
        currentLevel: didLevelUp ? prev.currentLevel + 1 : prev.currentLevel,
        xpProgress: Math.min(100, Math.round(((didLevelUp ? nextXP - nextLevelThreshold : nextXP) / nextLevelThreshold) * 100))
      };
    });
  };

  // Derived stats counts
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <PageContainer>
      {/* 1. Header with XP and Rank Pools */}
      <TaskHeader 
        totalCount={totalCount}
        completedCount={completedCount}
        xp={xpData.currentXP}
        level={xpData.currentLevel}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* 2. Left Subsidebar Navigation */}
        <TaskSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 3. Main Center Area Content */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Dashboard stats top metrics bar */}
                  <TaskStats 
                    stats={{
                      totalTasks: totalCount,
                      completed: completedCount,
                      pending: pendingCount,
                      completionRate: completionRate,
                      xp: xpData.currentXP,
                      level: xpData.currentLevel,
                      currentStreak: 14,
                      habits: 5,
                      achievements: 5
                    }}
                  />

                  {/* Task Dashboard list preview grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex justify-between items-center select-none">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Pending Execution Queue</h3>
                        <button 
                          onClick={() => setActiveTab('today')}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          View Full List
                        </button>
                      </div>

                      {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(t => (
                        <div 
                          key={t._id || t.id}
                          className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-soft"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{t.title}</h4>
                              <span className="text-[9px] text-slate-400 font-mono">{t.category} • {t.estimatedTime} mins</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-mono font-bold text-indigo-600">
                            +{t.xpReward} XP
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pending deadlines panel */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Deadlines & Alerts</h3>
                      <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-soft space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-100 p-2.5 rounded-2xl">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Overdue: Refactor middleware tests</span>
                            <p className="text-[10px] text-rose-500 mt-0.5">Missed milestone target yesterday.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-2xl">
                          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Due Today: Solve Monotonic Stack Problems</span>
                            <p className="text-[10px] text-amber-500 mt-0.5">Estimated duration: 60 mins.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TODAY'S TASKS LIST */}
              {activeTab === 'today' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <TaskList 
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onSelectTask={setSelectedTask}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={handleAddTask}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                    />
                  </div>

                  {/* Task details pane side modal */}
                  <div className="h-fit">
                    {selectedTask ? (
                      <TaskDetail 
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onUpdateTask={handleUpdateTask}
                      />
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-[10px] font-bold border-dashed border border-slate-200 rounded-3xl bg-white">
                        Click any task card in queue to inspect details, write specifications, notes or upload requirements.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: HABITS */}
              {activeTab === 'habits' && (
                <HabitCard onHabitComplete={handleHabitComplete} />
              )}

              {/* TAB 4: ACHIEVEMENTS */}
              {activeTab === 'achievements' && (
                <AchievementCard achievements={achievements} />
              )}

              {/* TAB 5: XP & LEVELS */}
              {activeTab === 'xp' && (
                <div className="space-y-6">
                  <XPCard xpData={xpData} />
                  <LevelCard currentLevel={xpData.currentLevel} />
                </div>
              )}

              {/* TAB 6: CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>Color-Coded Task Calendar Matrix</span>
                    </h3>
                    <div className="flex gap-1.5 text-[9px] font-bold">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded">High</span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">Medium</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Low</span>
                    </div>
                  </div>

                  {/* Standard Calendar Month Placeholder Grid */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span key={day} className="font-bold text-slate-400 py-1">{day}</span>
                    ))}
                    {[...Array(31)].map((_, i) => {
                      const dayNumber = i + 1;
                      const hasHighTask = dayNumber === 15;
                      const hasMedTask = dayNumber === 22;
                      const hasLowTask = dayNumber === 10;
                      
                      return (
                        <div 
                          key={i} 
                          className="min-h-[50px] p-1 bg-slate-50 border border-slate-200/50 rounded-xl flex flex-col justify-between items-start"
                        >
                          <span className="font-mono text-[10px] text-slate-500 font-bold">{dayNumber}</span>
                          <div className="w-full space-y-0.5">
                            {hasHighTask && <span className="block h-1.5 w-full bg-rose-500 rounded" title="High: Refactor test suite" />}
                            {hasMedTask && <span className="block h-1.5 w-full bg-amber-500 rounded" title="Med: Scalability flow" />}
                            {hasLowTask && <span className="block h-1.5 w-full bg-emerald-500 rounded" title="Low: Exercise daily" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 7: ANALYTICS */}
              {activeTab === 'analytics' && (
                <AnalyticsCard analyticsData={analytics} />
              )}

              {/* TAB 8: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Task Agent Preferences</h3>
                    <span className="text-[10px] font-mono text-slate-400">Settings & Notifications</span>
                  </div>

                  <div className="space-y-4">
                    {/* Toggles */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Daily Reminders</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Send a notification when task execution blocks are scheduled.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyReminder}
                        onChange={() => setNotifyReminder(!notifyReminder)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Overdue Task Alerts</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Notify when milestone target dates are missed.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyOverdue}
                        onChange={() => setNotifyOverdue(!notifyOverdue)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Task Completed Success State</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Play animation and show splash effects on XP earn.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyCompleted}
                        onChange={() => setNotifyCompleted(!notifyCompleted)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Achievement Unlock Banners</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Show notifications when badges are unlocked in XP levels.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyAchievements}
                        onChange={() => setNotifyAchievements(!notifyAchievements)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </PageContainer>
  );
};

export default Tasks;
