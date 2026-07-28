import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Cpu, GitBranch, History, Terminal, Settings, Sparkles, RefreshCw, Play 
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { orchestratorService } from '../../services/orchestratorService';

// Component imports
import WorkflowHeader from '../../components/orchestrator/WorkflowHeader';
import AgentSidebar from '../../components/orchestrator/AgentSidebar';
import WorkflowCanvas from '../../components/orchestrator/WorkflowCanvas';
import PipelineViewer from '../../components/orchestrator/PipelineViewer';
import WorkflowCard from '../../components/orchestrator/WorkflowCard';
import ExecutionCard from '../../components/orchestrator/ExecutionCard';
import TimelineCard from '../../components/orchestrator/TimelineCard';
import ContextCard from '../../components/orchestrator/ContextCard';
import LogViewer from '../../components/orchestrator/LogViewer';

import { 
  AGENTS_LIST, SAMPLE_WORKFLOWS, SHARED_CONTEXT, SYSTEM_LOGS, ORCHESTRATOR_STATS 
} from '../../constants/orchestratorMockData';

export const OrchestratorCenter = () => {
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [workflows, setWorkflows] = useState(SAMPLE_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState(SAMPLE_WORKFLOWS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  // Settings states
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [contextSync, setContextSync] = useState(true);
  const [fallbackOnError, setFallbackOnError] = useState(true);

  const handleRunGoal = async (e) => {
    if (e) e.preventDefault();
    const query = goalInput.trim() || 'Master Java Spring Boot and DSA Arrays';
    
    setIsRunning(true);
    showSuccess(`Orchestrator dispatched goal: "${query}" across 7 sub-agents.`);

    setTimeout(() => {
      setIsRunning(false);
      showSuccess(`🎉 Multi-Agent Pipeline completed in 1.2s! Response synthesized.`);
    }, 1500);
  };

  const handleReplay = async () => {
    setIsRunning(true);
    showSuccess('Replaying workflow execution pipeline...');
    setTimeout(() => {
      setIsRunning(false);
      showSuccess('Workflow replayed successfully.');
    }, 1200);
  };

  return (
    <PageContainer>
      {/* 1. Header */}
      <WorkflowHeader 
        totalExecutions={ORCHESTRATOR_STATS.totalExecutions}
        activeAgentsCount={AGENTS_LIST.length}
        onRunWorkflow={() => setActiveTab('monitor')}
        onReplayWorkflow={handleReplay}
        isRunning={isRunning}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* 2. Left Sub-sidebar Navigation */}
        <AgentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
              
              {/* VIEW 1: AGENT DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Goal Trigger Banner */}
                  <form onSubmit={handleRunGoal} className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-3">
                    <div className="p-2.5 bg-white/10 rounded-2xl shrink-0">
                      <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
                    </div>
                    <input
                      type="text"
                      value={goalInput}
                      onChange={e => setGoalInput(e.target.value)}
                      placeholder="Describe any multi-agent goal (e.g. 'I want to master Java', 'Generate DSA notes', 'Placement roadmap')"
                      className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 transition-all font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={isRunning}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isRunning ? 'Running...' : 'Run Pipeline'}
                    </button>
                  </form>

                  {/* Node Canvas Preview */}
                  <WorkflowCanvas workflow={selectedWorkflow} />

                  {/* Registered Agents Pool & Templates */}
                  <ExecutionCard agents={AGENTS_LIST} />
                  <WorkflowCard workflows={workflows} onSelectWorkflow={setSelectedWorkflow} />
                </div>
              )}

              {/* VIEW 2: WORKFLOW MONITOR */}
              {activeTab === 'monitor' && (
                <div className="space-y-6">
                  <PipelineViewer currentStep={3} />
                  <WorkflowCanvas workflow={selectedWorkflow} />
                </div>
              )}

              {/* VIEW 3: EXECUTION TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <TimelineCard logs={SYSTEM_LOGS} />
                </div>
              )}

              {/* VIEW 4: CONTEXT VIEWER */}
              {activeTab === 'context' && (
                <ContextCard context={SHARED_CONTEXT} />
              )}

              {/* VIEW 5: WORKFLOW HISTORY */}
              {activeTab === 'history' && (
                <WorkflowCard workflows={workflows} onSelectWorkflow={setSelectedWorkflow} />
              )}

              {/* VIEW 6: EXECUTION LOGS */}
              {activeTab === 'logs' && (
                <LogViewer logs={SYSTEM_LOGS} />
              )}

              {/* VIEW 7: AGENT SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-5 select-none">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Orchestrator Preferences</h3>
                    <span className="text-[10px] font-mono text-slate-400">Settings & Routing Rules</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Automatic Re-Balancing</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Dynamically adjust sub-agent dispatch order based on intent analysis.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={autoRebalance}
                        onChange={() => setAutoRebalance(!autoRebalance)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Shared Context Synchronization</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Sync shared memory state across Knowledge, Learning & Task Agents.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={contextSync}
                        onChange={() => setContextSync(!contextSync)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Fallback Error Handler</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Reroute failing sub-agent nodes to Coordinator fallback dispatcher.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={fallbackOnError}
                        onChange={() => setFallbackOnError(!fallbackOnError)}
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

export default OrchestratorCenter;
