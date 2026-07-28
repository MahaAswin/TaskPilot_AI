import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, Minus, ArrowRight, BookOpen } from 'lucide-react';

export const MindMapCard = ({ centralTopic = 'Mitochondria Cellular Energetics' }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    root: true,
    outer: true,
    inner: true,
    matrix: false
  });

  const toggleNode = (nodeName) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeName]: !prev[nodeName]
    }));
  };

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-soft flex flex-col items-center justify-center min-h-[360px] select-none overflow-x-auto">
      
      {/* Central Hub Node */}
      <div className="relative z-10">
        <div 
          onClick={() => toggleNode('root')}
          className="px-5 py-3 border border-indigo-200 bg-white hover:bg-indigo-50/20 text-xs font-black text-slate-800 uppercase tracking-wider rounded-2xl shadow-soft text-center cursor-pointer transition-all flex items-center gap-2"
        >
          <Network className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
          <span>{centralTopic}</span>
          {expandedNodes.root ? <Minus className="w-3 h-3 text-slate-400" /> : <Plus className="w-3 h-3 text-indigo-500 font-extrabold" />}
        </div>
      </div>

      {/* Concept Tree branches */}
      <AnimatePresence>
        {expandedNodes.root && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row gap-8 mt-12 items-start relative w-full justify-center px-4"
          >
            {/* Branch 1: Outer Membrane */}
            <div className="flex-1 flex flex-col items-center space-y-4 w-full">
              <div 
                onClick={() => toggleNode('outer')}
                className="px-4 py-2 bg-white border border-slate-250 hover:border-indigo-400 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>1. Outer Membrane</span>
                {expandedNodes.outer ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5 text-indigo-500" />}
              </div>

              {expandedNodes.outer && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1.5 w-full max-w-[160px]"
                >
                  <div className="p-2 border border-slate-100 bg-white rounded-lg text-[9px] text-slate-400 text-center font-semibold">
                    Porins channels
                  </div>
                  <div className="p-2 border border-slate-100 bg-white rounded-lg text-[9px] text-slate-400 text-center font-semibold">
                    Permeability layers
                  </div>
                </motion.div>
              )}
            </div>

            {/* Branch 2: Inner Membrane */}
            <div className="flex-1 flex flex-col items-center space-y-4 w-full">
              <div 
                onClick={() => toggleNode('inner')}
                className="px-4 py-2 bg-white border border-slate-250 hover:border-indigo-400 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>2. Inner Membrane</span>
                {expandedNodes.inner ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5 text-indigo-500" />}
              </div>

              {expandedNodes.inner && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1.5 w-full max-w-[160px]"
                >
                  <div className="p-2 border border-indigo-100 bg-indigo-50/20 rounded-lg text-[9px] text-indigo-700 text-center font-extrabold flex items-center justify-center gap-1">
                    <span>Cristae folds</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                  <div className="p-2 border border-slate-100 bg-white rounded-lg text-[9px] text-slate-400 text-center font-semibold">
                    ATP Synthase complex
                  </div>
                </motion.div>
              )}
            </div>

            {/* Branch 3: Matrix */}
            <div className="flex-1 flex flex-col items-center space-y-4 w-full">
              <div 
                onClick={() => toggleNode('matrix')}
                className="px-4 py-2 bg-white border border-slate-250 hover:border-indigo-400 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>3. Matrix Matrix</span>
                {expandedNodes.matrix ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5 text-indigo-500" />}
              </div>

              {expandedNodes.matrix && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1.5 w-full max-w-[160px]"
                >
                  <div className="p-2 border border-slate-100 bg-white rounded-lg text-[9px] text-slate-400 text-center font-semibold">
                    Krebs Cycle Enzymes
                  </div>
                  <div className="p-2 border border-slate-100 bg-white rounded-lg text-[9px] text-slate-400 text-center font-semibold">
                    Mitochondrial mtDNA
                  </div>
                </motion.div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MindMapCard;
