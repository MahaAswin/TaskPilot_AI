import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, Calendar, PieChart, Flame, Lightbulb, Target, History, Settings, Sparkles 
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { productivityService } from '../../services/productivityService';

// Component imports
import CoachHeader from '../../components/productivity/CoachHeader';
import CoachSidebar from '../../components/productivity/CoachSidebar';
import CoachStats from '../../components/productivity/CoachStats';
import ProductivityCard from '../../components/productivity/ProductivityCard';
import FocusCard from '../../components/productivity/FocusCard';
import FocusTimer from '../../components/productivity/FocusTimer';
import ReportCard from '../../components/productivity/ReportCard';
import InsightCard from '../../components/productivity/InsightCard';
import RecommendationCard from '../../components/productivity/RecommendationCard';
import TimelineCard from '../../components/productivity/TimelineCard';
import HabitAnalyticsCard from '../../components/productivity/HabitAnalyticsCard';
import ProgressCard from '../../components/productivity/ProgressCard';

import { PRODUCTIVITY_STATS } from '../../constants/productivityMockData';

export const ProductivityCenter = () => {
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(PRODUCTIVITY_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Settings states
  const [notifyFocusBreak, setNotifyFocusBreak] = useState(true);
  const [notifyDailyReport, setNotifyDailyReport] = useState(true);
  const [notifyRestReminders, setNotifyRestReminders] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await productivityService.getDashboard();
      if (res.success) setStats(res.data);
    } catch {
      showError('Failed to load productivity metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <PageContainer>
      {/* 1. Header */}
      <CoachHeader 
        productivityScore={stats.productivityScore}
        currentStreak={stats.currentStreak}
        onLaunchFocusMode={() => setActiveTab('focus')}
        onExportReports={() => setActiveTab('daily')}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* 2. Left Navigation Drawer */}
        <CoachSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 3. Main Center Content Area */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* VIEW 1: PRODUCTIVITY DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <CoachStats stats={stats} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProductivityCard />
                    <FocusTimer />
                  </div>

                  <InsightCard />
                </div>
              )}

              {/* VIEW 2: DAILY REPORT */}
              {activeTab === 'daily' && (
                <ReportCard />
              )}

              {/* VIEW 3: WEEKLY REPORT */}
              {activeTab === 'weekly' && (
                <ReportCard />
              )}

              {/* VIEW 4: MONTHLY REPORT */}
              {activeTab === 'monthly' && (
                <ReportCard />
              )}

              {/* VIEW 5: FOCUS SESSIONS */}
              {activeTab === 'focus' && (
                <div className="space-y-6">
                  <FocusTimer />
                  <FocusCard />
                </div>
              )}

              {/* VIEW 6: TIME ANALYSIS */}
              {activeTab === 'time' && (
                <div className="space-y-6">
                  <ProductivityCard />
                </div>
              )}

              {/* VIEW 7: HABIT ANALYTICS */}
              {activeTab === 'habits' && (
                <HabitAnalyticsCard />
              )}

              {/* VIEW 8: RECOMMENDATIONS */}
              {activeTab === 'recommendations' && (
                <RecommendationCard />
              )}

              {/* VIEW 9: GOALS PROGRESS */}
              {activeTab === 'goals' && (
                <ProgressCard />
              )}

              {/* VIEW 10: INSIGHTS TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <InsightCard />
                  <TimelineCard />
                </div>
              )}

              {/* VIEW 11: COACH SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-5 select-none">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Productivity Coach Preferences</h3>
                    <span className="text-[10px] font-mono text-slate-400">Settings & Notifications</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Focus Session Break Alerts</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Play notification sound when 25-minute focus block expires.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyFocusBreak}
                        onChange={() => setNotifyFocusBreak(!notifyFocusBreak)}
                        className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Daily Report Synthesis</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Auto-generate daily productivity report at 9:00 PM.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyDailyReport}
                        onChange={() => setNotifyDailyReport(!notifyDailyReport)}
                        className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Work-Life Balance & Fatigue Prompts</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Suggest rest breaks when focus time exceeds 4 continuous hours.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyRestReminders}
                        onChange={() => setNotifyRestReminders(!notifyRestReminders)}
                        className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
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

export default ProductivityCenter;
