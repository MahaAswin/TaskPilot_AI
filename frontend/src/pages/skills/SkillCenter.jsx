import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Compass, Layers, ListFilter, BarChart3, TrendingUp, 
  Award, Lightbulb, FileText, Settings, RefreshCw, Download, Sparkles 
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { skillService } from '../../services/skillService';

// Component imports
import SkillHeader from '../../components/skills/SkillHeader';
import SkillSidebar from '../../components/skills/SkillSidebar';
import SkillStats from '../../components/skills/SkillStats';
import SkillCard from '../../components/skills/SkillCard';
import CategoryCard from '../../components/skills/CategoryCard';
import ProgressCard from '../../components/skills/ProgressCard';
import RadarChartCard from '../../components/skills/RadarChartCard';
import TimelineCard from '../../components/skills/TimelineCard';
import AnalyticsCard from '../../components/skills/AnalyticsCard';
import RecommendationCard from '../../components/skills/RecommendationCard';
import AchievementCard from '../../components/skills/AchievementCard';
import ReportCard from '../../components/skills/ReportCard';

import { SKILL_CATEGORIES } from '../../constants/skillMockData';

export const SkillCenter = () => {
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileData, setProfileData] = useState({
    overallScore: 78,
    currentRank: 'Master',
    strongestSkill: 'React Frontend Development (92%)',
    weakestSkill: 'Machine Learning (55%)',
    topicsMastered: 16,
    topicsInProgress: 8,
    learningStreak: 14,
    weeklyImprovement: '+6.2%'
  });
  const [categories, setCategories] = useState(SKILL_CATEGORIES);
  const [reports, setReports] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(SKILL_CATEGORIES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Settings states
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyWeakAreas, setNotifyWeakAreas] = useState(true);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const [profRes, repRes] = await Promise.all([
        skillService.getProfile(),
        skillService.getReports()
      ]);
      if (profRes.success) setProfileData(profRes.data);
      if (repRes.success) setReports(repRes.data);
    } catch {
      showError('Failed to load skill profile metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAnalyzeSkills = async () => {
    setIsAnalyzing(true);
    showSuccess('Skill Analyzer Agent is processing learning activity logs...');
    setTimeout(() => {
      setIsAnalyzing(false);
      showSuccess('Skill profile re-evaluated! Overall score updated.');
    }, 1500);
  };

  return (
    <PageContainer>
      {/* 1. Skill Header */}
      <SkillHeader 
        overallScore={profileData.overallScore}
        currentRank={profileData.currentRank}
        onExportClick={() => setActiveTab('reports')}
        onAnalyzeClick={handleAnalyzeSkills}
        isAnalyzing={isAnalyzing}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* 2. Left Sub-sidebar */}
        <SkillSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
              
              {/* VIEW 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Stats Overview Bar */}
                  <SkillStats profileData={profileData} />

                  {/* Radar Chart & Top Skill Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <RadarChartCard />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 select-none">Top Evaluated Domains</h4>
                      <div className="space-y-3">
                        {categories.slice(0, 3).map(c => (
                          <SkillCard key={c.id} skill={c} onSelectSkill={setSelectedCategory} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: SKILL OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <RadarChartCard />
                  <TimelineCard />
                </div>
              )}

              {/* VIEW 3: SKILL CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <CategoryCard selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map(c => (
                      <SkillCard key={c.id} skill={c} onSelectSkill={setSelectedCategory} />
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 4: TOPIC ANALYSIS */}
              {activeTab === 'topics' && (
                <ProgressCard />
              )}

              {/* VIEW 5: LEARNING ANALYTICS */}
              {activeTab === 'analytics' && (
                <AnalyticsCard />
              )}

              {/* VIEW 6: PERFORMANCE TIMELINE */}
              {activeTab === 'timeline' && (
                <TimelineCard />
              )}

              {/* VIEW 7: ACHIEVEMENTS */}
              {activeTab === 'achievements' && (
                <AchievementCard />
              )}

              {/* VIEW 8: RECOMMENDATIONS */}
              {activeTab === 'recommendations' && (
                <RecommendationCard />
              )}

              {/* VIEW 9: PROGRESS REPORTS */}
              {activeTab === 'reports' && (
                <ReportCard reportData={reports} />
              )}

              {/* VIEW 10: SKILL SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Skill Analyzer Preferences</h3>
                    <span className="text-[10px] font-mono text-slate-400">Settings & Agent Config</span>
                  </div>

                  <div className="space-y-4 select-none">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Automatic Re-Analysis</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Auto-update skill scores after completing Learning Agent quizzes.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={autoAnalysis}
                        onChange={() => setAutoAnalysis(!autoAnalysis)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Skill Milestone Notifications</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Notify when advancing to a new rank level (e.g. Expert to Master).</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyMilestones}
                        onChange={() => setNotifyMilestones(!notifyMilestones)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Weak Area Detector Alerts</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Highlight low confidence topics to the Planner Agent.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifyWeakAreas}
                        onChange={() => setNotifyWeakAreas(!notifyWeakAreas)}
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

export default SkillCenter;
