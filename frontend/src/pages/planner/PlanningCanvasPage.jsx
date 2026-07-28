import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Compass, Map, Clock, CalendarDays, 
  Sun, BookOpen, AlertTriangle, Lightbulb, BarChart3, Download, Layers,
  CheckCircle2, ArrowRight, ArrowLeft, Loader2, Play, Flame, ShieldAlert, Cpu, CheckSquare, FileText, Copy
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import CanvasHeader from '../../components/planning/CanvasHeader';
import CanvasToolbar from '../../components/planning/CanvasToolbar';
import CanvasSidebar from '../../components/planning/CanvasSidebar';
import PlanningCanvas from '../../components/planning/PlanningCanvas';
import Timeline from '../../components/planning/Timeline';
import MilestoneCard from '../../components/planning/MilestoneCard';
import WeeklyCard from '../../components/planning/WeeklyCard';
import DailyCard from '../../components/planning/DailyCard';
import ResourceCard from '../../components/planning/ResourceCard';
import RiskCard from '../../components/planning/RiskCard';
import ProgressCard from '../../components/planning/ProgressCard';
import ExportModal from '../../components/planning/ExportModal';

import { PLANNING_TEMPLATES } from '../../constants/planningTemplates';
import { aiService } from '../../services/aiService';
import { taskService } from '../../services/taskService';
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

  // Questionnaire Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [category, setCategory] = useState('Career Placement');
  const [dailyTime, setDailyTime] = useState('2-4 Hours / Day');
  const [targetDays, setTargetDays] = useState('30 Days');
  const [intensity, setIntensity] = useState('Balanced Standard');
  const [autoAssignTasks, setAutoAssignTasks] = useState(true);

  // LLM Raw Response State
  const [llmResponseText, setLlmResponseText] = useState('');
  const [llmProviderName, setLlmProviderName] = useState('Grok (xAI)');

  // Flowing Loading Modal state
  const [isGenerating, setIsGenerating] = useState(false);
  const [synthesisStep, setSynthesisStep] = useState(0);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [activeView, setActiveView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const SAMPLE_PROMPTS = [
    "I have placements in 2 months.",
    "I want to master React & Node.js.",
    "I want to crack GATE CSE exam in 6 months.",
    "I want to learn Data Structures & Algorithms from scratch.",
    "I want to build an AI SaaS Startup in 30 days."
  ];

  const synthesisStepsList = [
    { label: "Synthesizing Goal Intent & Prerequisites with LLMs...", icon: Sparkles },
    { label: `Calculating optimal timeline (${dailyTime} over ${targetDays})...`, icon: Clock },
    { label: "Formatting milestone node graph & weekly breakdown...", icon: Layers },
    { label: "Syncing generated action items with Task Queue (/tasks)...", icon: CheckSquare }
  ];

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

  // Open Interactive Wizard
  const handleStartPlanning = (promptText = '') => {
    if (promptText) setGoalInput(promptText);
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  // Execute AI Generation with Multi-Step Flow
  const handleExecuteGeneration = async () => {
    const promptToSubmit = goalInput || goal.title || 'Master Computer Science';
    setIsWizardOpen(false);
    setIsGenerating(true);
    setSynthesisStep(0);

    try {
      await new Promise(r => setTimeout(r, 400));
      setSynthesisStep(1);

      await new Promise(r => setTimeout(r, 400));
      setSynthesisStep(2);

      // AI Provider Request
      const enrichedPrompt = `Goal: "${promptToSubmit}". Category: ${category}. Daily Time: ${dailyTime}. Target Duration: ${targetDays}. Intensity: ${intensity}. Please generate a structured execution roadmap with milestones, tasks, and daily study items.`;
      const res = await aiService.generateRoadmap(enrichedPrompt);

      setSynthesisStep(3);
      await new Promise(r => setTimeout(r, 400));

      if (res) {
        setLlmProviderName(res.provider || 'Grok (xAI)');

        // Extract LLM response text — handles both string and structured object returns
        let rawText = '';
        const rawResult = res.data;

        if (typeof rawResult === 'string') {
          rawText = rawResult;
        } else if (rawResult && typeof rawResult.response === 'string') {
          rawText = rawResult.response;
        } else if (rawResult && typeof rawResult.data === 'string') {
          rawText = rawResult.data;
        } else if (typeof res.response === 'string') {
          rawText = res.response;
        } else if (rawResult) {
          rawText = JSON.stringify(rawResult, null, 2);
        }
        setLlmResponseText(rawText);

        const roadmapData = res.data?.data || res.data || {};
        const generatedMilestones = roadmapData.milestones || [
          { step: 1, title: `${promptToSubmit} - Foundations`, description: `Core concepts & setup for ${promptToSubmit}`, estimatedDays: 7 },
          { step: 2, title: `${promptToSubmit} - Core Architecture`, description: 'Implementation of essential modules & exercises', estimatedDays: 14 },
          { step: 3, title: `${promptToSubmit} - Final Projects & Revision`, description: 'Deploy projects and execute mock assessments', estimatedDays: 9 }
        ];

        // Update Milestones
        const formattedMilestones = generatedMilestones.map((m, idx) => ({
          id: `m-${idx + 1}`,
          title: m.title || `Milestone ${idx + 1}`,
          description: m.description || `Execution phase for ${promptToSubmit}`,
          targetDate: `Phase ${idx + 1} (${targetDays})`,
          status: idx === 0 ? 'in-progress' : 'pending'
        }));
        setMilestones(formattedMilestones);

        // Update Goal
        setGoal({
          title: promptToSubmit,
          description: `Custom AI Plan: ${dailyTime} dedication over ${targetDays} (${intensity}).`,
          category,
          difficulty: intensity
        });

        // Auto-assign tasks to Task Queue (/tasks) if enabled
        if (autoAssignTasks) {
          const tasksToAssign = formattedMilestones.map((m, idx) => ({
            title: `[${category}] ${m.title}`,
            description: m.description,
            category: category,
            priority: idx === 0 ? 'high' : 'medium',
            estimatedTime: 45,
            xpReward: 35 + idx * 10
          }));

          await taskService.batchCreateTasks(tasksToAssign);
          showSuccess(`AI Plan generated via ${res.provider || 'AI'}! Assigned ${tasksToAssign.length} tasks to your Task Queue (/tasks).`);
        } else {
          showSuccess(`AI Planning Canvas generated via ${res.provider || 'AI'}!`);
        }
      }
    } catch (err) {
      showError('Failed to generate AI plan: ' + (err?.response?.data?.message || err?.message));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageContainer title="AI Planning Canvas | TaskPilot OS">
      {/* Header */}
      <CanvasHeader 
        selectedTemplate={selectedTemplate}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Toolbar */}
      <CanvasToolbar 
        activeView={activeView}
        setActiveView={setActiveView}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Layout */}
      <div className="flex flex-col space-y-8 w-full">
        
        {/* Natural Language AI Planning Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-white">Planner Agent Interactive Assistant</h2>
                  <p className="text-xs text-indigo-200/80">Input your objective and answer a 3-step schedule wizard to generate a tailored roadmap.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Active Provider: {llmProviderName}
              </span>
            </div>

            {/* Sample Prompts */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300/70 block">Select a Sample Goal Prompt:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStartPlanning(promptText)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-indigo-600/40 border border-white/15 rounded-xl text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer text-left"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Describe your goal (e.g. Master React, Prepare for placement in 60 days)..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs font-semibold text-white placeholder-indigo-300/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartPlanning(goalInput);
                }}
              />
              <button
                onClick={() => handleStartPlanning(goalInput)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-xs font-black uppercase tracking-wider text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Configure & Build Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* LLM GENERATED STRATEGY & RESPONSE TEXT DISPLAY CARD */}
        {llmResponseText && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  LLM Synthesized Plan Output ({llmProviderName})
                </h3>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(llmResponseText);
                  showSuccess('LLM plan output copied to clipboard!');
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-indigo-200 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Response</span>
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-indigo-100/90 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {llmResponseText}
            </div>
          </motion.div>
        )}

        {/* Planning Canvas Render Views */}
        <section id="sec-roadmap-canvas" className="space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Map className="w-4.5 h-4.5 text-indigo-600" />
                <span>Active Goal Roadmap ({goal.title || 'Placement Preparation'})</span>
              </h3>
              <p className="text-[11px] text-slate-500">{goal.description || 'Milestones, node graphs, and daily actionable study plan.'}</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
              {milestones.length} Milestones Configured
            </span>
          </div>

          {/* Canvas Node Graph / Breakdown View */}
          <PlanningCanvas 
            nodes={nodes}
            milestones={milestones}
            showGrid={showGrid}
            zoomLevel={zoomLevel}
          />

          {/* Milestones Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {milestones.map((milestone, idx) => (
              <MilestoneCard key={milestone.id || idx} milestone={milestone} index={idx} />
            ))}
          </div>
        </section>

        {/* Timeline View */}
        <Timeline phases={timelinePhases} />

        {/* Weekly & Daily Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <WeeklyCard plan={weeklyPlan} />
          <DailyCard plan={dailyPlan} />
        </div>

        {/* CLEAN UN-SQUEEZED SECTIONS FOR RESOURCES, RISKS & PROGRESS */}
        <div className="space-y-8 w-full">
          <ResourceCard resources={resources} />
          <RiskCard risks={risks} />
          <ProgressCard metrics={progressMetrics} />
        </div>

      </div>

      {/* Sidebar Template Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <CanvasSidebar 
            onClose={() => setIsSidebarOpen(false)}
            templates={PLANNING_TEMPLATES}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        )}
      </AnimatePresence>

      {/* INTERACTIVE QUESTIONNAIRE WIZARD MODAL */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 select-none"
            >
              {/* Wizard Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Planner Agent Questionnaire</h3>
                    <p className="text-xs text-slate-500">Step {wizardStep} of 3 — Configure schedule & auto-task parameters</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsWizardOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2">
                {[1, 2, 3].map((stepNum) => (
                  <div 
                    key={stepNum} 
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      stepNum <= wizardStep ? 'bg-indigo-600' : 'bg-slate-100'
                    }`} 
                  />
                ))}
              </div>

              {/* Step 1: Goal & Category */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">Target Goal Objective</label>
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      placeholder="e.g. Master Web Development & React"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">Select Goal Domain Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Career Placement', 'Exam Preparation', 'DSA & Coding', 'Project Development'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                            category === cat 
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Time Commitment & Duration */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">How much time can you spend daily?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { time: '1-2 Hours / Day', desc: 'Light / Casual Pace' },
                        { time: '2-4 Hours / Day', desc: 'Balanced / Standard' },
                        { time: '4-6+ Hours / Day', desc: 'Bootcamp / Intensive' }
                      ].map((item) => (
                        <button
                          key={item.time}
                          onClick={() => setDailyTime(item.time)}
                          className={`p-3 rounded-2xl text-xs border text-center transition-all ${
                            dailyTime === item.time 
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-600 font-black shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-bold">{item.time}</div>
                          <div className="text-[9px] opacity-75 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">Target Timeline / Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['7 Days', '14 Days', '30 Days', '60 Days'].map((days) => (
                        <button
                          key={days}
                          onClick={() => setTargetDays(days)}
                          className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                            targetDays === days 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {days}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Task Queue Auto Assignment */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-900 uppercase tracking-wider">
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                      <span>Task Center Integration</span>
                    </div>
                    <p className="text-xs text-indigo-700/90 leading-relaxed">
                      Planner Agent will automatically extract daily action tasks from your roadmap and assign them directly to your **Tasks Queue (/tasks)** with calculated XP rewards.
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={autoAssignTasks}
                        onChange={(e) => setAutoAssignTasks(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-800">Assign generated action items directly to Tasks Queue (/tasks)</span>
                    </label>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
                    <div className="font-bold text-slate-800">Configured Parameters Summary:</div>
                    <div className="text-slate-600">• Goal: "{goalInput || 'Full-Stack Plan'}"</div>
                    <div className="text-slate-600">• Schedule: {dailyTime} over {targetDays}</div>
                    <div className="text-slate-600">• Domain: {category} ({intensity})</div>
                  </div>
                </div>
              )}

              {/* Wizard Footer Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {wizardStep > 1 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {wizardStep < 3 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl flex items-center gap-2 shadow-sm"
                  >
                    <span>Next Parameter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleExecuteGeneration}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-black uppercase tracking-wider text-white rounded-xl flex items-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Plan & Tasks</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANIMATED FLOWING LOADING MODAL */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-lg">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center select-none"
            >
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-indigo-600/20 animate-ping" />
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Planner Agent Synthesizing</h3>
                <p className="text-xs text-slate-500 mt-1">Generating roadmap & assigning tasks to Task Center...</p>
              </div>

              {/* Steps Progress Checklist */}
              <div className="space-y-3 text-left bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs">
                {synthesisStepsList.map((stepItem, idx) => {
                  const Icon = stepItem.icon;
                  const isDone = idx < synthesisStep;
                  const isCurrent = idx === synthesisStep;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={`font-semibold ${isDone ? 'text-slate-800' : isCurrent ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                        {stepItem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      {isExportModalOpen && (
        <ExportModal 
          onClose={() => setIsExportModalOpen(false)}
          selectedTemplate={selectedTemplate}
        />
      )}
    </PageContainer>
  );
};

export default PlanningCanvasPage;
