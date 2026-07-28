import React from 'react';
import { Cpu, ChevronDown } from 'lucide-react';
import { PROVIDERS_LIST } from '../../constants/aiMockData';

export const ProviderSelector = ({ selectedProvider, onSelectProvider }) => {
  return (
    <div className="relative flex items-center gap-2 select-none">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Provider:</span>
      <select
        value={selectedProvider?.id || 'gemini'}
        onChange={(e) => {
          const found = PROVIDERS_LIST.find(p => p.id === e.target.value);
          if (found && onSelectProvider) onSelectProvider(found);
        }}
        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
      >
        {PROVIDERS_LIST.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.model})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProviderSelector;
