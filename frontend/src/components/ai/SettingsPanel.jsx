import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Globe, Clock, RefreshCw, Sliders, Shield } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';
import { PROVIDERS_LIST } from '../../constants/aiMockData';

export const SettingsPanel = () => {
  const { showSuccess } = useToast();

  const [selectedProviderId, setSelectedProviderId] = useState('gemini');
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••');
  const [baseUrl, setBaseUrl] = useState('https://generativelanguage.googleapis.com/v1beta');
  const [timeout, setTimeoutVal] = useState(10000);
  const [retryCount, setRetryCount] = useState(3);
  const [priority, setPriority] = useState(1);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [temperature, setTemperature] = useState(0.7);
  const [model, setModel] = useState('gemini-1.5-pro');

  const handleSave = (e) => {
    e.preventDefault();
    showSuccess(`Provider settings saved for ${selectedProviderId.toUpperCase()}. Config active!`);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-5 select-none max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>AI Provider Configuration Panel</span>
          </h3>
          <p className="text-[10px] text-slate-400">Configure API keys, base URLs, timeouts, priorities, and fallback strategies.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Provider selector */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 block">Select Target Provider to Configure</label>
          <select
            value={selectedProviderId}
            onChange={(e) => {
              setSelectedProviderId(e.target.value);
              const found = PROVIDERS_LIST.find(p => p.id === e.target.value);
              if (found) setModel(found.model);
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {PROVIDERS_LIST.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.model})</option>
            ))}
          </select>
        </div>

        {/* API Key & Base URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">API Key (Environment Override)</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="e.g. AIzaSy..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Custom Base URL (Optional)</label>
            <input
              type="text"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="https://api.provider.com/v1"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Settings grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Timeout (ms)</label>
            <input
              type="number"
              value={timeout}
              onChange={e => setTimeoutVal(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Retry Count</label>
            <input
              type="number"
              value={retryCount}
              onChange={e => setRetryCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Priority Rank</label>
            <input
              type="number"
              value={priority}
              onChange={e => setPriority(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Max Tokens</label>
            <input
              type="number"
              value={maxTokens}
              onChange={e => setMaxTokens(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
            />
          </div>
        </div>

        {/* Temperature slider */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between font-bold text-slate-700">
            <span>Temperature (Creativity): {temperature}</span>
            <span className="text-[10px] font-mono text-slate-400">0.0 (Deterministic) - 1.0 (Creative)</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-glow cursor-pointer transition-all"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPanel;
