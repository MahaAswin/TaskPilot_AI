import React from 'react';
import { Sparkles } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export const EmptyState = ({ 
  title = 'No active datasets found', 
  description = 'Initiate a new prompt thread in chat workspace or configure checklists to explore agent triggers.', 
  actionLabel = 'Orchestrate Prompt', 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-white/5 border-dashed rounded-2xl bg-[#18181b]/10 max-w-lg mx-auto gap-4">
      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      </div>
      {onAction && (
        <GradientButton onClick={onAction} className="mt-2">
          {actionLabel}
        </GradientButton>
      )}
    </div>
  );
};

export default EmptyState;
