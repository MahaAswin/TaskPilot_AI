import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Compass, Map, Clock, CalendarDays, 
  Sun, BookOpen, AlertTriangle, Lightbulb, BarChart3, Download, Layers
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import CanvasHeader from '../../components/planning/CanvasHeader';
import CanvasToolbar from '../../components/planning/CanvasToolbar';
import CanvasSidebar from '../../components/planning/CanvasSidebar';
import GoalCard from '../../components/planning/GoalCard';
import PlanningCanvas from '../../components/planning/PlanningCanvas';
import Timeline from '../../components/planning/Timeline';
import MilestoneCard from '../../components/planning/MilestoneCard';
import WeeklyCard from '../../components/planning/WeeklyCard';
import DailyCard from '../../components/planning/DailyCard';
import ResourceCard from '../../components/planning/ResourceCard';
import RiskCard from '../../components/planning/RiskCard';
import SuggestionCard from '../../components/planning/SuggestionCard';
import ProgressCard from '../../components/planning/ProgressCard';
import TemplateCard from '../../components/planning/TemplateCard';
import ExportModal from '../../components/planning/ExportModal';

import { PLANNING_TEMPLATES } from '../../constants/planningTemplates';
import { planningService } from '../../services/planningService';
import { useToast } from '../../context/ToastProvider';

export const PlanningCanvasPage = () => {
  const { showSuccess, showError } = useToast();

  // Template & Goal state
  const [selectedTemplate, setSelectedTemplate] = useState(PLANNING_TEMPLATES[0]);
  const [goal, setGoal] = useState(PLANNING_TEMPLATES[0].goal);
  const [nodes, setNodes] = useState(PLANNING_TEMPLATES[0].canvasNodes);
  const [timelinePhases, setTimelinePhases] = useState(PLANNING_TEMPLATES[0].timelinePhases);
  const [milestones, setMilestones] = useState(PLANNING_TEMPLATES[0].milestones);
  const [weeklyPlan, setWeeklyPlan] = useState(PLANNING_TEMPLATES[0].weeklyPlan);
  const [dailyPlan, setDailyPlan] = useState(PLANNING_TEMPLATES[0].dailyPlan);
  const [resources, setResources] = useState(PLANNING_TEMPLATES[0].resources);
  const [risks, setRisks] = useState(PLANNING_TEMPLATES[0].risks);
  const [suggestions, setSuggestions] = useState(PLANNING_TEMPLATES[0].suggestions);
  const [progressMetrics, setProgressMetrics] = useState(PLANNING_TEMPLATES[0].progressMetrics);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [activeView, setActiveView] = useState('all'); // 'all', 'nodes', 'timeline', 'breakdown'
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setGoal(template.goal);
    setNodes(template.canvasNodes);
    setTimelinePhases(template.timelinePhases);
    setMilestones(template.milestones);
    setWeeklyPlan(template.weeklyPlan);
    setDailyPlan(template.dailyPlan);
    setResources(template.resources);
    setRisks(template.risks);
    setSuggestions(template.suggestions);
    setProgressMetrics(template.progressMetrics);
    showSuccess(`Loaded template: ${template.title}`);
  };

  // Generate Plan Simulation
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    showSuccess('AI Agent is synthesizing natural language goal into execution roadmap...');
    
    setTimeout(() => {
      setIsGenerating(false);
      showSuccess('AI Planning Canvas updated successfully!');
      scrollToSection('sec-roadmap-canvas');
    }, 1500);
  };

  // Natural language prompt apply
  const handleApplyPrompt = (promptText) => {
    // Find closest matching template or update goal description
    const matchedTemplate = PLANNING_TEMPLATES.find(t => 
      promptText.toLowerCase().includes(t.category.toLowerCase()) ||
      t.title.toLowerCase().includes(promptText.toLowerCase().split(' ')[2] || 'java')
    ) || PLANNING_TEMPLATES[0];

    setGoal(prev => ({
      ...prev,
      description: promptText,
      title: `Plan: ${promptText.slice(0, 40)}...`
    }));
  };

  // Scroll to section helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.6));
  const handleZoomReset = () => setZoomLevel(1);

  // Toggle tasks in weekly & daily plan
  const handleWeeklyTaskToggle = (taskId) => {
    setWeeklyPlan(prev => prev.map(w => ({
      ...w,
      tasks: w.tasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    })));
  };

  const handleDailyTaskToggle = (taskId) => {
    setDailyPlan(prev => prev.map(slot => ({
      ...slot,
      tasks: slot.tasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    })));
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col font-sans">
      
      {/* 1. TOP HEADER */}
      <CanvasHeader
        currentGoalTitle={goal?.title}
        onExportClick={() => setIsExportModalOpen(true)}
        onResetCanvas={() => handleSelectTemplate(PLANNING_TEMPLATES[0])}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        isSaving={isSaving}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTemplateTitle={selectedTemplate?.title}
      />

      {/* Slide-out Navigation & Template Drawer */}
      <CanvasSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        scrollToSection={scrollToSection}
        selectedTemplateId={selectedTemplate?.id}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Main Canvas Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* 2. CANVAS TOOLBAR */}
        <CanvasToolbar
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          activeView={activeView}
          setActiveView={setActiveView}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
        />

        {/* VIEW CONDITIONAL RENDERING */}
        {(activeView === 'all' || activeView === 'nodes') && (
          <>
            {/* 3. GOAL INPUT & SUMMARY */}
            <GoalCard
              goal={goal}
              onUpdateGoal={setGoal}
              onGeneratePlan={handleGeneratePlan}
              isGenerating={isGenerating}
              onApplyPrompt={handleApplyPrompt}
            />

            {/* 4. AI PLANNING CANVAS (ROADMAP NODE GRAPH) */}
            <PlanningCanvas
              nodes={nodes}
              zoomLevel={zoomLevel}
              showGrid={showGrid}
            />
          </>
        )}

        {(activeView === 'all' || activeView === 'timeline') && (
          /* 5. TIMELINE progression */
          <Timeline phases={timelinePhases} />
        )}

        {(activeView === 'all' || activeView === 'breakdown') && (
          <>
            {/* 6. MILESTONES */}
            <section id="sec-milestones" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-indigo-600" />
                    <span>Phase Milestones & Deliverables</span>
                  </h3>
                  <p className="text-xs text-slate-500">Milestone deliverables, risk parameters, and target deadlines.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map(m => (
                  <MilestoneCard key={m.id} milestone={m} />
                ))}
              </div>
            </section>

            {/* 7. WEEKLY BREAKDOWN */}
            <section id="sec-weekly" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-indigo-600" />
                    <span>Weekly Plan Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-500">Objectives, topics, estimated hours, and task checklists.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weeklyPlan.map(w => (
                  <WeeklyCard key={w.week} weekData={w} onTaskToggle={handleWeeklyTaskToggle} />
                ))}
              </div>
            </section>

            {/* 8. DAILY BREAKDOWN */}
            <section id="sec-daily" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Daily Time Slot Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-500">Schedule divided into Morning, Afternoon, Evening, and Night focus blocks.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dailyPlan.map(slot => (
                  <DailyCard key={slot.slot} slotData={slot} onTaskToggle={handleDailyTaskToggle} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* 9. RESOURCES */}
        {activeView === 'all' && (
          <>
            <ResourceCard resources={resources} />

            {/* 10. RISK ANALYSIS */}
            <RiskCard risks={risks} />

            {/* 11. AI SUGGESTIONS */}
            <SuggestionCard suggestions={suggestions} />

            {/* 12. PROGRESS TRACKER */}
            <ProgressCard metrics={progressMetrics} />

            {/* 13. PRE-BUILT TEMPLATES */}
            <TemplateCard
              selectedTemplateId={selectedTemplate?.id}
              onSelectTemplate={handleSelectTemplate}
            />
          </>
        )}

      </main>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentGoalTitle={goal?.title}
      />
    </div>
  );
};

export default PlanningCanvasPage;
