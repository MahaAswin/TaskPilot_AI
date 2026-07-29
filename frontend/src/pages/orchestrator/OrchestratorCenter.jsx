import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, RefreshCw, ArrowRight, Layers, Image as ImageIcon,
  CheckCircle2, Cpu, Eye, X, ChevronRight, ChevronLeft, Lightbulb, Play
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { orchestratorService } from '../../services/orchestratorService';

export const OrchestratorCenter = () => {
  const { showSuccess, showError } = useToast();

  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineData, setPipelineData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const sampleTopics = [
    { label: 'Quantum Computing', topic: 'Quantum Computing' },
    { label: 'Photosynthesis Process', topic: 'Photosynthesis Process' },
    { label: 'Machine Learning Pipeline', topic: 'Machine Learning Pipeline' },
    { label: 'Java Spring Boot', topic: 'Java Spring Boot' },
    { label: 'Space Exploration', topic: 'Space Exploration' },
    { label: 'Blockchain Technology', topic: 'Blockchain Technology' }
  ];

  // Curated Step-Specific High-Resolution Image Fallbacks (Step 1 to 6)
  const stepFallbacks = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', // Step 1: Foundations & Code
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', // Step 2: Architecture & Hardware
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80', // Step 3: Core Neural Execution
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80', // Step 4: Optimization & Control
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', // Step 5: Global Ecosystem Mesh
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80'  // Step 6: Technological Horizon
  ];

  // Default initial pipeline load
  useEffect(() => {
    handleGeneratePipeline('Quantum Computing');
  }, []);

  const handleGeneratePipeline = async (targetTopic) => {
    const topicToUse = typeof targetTopic === 'string' ? targetTopic : topicInput.trim() || 'Quantum Computing';

    setIsLoading(true);

    try {
      const response = await orchestratorService.runWorkflow(topicToUse);
      const data = response?.data || response;
      setPipelineData(data);
      if (typeof targetTopic !== 'string') {
        showSuccess(`Generated 6-Keyword Visual Pipeline for "${topicToUse}"`);
      }
    } catch (err) {
      showError('Failed to generate topic pipeline. Using visual fallback pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNodeTheme = (index) => {
    const themes = [
      { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', text: 'text-indigo-600', badge: 'bg-indigo-600' },
      { border: 'border-purple-500/30', bg: 'bg-purple-500/5', text: 'text-purple-600', badge: 'bg-purple-600' },
      { border: 'border-sky-500/30', bg: 'bg-sky-500/5', text: 'text-sky-600', badge: 'bg-sky-600' },
      { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-600', badge: 'bg-emerald-600' },
      { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-600', badge: 'bg-amber-600' },
      { border: 'border-rose-500/30', bg: 'bg-rose-500/5', text: 'text-rose-600', badge: 'bg-rose-600' }
    ];
    return themes[index % themes.length];
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* 1. Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-indigo-500/20 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                TaskPilot AI Orchestrator Engine
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Layers className="w-8 h-8 text-indigo-400" />
                Topic-to-Image Pipeline Orchestrator
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                Enter any topic name. The LLM extracts 5-6 core milestone keywords representing the most important concepts, generates illustrative visual image cards for each point, and connects them into a pipeline structure.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LLM & Image Generation Pipeline Active
              </div>
            </div>
          </div>
        </div>

        {/* 2. Topic Input Bar & Sample Chips */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Topic Pipeline Generator</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Extracts 5-6 Core Keywords + Visual Image Pipeline</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGeneratePipeline();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Lightbulb className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter any topic (e.g., Quantum Computing, Photosynthesis, Machine Learning Pipeline)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Extracting Keywords & Generating Images...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Generate Topic Pipeline
                </>
              )}
            </button>
          </form>

          {/* Quick Topic Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Popular Topics:</span>
            {sampleTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopicInput(item.topic);
                  handleGeneratePipeline(item.topic);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium text-[11px] border border-slate-200 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Pipeline Data Summary Bar */}
        {pipelineData && (
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 border border-indigo-500/20 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Topic: <span className="text-indigo-300 font-extrabold">{pipelineData.topic}</span>
                </h3>
                <p className="text-xs text-slate-300">{pipelineData.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-mono text-indigo-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {pipelineData.keywords?.length || 6} Key Points Connected
              </div>
            </div>
          </div>
        )}

        {/* 4. Connected Visual Pipeline Structure Canvas */}
        {pipelineData && pipelineData.keywords && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                Connected Visual Keyword Pipeline
              </h2>
              <span className="text-xs font-medium text-slate-500">Click any card node for detailed view</span>
            </div>

            {/* Horizontal & Responsive Connected Node Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {pipelineData.keywords.map((node, index) => {
                const theme = getNodeTheme(index);
                const isLast = index === pipelineData.keywords.length - 1;
                const fallbackImg = stepFallbacks[index % stepFallbacks.length];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setSelectedNode({ ...node, displayImg: node.imageUrl || fallbackImg })}
                    className={`relative cursor-pointer group bg-white rounded-2xl p-5 border ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4`}
                  >
                    {/* Step Badge & Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg ${theme.badge} text-white font-black text-xs flex items-center justify-center shadow-sm`}>
                          0{node.step}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Point {node.step}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}>
                        {node.subtitle}
                      </span>
                    </div>

                    {/* Image Card Container with Unique Step Fallback */}
                    <div className="relative overflow-hidden rounded-xl bg-slate-900 h-44 border border-slate-200/80 group-hover:border-indigo-400/50 transition-all">
                      <img
                        src={node.imageUrl || fallbackImg}
                        alt={node.keyword}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          // Guaranteed step-specific fallback image (no identical wallpapers!)
                          e.target.onerror = null;
                          e.target.src = fallbackImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-bold drop-shadow-md truncate">{node.keyword}</span>
                        <Eye className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Keyword Title & Important Point Description */}
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {node.keyword}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3">
                        {node.description}
                      </p>
                    </div>

                    {/* Connection Pipeline Arrow Badge */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-bold text-slate-400">
                      <span>Pipeline Step 0{node.step}</span>
                      {!isLast ? (
                        <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                          <span>Next Point</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-extrabold">Final Point ✅</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Interactive Node Detail Modal */}
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      0{selectedNode.step}
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{selectedNode.keyword}</h3>
                      <span className="text-xs font-semibold text-indigo-600">{selectedNode.subtitle}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Image Asset */}
                <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-h-80 shadow-md">
                  <img
                    src={selectedNode.displayImg || selectedNode.imageUrl}
                    alt={selectedNode.keyword}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = stepFallbacks[(selectedNode.step - 1) % stepFallbacks.length];
                    }}
                  />
                </div>

                {/* Detailed Point Content */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Takeaway & Importance</h4>
                    <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>

                  {selectedNode.imagePrompt && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Generated Image Prompt:</span>
                      <p className="font-mono text-slate-600 text-[11px]">{selectedNode.imagePrompt}</p>
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Close Inspection
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
};

export default OrchestratorCenter;
