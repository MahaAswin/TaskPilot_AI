import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Map, Move, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import AgentNode from './AgentNode';
import AgentToolbar from './AgentToolbar';
import { SAMPLE_WORKFLOWS } from '../../constants/orchestratorMockData';

export const WorkflowCanvas = ({ workflow = SAMPLE_WORKFLOWS[0] }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = workflow.nodes || [];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none relative overflow-hidden">
      
      {/* Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span>Interactive Node-Based Workflow Canvas</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400">{workflow.title} • {workflow.workflowType}</span>
        </div>

        <AgentToolbar 
          zoomLevel={zoomLevel} 
          setZoomLevel={setZoomLevel} 
          showMiniMap={showMiniMap} 
          setShowMiniMap={setShowMiniMap} 
        />
      </div>

      {/* Main Canvas Viewport with Zoom transform */}
      <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-6 min-h-[300px] relative overflow-x-auto flex items-center justify-center">
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4 py-8 px-4"
          style={{ scale: zoomLevel / 100 }}
          transition={{ duration: 0.3 }}
        >
          {nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <AgentNode 
                node={node} 
                isSelected={selectedNode?.id === node.id}
                onClick={setSelectedNode}
              />
              {i < nodes.length - 1 && (
                <div className="flex items-center gap-1 text-slate-300 shrink-0">
                  <ArrowRight className="w-4 h-4 stroke-[3px] text-indigo-400 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Mini-Map Indicator Placeholder */}
        {showMiniMap && (
          <div className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-soft text-[9px] font-mono text-slate-400 space-y-1 w-32 hidden sm:block pointer-events-none">
            <div className="flex justify-between items-center font-bold text-slate-700">
              <Map className="w-3 h-3 text-indigo-600" />
              <span>Mini-Map</span>
            </div>
            <div className="h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center gap-1">
              {nodes.map((n, idx) => (
                <span key={idx} className={`w-1.5 h-1.5 rounded-full ${n.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Details Box */}
      {selectedNode && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1 text-xs">
          <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Node Details Inspector</span>
          <div className="font-bold text-slate-900">{selectedNode.agentId} — {selectedNode.label}</div>
          <span className="text-[10px] font-mono text-slate-500">Status: {selectedNode.status.toUpperCase()} • Step Index: {selectedNode.step}</span>
        </motion.div>
      )}

    </div>
  );
};

export default WorkflowCanvas;
