import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon, Sparkles, Key, Shield, Palette,
  LayoutDashboard, Save, Eye, EyeOff, CheckCircle2, Circle,
  Cpu, Zap, Brain, Globe, Server, Bot, RefreshCw
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';
import { useToast } from '../../context/ToastProvider';

const TABS = [
  { id: 'providers',  label: 'AI Providers',   icon: Sparkles },
  { id: 'workspace',  label: 'Workspace',       icon: LayoutDashboard },
  { id: 'appearance', label: 'Appearance',      icon: Palette },
  { id: 'security',   label: 'Security',        icon: Shield },
];

const PROVIDERS = [
  { id: 'gemini',      label: 'Gemini',      model: 'gemini-1.5-flash',          icon: Sparkles, color: 'text-[#E8B45D]',    bg: 'bg-[rgba(232,180,93,0.14)]',    border: 'border-[#E8B45D]/30',    envKey: 'GEMINI_API_KEY' },
  { id: 'grok',        label: 'Grok (xAI)',  model: 'grok-beta',                 icon: Zap,      color: 'text-[#ECEAE3]',   bg: 'bg-[#242832]',   border: 'border-white/10',   envKey: 'GROK_API_KEY' },
  { id: 'openai',      label: 'OpenAI',      model: 'gpt-4o',                    icon: Bot,      color: 'text-[#57B5A8]', bg: 'bg-[rgba(87,181,168,0.14)]', border: 'border-[#57B5A8]/30', envKey: 'OPENAI_API_KEY' },
  { id: 'claude',      label: 'Claude',      model: 'claude-3-5-sonnet-20241022',icon: Brain,    color: 'text-[#E8B45D]',   bg: 'bg-[rgba(232,180,93,0.14)]',   border: 'border-[#E8B45D]/30',   envKey: 'CLAUDE_API_KEY' },
  { id: 'deepseek',    label: 'DeepSeek',    model: 'deepseek-chat',             icon: Cpu,      color: 'text-[#E8B45D]',  bg: 'bg-[rgba(232,180,93,0.14)]',  border: 'border-[#E8B45D]/30',  envKey: 'DEEPSEEK_API_KEY' },
  { id: 'mistral',     label: 'Mistral',     model: 'mistral-large-latest',      icon: Globe,    color: 'text-[#E8B45D]',  bg: 'bg-[rgba(232,180,93,0.14)]',  border: 'border-[#E8B45D]/30',  envKey: 'MISTRAL_API_KEY' },
  { id: 'ollama',      label: 'Ollama',      model: 'llama3:8b',                 icon: Server,   color: 'text-[#57B5A8]',    bg: 'bg-[rgba(87,181,168,0.14)]',    border: 'border-[#57B5A8]/30',    envKey: 'OLLAMA_BASE_URL' },
];

const PRIORITY_OPTIONS = ['gemini', 'grok', 'openai', 'claude', 'deepseek', 'mistral', 'ollama', 'mock'];

const ACCENT_COLORS = [
  { id: 'indigo', label: 'Indigo',  cls: 'bg-indigo-600' },
  { id: 'violet', label: 'Violet',  cls: 'bg-violet-600' },
  { id: 'blue',   label: 'Blue',    cls: 'bg-blue-600' },
  { id: 'teal',   label: 'Teal',    cls: 'bg-teal-600' },
  { id: 'emerald',label: 'Emerald', cls: 'bg-emerald-600' },
  { id: 'rose',   label: 'Rose',    cls: 'bg-rose-600' },
];

// Single API key input row
const KeyInput = ({ provider, value, onChange }) => {
  const [show, setShow] = useState(false);
  const Icon = provider.icon;
  const filled = value && value.trim().length > 0;

  return (
    <div className={`p-4 border rounded-2xl bg-[#1B1E25] transition-all ${filled ? 'border-[#57B5A8]/30 shadow-2xl' : 'border-white/10'}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 ${provider.bg} ${provider.border} border rounded-lg`}>
            <Icon className={`w-3.5 h-3.5 ${provider.color}`} />
          </div>
          <div>
            <span className="text-[10px] font-black text-white uppercase tracking-wider">{provider.label}</span>
            <span className="block text-[8px] font-mono text-[#868C99]">{provider.model}</span>
          </div>
        </div>
        {filled
          ? <CheckCircle2 className="w-4 h-4 text-[#57B5A8] shrink-0" />
          : <Circle className="w-4 h-4 text-white/20 shrink-0" />
        }
      </div>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${provider.envKey}...`}
          className="w-full pr-9 pl-3 py-2 border border-white/10 bg-[#242832] focus:bg-[#14161B] text-[#ECEAE3] placeholder-[#868C99] text-[10px] font-mono rounded-xl focus:outline-none focus:border-[#E8B45D] transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#868C99] hover:text-[#ECEAE3]"
        >
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

// Toggle row
const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-3.5 bg-[#242832] border border-white/10 rounded-2xl">
    <div>
      <span className="text-xs font-bold text-[#ECEAE3] block">{label}</span>
      <p className="text-[10px] text-[#C6C9D1] mt-0.5">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-[#E8B45D]' : 'bg-[#14161B]'}`}
    >
      <motion.div
        animate={{ x: checked ? 16 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

export const Settings = () => {
  const { showSuccess } = useToast();

  const [activeTab, setActiveTab] = useState('providers');

  // Provider keys state
  const [keys, setKeys] = useState({
    gemini: '', grok: '', openai: '', claude: '',
    deepseek: '', mistral: '', ollama: 'http://localhost:11434',
  });
  const [primaryProvider, setPrimaryProvider] = useState('gemini');
  const [priorityChain, setPriorityChain] = useState(['gemini', 'grok', 'ollama', 'mock']);
  const [isSavingKeys, setIsSavingKeys] = useState(false);

  // Workspace prefs
  const [defaultWorkspaceTitle, setDefaultWorkspaceTitle] = useState('General Sandbox');
  const [autoSaveSession, setAutoSaveSession]     = useState(true);
  const [showAgentTimeline, setShowAgentTimeline] = useState(true);
  const [enableMarkdown, setEnableMarkdown]       = useState(true);
  const [enableTelemetry, setEnableTelemetry]     = useState(true);
  const [maxHistoryItems, setMaxHistoryItems]     = useState(50);

  // Appearance
  const [accentColor, setAccentColor]         = useState('indigo');
  const [compactMode, setCompactMode]         = useState(false);
  const [animationsEnabled, setAnimations]    = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Security
  const [sessionTimeout, setSessionTimeout]   = useState('7d');
  const [twoFactorEnabled, setTwoFactor]      = useState(false);
  const [logActivity, setLogActivity]         = useState(true);

  const handleSaveKeys = async () => {
    setIsSavingKeys(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSavingKeys(false);
    showSuccess('AI provider configuration saved successfully!');
  };

  const handleSaveWorkspace = () => showSuccess('Workspace preferences updated!');
  const handleSaveAppearance = () => showSuccess('Appearance settings applied!');
  const handleSaveSecurity = () => showSuccess('Security configuration saved!');

  const togglePriority = (id) => {
    setPriorityChain(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-white/10 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#E8B45D]" />
            <span>SYSTEM CONFIGURATION</span>
          </h1>
          <p className="text-[10px] text-[#868C99] mt-1 font-semibold">Configure AI providers, workspace rules, and interface preferences</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#242832] border border-white/10 rounded-xl">
          <span className="text-[9px] font-mono font-bold text-[#868C99]">API:</span>
          <span className="text-[9px] font-mono font-bold text-[#E8B45D]">http://localhost:5000/api</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6 select-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[rgba(232,180,93,0.14)] border-[#E8B45D]/30 text-[#E8B45D] shadow-sm'
                  : 'bg-transparent border-white/10 text-[#C6C9D1] hover:bg-[#242832] hover:text-[#ECEAE3]'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >

          {/* ── AI PROVIDERS ─────────────────────────────────────────── */}
          {activeTab === 'providers' && (
            <>
              {/* Primary provider selector */}
              <GlassCard className="p-5 bg-[#1B1E25] border border-white/10 shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 select-none">Primary AI Provider</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROVIDERS.map(p => {
                    const Icon = p.icon;
                    const active = primaryProvider === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPrimaryProvider(p.id)}
                        className={`flex flex-col items-center gap-2 p-3 border rounded-2xl text-center transition-all cursor-pointer ${
                          active
                            ? `${p.bg} ${p.border} shadow-sm`
                            : 'bg-transparent border-white/10 hover:bg-[#242832]'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? p.color : 'text-[#868C99]'}`} />
                        <span className={`text-[9px] font-black uppercase tracking-wider ${active ? p.color : 'text-[#C6C9D1]'}`}>{p.label}</span>
                        {active && <span className="text-[7px] font-bold text-[#57B5A8] bg-[rgba(87,181,168,0.14)] border border-[#57B5A8]/30 px-1.5 py-0.5 rounded-full">Active</span>}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Fallback priority chain */}
              <GlassCard className="p-5 bg-[#1B1E25] border border-white/10 shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-1 select-none">Fallback Priority Chain</h3>
                <p className="text-[9px] text-[#868C99] font-semibold mb-4">Select providers in order of fallback preference. Mock is always last.</p>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_OPTIONS.map((id, idx) => {
                    const active = priorityChain.includes(id);
                    const pos = priorityChain.indexOf(id);
                    return (
                      <button
                        key={id}
                        onClick={() => id !== 'mock' && togglePriority(id)}
                        disabled={id === 'mock'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          active
                            ? 'bg-[#E8B45D] border-[#E8B45D] text-[#14161B]'
                            : 'bg-transparent border-white/10 text-[#C6C9D1] hover:border-white/20'
                        } ${id === 'mock' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {active && pos >= 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#14161B]/20 text-[#14161B] text-[8px] font-black flex items-center justify-center">
                            {pos + 1}
                          </span>
                        )}
                        {id}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[8px] text-[#868C99] font-mono mt-3">
                  Current chain: <span className="text-[#E8B45D] font-bold">{[...priorityChain, 'mock'].join(' → ')}</span>
                </p>
              </GlassCard>

              {/* API Keys */}
              <GlassCard className="p-5 bg-[#1B1E25] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4 select-none">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">API Keys</h3>
                    <p className="text-[9px] text-[#868C99] font-semibold mt-0.5">Keys are stored in your .env file and never transmitted.</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#57B5A8]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Encrypted</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROVIDERS.map(p => (
                    <KeyInput
                      key={p.id}
                      provider={p}
                      value={keys[p.id] || ''}
                      onChange={val => setKeys(prev => ({ ...prev, [p.id]: val }))}
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={handleSaveKeys}
                    disabled={isSavingKeys}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] text-[10px] font-bold rounded-xl shadow-2xl cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSavingKeys
                      ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></>
                      : <><Save className="w-3.5 h-3.5" /><span>Save Provider Config</span></>
                    }
                  </button>
                </div>
              </GlassCard>
            </>
          )}

          {/* ── WORKSPACE ────────────────────────────────────────────── */}
          {activeTab === 'workspace' && (
            <GlassCard className="p-5 bg-[#1B1E25] border border-white/10 shadow-2xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-3 select-none">Workspace Preferences</h3>

              {/* Default session title */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#868C99] mb-1.5">Default Session Title</label>
                <input
                  type="text"
                  value={defaultWorkspaceTitle}
                  onChange={e => setDefaultWorkspaceTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 bg-[#242832] focus:bg-[#14161B] text-xs text-[#ECEAE3] font-semibold rounded-xl focus:outline-none focus:border-[#E8B45D] transition-all"
                />
              </div>

              {/* Max history */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#868C99] mb-1.5">
                  Max Conversation History Items: <span className="text-[#E8B45D]">{maxHistoryItems}</span>
                </label>
                <input
                  type="range" min={10} max={200} step={10}
                  value={maxHistoryItems}
                  onChange={e => setMaxHistoryItems(Number(e.target.value))}
                  className="w-full accent-[#E8B45D] cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-[#868C99] mt-1">
                  <span>10</span><span>200</span>
                </div>
              </div>

              <div className="space-y-3">
                <ToggleRow label="Auto-Save Sessions" desc="Automatically persist workspace conversations to database." checked={autoSaveSession} onChange={setAutoSaveSession} />
                <ToggleRow label="Show Agent Timeline" desc="Display real-time agent execution traces in the right panel." checked={showAgentTimeline} onChange={setShowAgentTimeline} />
                <ToggleRow label="Markdown Rendering" desc="Render AI responses with full markdown syntax highlighting." checked={enableMarkdown} onChange={setEnableMarkdown} />
                <ToggleRow label="Response Telemetry" desc="Log provider name, latency, and token count per response." checked={enableTelemetry} onChange={setEnableTelemetry} />
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  onClick={handleSaveWorkspace}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] text-[10px] font-bold rounded-xl shadow-2xl cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Workspace Config</span>
                </button>
              </div>
            </GlassCard>
          )}

          {/* ── APPEARANCE ───────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <GlassCard className="p-5 bg-[#1B1E25] border border-white/10 shadow-2xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-3 select-none">Appearance & Interface</h3>

              {/* Accent color */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#868C99] mb-3">Accent Color</label>
                <div className="flex gap-3 flex-wrap">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`flex flex-col items-center gap-1.5 cursor-pointer group`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${c.cls} transition-all ${accentColor === c.id ? 'ring-2 ring-offset-2 ring-[#E8B45D] scale-110' : 'opacity-70 hover:opacity-100'}`} />
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${accentColor === c.id ? 'text-[#ECEAE3]' : 'text-[#868C99]'}`}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme preview */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#868C99] mb-3">Theme Mode</label>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  {[
                    { id: 'light', label: 'Light Mode', bg: 'bg-white border-slate-200', dot: 'bg-slate-800' },
                    { id: 'dark',  label: 'Dark Mode',  bg: 'bg-[#14161B] border-white/10', dot: 'bg-white' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => t.id === 'light' && showSuccess('Light mode is active — dark mode coming soon!')}
                      className={`p-3 border rounded-2xl flex flex-col gap-2 cursor-pointer transition-all ${t.bg} ${t.id === 'dark' ? 'ring-2 ring-[#E8B45D]' : 'opacity-50'}`}
                    >
                      <div className="flex gap-1">
                        {['bg-rose-400','bg-amber-400','bg-emerald-400'].map(c => (
                          <div key={c} className={`w-2 h-2 rounded-full ${c}`} />
                        ))}
                      </div>
                      <div className={`h-1.5 w-3/4 rounded ${t.dot} opacity-30`} />
                      <div className={`h-1.5 w-1/2 rounded ${t.dot} opacity-20`} />
                      <span className={`text-[8px] font-black uppercase tracking-wider mt-1 ${t.id === 'light' ? 'text-slate-600' : 'text-[#C6C9D1]'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <ToggleRow label="Compact Mode" desc="Reduce padding and spacing across all dashboard panels." checked={compactMode} onChange={setCompactMode} />
                <ToggleRow label="Motion Animations" desc="Enable Framer Motion transitions and hover effects." checked={animationsEnabled} onChange={setAnimations} />
                <ToggleRow label="Collapsed Sidebar Default" desc="Start with the sidebar collapsed on dashboard load." checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] text-[10px] font-bold rounded-xl shadow-2xl cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Appearance</span>
                </button>
              </div>
            </GlassCard>
          )}

          {/* ── SECURITY ─────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <GlassCard className="p-5 bg-[#1B1E25] border border-white/10 shadow-2xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-3 select-none">Security & Session</h3>

              {/* Session timeout */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#868C99] mb-1.5">JWT Session Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-white/10 bg-[#242832] text-xs font-bold text-[#ECEAE3] rounded-xl focus:outline-none focus:border-[#E8B45D]"
                >
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days</option>
                  <option value="14d">14 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </div>

              <div className="space-y-3">
                <ToggleRow label="Two-Factor Authentication" desc="Require a secondary verification code on login." checked={twoFactorEnabled} onChange={setTwoFactor} />
                <ToggleRow label="Activity Logging" desc="Log all agent executions and API calls to the audit trail." checked={logActivity} onChange={setLogActivity} />
              </div>

              {/* Info block */}
              <div className="p-4 bg-[#242832] border border-white/10 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-white">Environment Info</h4>
                {[
                  { key: 'NODE_ENV',    val: 'development' },
                  { key: 'JWT_SECRET',  val: '••••••••••••••••' },
                  { key: 'MONGODB_URI', val: 'mongodb://127.0.0.1:27017/taskpilot_ai' },
                  { key: 'PORT',        val: '5000' },
                ].map(row => (
                  <div key={row.key} className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-[#868C99] font-bold">{row.key}</span>
                    <span className="text-[#E8B45D] font-bold">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  onClick={handleSaveSecurity}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] text-[10px] font-bold rounded-xl shadow-2xl cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Security Config</span>
                </button>
              </div>
            </GlassCard>
          )}

        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
};

export default Settings;
