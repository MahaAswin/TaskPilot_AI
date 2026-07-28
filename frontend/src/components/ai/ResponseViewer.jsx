import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Cpu, Award, Shield, CheckCircle2, Bookmark } from 'lucide-react';
import { SAMPLE_UNIFIED_RESPONSE } from '../../constants/aiMockData';

export const ResponseViewer = ({ response = SAMPLE_UNIFIED_RESPONSE }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-4 select-none">
      
      {/* Header Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Provider: {response.provider}
          </span>

          <span className="px-2.5 py-0.5 bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black uppercase rounded-full">
            Agent: {response.agent}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {response.latency}
          </span>
          <span>{response.tokens} Tokens</span>
          <span className="text-emerald-600 font-bold">{(response.confidence * 100).toFixed(0)}% Confidence</span>
        </div>
      </div>

      {/* Response Content Body */}
      <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
        {response.response}
      </div>

      {/* Citations */}
      {response.citations && response.citations.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400 flex-wrap gap-2">
          <span className="font-bold text-slate-500">Citations & References:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {response.citations.map((c, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-semibold border border-slate-200/50">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ResponseViewer;
