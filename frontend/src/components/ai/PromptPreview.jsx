import React from 'react';
import { FileCode, Sparkles, Layers } from 'lucide-react';
import { PROMPT_TEMPLATES } from '../../constants/aiMockData';

export const PromptPreview = ({ templates = PROMPT_TEMPLATES, onSelectTemplate }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-600" />
          <span>System Prompt & Context Assembler Templates</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-400">Prompt Builder</span>
      </div>

      <div className="space-y-3">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => onSelectTemplate && onSelectTemplate(tpl)}
            className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1.5 cursor-pointer hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-extrabold text-slate-900">{tpl.title}</h5>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-mono text-indigo-700 font-bold">
                {tpl.agent}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-slate-200/50">
              {tpl.template}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptPreview;
