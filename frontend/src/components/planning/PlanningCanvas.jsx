import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle, Clock, GitBranch, ArrowRight, 
  ChevronRight, Maximize2, Layers, AlertCircle, Check, Info, X
} from 'lucide-react';

export const PlanningCanvas = ({ 
  nodes = [], 
  zoomLevel = 1, 
  showGrid = true,
  onNodeClick 
}) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const defaultNodes = nodes.length > 0 ? nodes : [
    { id: 'node-1', type: 'milestone', title: 'DSA Core Foundation', week: 'Week 1-2', status: 'completed', progress: 100, branches: ['node-2', 'node-3'], description: 'Arrays, Strings, Two Pointers, Sliding Window, Linked Lists.' },
    { id: 'node-2', type: 'branch', title: 'Advanced Graphs & DP', week: 'Week 3-4', status: 'in_progress', progress: 60, branches: ['node-4'], description: 'Dynamic Programming memoization & tabulation, Graph BFS/DFS.' },
    { id: 'node-3', type: 'branch', title: 'CS Fundamentals & OS', week: 'Week 3-4', status: 'in_progress', progress: 40, branches: ['node-4'], description: 'Operating Systems process sync, SQL indexing, Computer Networks.' },
    { id: 'node-4', type: 'milestone', title: 'LLD & System Design', week: 'Week 5-6', status: 'pending', progress: 0, branches: ['node-5'], description: 'Scalable architecture, caching, microservices, load balancing.' },
    { id: 'node-5', type: 'milestone', title: 'Mock Interviews & Hiring', week: 'Week 7-8', status: 'pending', progress: 0, branches: [], description: '10 Live peer mocks, ATS resume optimization, STAR behavioral stories.' }
  ];

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  return (
    <section id="sec-roadmap-canvas" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span>AI Planning Canvas & Roadmap</span>
          </h3>
          <p className="text-xs text-slate-500">Interactive visual node graph. Click any node to view deliverables and dependencies.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
          <span className="flex items-center gap-1 text-indigo-600"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> In Progress</span>
          <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300" /> Pending</span>
        </div>
      </div>

      {/* Visual Canvas Frame */}
      <div 
        className={`relative w-full min-h-[380px] bg-slate-50/70 border border-slate-200/90 rounded-3xl p-6 sm:p-8 overflow-x-auto shadow-soft transition-all ${
          showGrid ? 'bg-radial-grid' : ''
        }`}
        style={{
          backgroundImage: showGrid ? 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)' : 'none',
          backgroundSize: '24px 24px'
        }}
      >
        <div 
          className="flex items-center justify-between min-w-[760px] gap-6 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {defaultNodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isSelected = selectedNode?.id === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNodeSelect(node)}
                  className={`w-52 p-4 rounded-2xl border transition-all cursor-pointer shadow-soft backdrop-blur-md relative ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-glow ring-2 ring-indigo-200'
                      : isCompleted
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : isInProgress
                      ? 'bg-white border-indigo-300 text-slate-900 shadow-md'
                      : 'bg-white/70 border-slate-200/80 text-slate-600'
                  }`}
                >
                  {/* Badge & Week */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      node.type === 'milestone' 
                        ? 'bg-indigo-100/70 text-indigo-700 border-indigo-200'
                        : 'bg-purple-100/70 text-purple-700 border-purple-200'
                    }`}>
                      {node.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{node.week}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-black mb-2 line-clamp-2">{node.title}</h4>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>Progress</span>
                      <span className="font-bold">{node.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                        style={{ width: `${node.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status icon badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm bg-white">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : isInProgress ? (
                      <Clock className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                </motion.div>

                {/* Connection Connector Line Arrow */}
                {index < defaultNodes.length - 1 && (
                  <div className="flex items-center justify-center shrink-0">
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    <ArrowRight className={`w-4 h-4 -ml-1 ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Node Detail Expansion Modal/Drawer */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white border border-indigo-100 rounded-3xl p-5 shadow-xl flex items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 rounded-full border border-indigo-200">
                  {selectedNode.type} Details
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{selectedNode.week}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900">{selectedNode.title}</h4>
              <p className="text-xs text-slate-600">{selectedNode.description || 'Execution node part of the primary AI roadmap trajectory.'}</p>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PlanningCanvas;
