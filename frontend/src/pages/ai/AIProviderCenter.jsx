import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Cpu, ShieldCheck, FileCode, Settings, MessageSquare, Send, RefreshCw, Layers 
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { aiService } from '../../services/aiService';

import ProviderCard from '../../components/ai/ProviderCard';
import ProviderSelector from '../../components/ai/ProviderSelector';
import ConversationCard from '../../components/ai/ConversationCard';
import PromptPreview from '../../components/ai/PromptPreview';
import ResponseViewer from '../../components/ai/ResponseViewer';
import ProviderHealthCard from '../../components/ai/ProviderHealthCard';
import SettingsPanel from '../../components/ai/SettingsPanel';

import { 
  PROVIDERS_LIST, PROMPT_TEMPLATES, SAMPLE_UNIFIED_RESPONSE 
} from '../../constants/aiMockData';

export const AIProviderCenter = () => {
  const { showSuccess } = useToast();

  const [activeTab, setActiveTab] = useState('registry');
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS_LIST[0]);
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Explain the Coordinator Agent routing pattern in TaskPilot AI.' },
    { role: 'assistant', content: 'The Coordinator Agent evaluates incoming user intent and dispatches tasks to specialized sub-agents (Planner, Knowledge, Task, Skill, Coach) using a unified Provider Abstraction interface.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [unifiedResponse, setUnifiedResponse] = useState(SAMPLE_UNIFIED_RESPONSE);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInputMsg('');
    setIsGenerating(true);

    const res = await aiService.chat(newMessages, { provider: selectedProvider.id });
    setIsGenerating(false);

    if (res?.data) {
      setMessages([...newMessages, { role: 'assistant', content: res.data.response || 'AI Response generated' }]);
      setUnifiedResponse(res.data);
      showSuccess(`Generated via ${selectedProvider.name} (${selectedProvider.model})`);
    }
  };

  return (
    <PageContainer>
      {/* 1. Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span>AI PROVIDER INTEGRATION LAYER</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold flex items-center gap-1.5">
            <span>Provider Abstraction Framework — Gemini, Grok, OpenAI, Claude, DeepSeek, Mistral, Ollama, Mock</span>
          </p>
        </div>

        <ProviderSelector selectedProvider={selectedProvider} onSelectProvider={setSelectedProvider} />
      </div>

      {/* 2. Main Tab Buttons */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-3 mb-6 select-none">
        {[
          { id: 'registry', label: 'Providers & Health', icon: ShieldCheck },
          { id: 'playground', label: 'Unified AI Playground', icon: MessageSquare },
          { id: 'templates', label: 'Prompt Builder', icon: FileCode },
          { id: 'telemetry', label: 'Response Telemetry', icon: Cpu },
          { id: 'settings', label: 'Provider Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'registry' && (
            <div className="space-y-6">
              <ProviderHealthCard healthList={PROVIDERS_LIST} />

              <div className="space-y-3 select-none">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Registered LLM Provider Abstraction Classes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PROVIDERS_LIST.map((p) => (
                    <ProviderCard
                      key={p.id}
                      provider={p}
                      isSelected={selectedProvider.id === p.id}
                      onSelectProvider={setSelectedProvider}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playground' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <ConversationCard messages={messages} />

              <form onSubmit={handleSendMessage} className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-soft flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  placeholder={`Send query to ${selectedProvider.name} (${selectedProvider.model})...`}
                  className="flex-1 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Synthesizing...' : 'Send Query'}</span>
                </button>
              </form>

              {/* Live response preview */}
              <ResponseViewer response={unifiedResponse} />
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="max-w-4xl mx-auto">
              <PromptPreview templates={PROMPT_TEMPLATES} onSelectTemplate={(tpl) => setInputMsg(tpl.template)} />
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="max-w-4xl mx-auto">
              <ResponseViewer response={unifiedResponse} />
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
};

export default AIProviderCenter;
