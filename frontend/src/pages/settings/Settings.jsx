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
  { id: 'gemini',      label: 'Gemini',      model: 'gemini-1.5-flash',          icon: Sparkles, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    envKey: 'GEMINI_API_KEY' },
  { id: 'grok',        label: 'Grok (xAI)',  model: 'grok-beta',                 icon: Zap,      color: 'text-slate-700',   bg: 'bg-slate-50',   border: 'border-slate-200',   envKey: 'GROK_API_KEY' },
  { id: 'openai',      label: 'OpenAI',      model: 'gpt-4o',                    icon: Bot,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', envKey: 'OPENAI_API_KEY' },
  { id: 'claude',      label: 'Claude',      model: 'claude-3-5-sonnet-20241022',icon: Brain,    color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   envKey: 'CLAUDE_API_KEY' },
  { id: 'deepseek',    label: 'DeepSeek',    model: 'deepseek-chat',             icon: Cpu,      color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  envKey: 'DEEPSEEK_API_KEY' },
  { id: 'mistral',     label: 'Mistral',     model: 'mistral-large-latest',      icon: Globe,    color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200',  envKey: 'MISTRAL_API_KEY' },
  { id: 'ollama',      label: 'Ollama',      model: 'llama3:8b',                 icon: Server,   color: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-200',    envKey: 'OLLAMA_BASE_URL' },
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
    <div className={`p-4 border rounded-2xl bg-white transition-all ${filled ? 'border-emerald-200 shadow-sm' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 ${provider.bg} ${provider.border} border rounded-lg`}>
            <Icon className={`w-3.5 h-3.5 ${provider.color}`} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{provider.label}</span>
            <span className="block text-[8px] font-mono text-slate-400">{provider.model}</span>
          </div>
        </div>
        {filled
          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          : <Circle className="w-4 h-4 text-slate-300 shrink-0" />
        }
      </div>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${provider.envKey}...`}
          className="w-full pr-9 pl-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white text-[10px] font-mono rounded-xl focus:outline-none focus:border-indigo-400 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

// Toggle row
const ToggleRow = ({ label, desc, checked, onChange, color = 'text-indigo-600' }) => (
  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
    <div>
      <span className="text-xs font-bold text-slate-800 block">{label}</span>
      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
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
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-600" />
            <span>SYSTEM CONFIGURATION</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Configure AI providers, workspace rules, and interface preferences</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[9px] font-mono font-bold text-slate-500">API:</span>
          <span className="text-[9px] font-mono font-bold text-indigo-600">http://localhost:5000/api</span>
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
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 select-none">Primary AI Provider</h3>
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
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? p.color : 'text-slate-400'}`} />
                        <span className={`text-[9px] font-black uppercase tracking-wider ${active ? p.color : 'text-slate-500'}`}>{p.label}</span>
                        {active && <span className="text-[7px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">Active</span>}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Fallback priority chain */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-1 select-none">Fallback Priority Chain</h3>
                <p className="text-[9px] text-slate-400 font-semibold mb-4">Select providers in order of fallback preference. Mock is always last.</p>
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
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                        } ${id === 'mock' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {active && pos >= 0 && (
                          <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[8px] font-black flex items-center justify-center">
                            {pos + 1}
                          </span>
                        )}
                        {id}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[8px] text-slate-400 font-mono mt-3">
                  Current chain: <span className="text-indigo-600 font-bold">{[...priorityChain, 'mock'].join(' → ')}</span>
                </p>
              </GlassCard>

              {/* API Keys */}
              <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft">
                <div className="flex items-center justify-between mb-4 select-none">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">API Keys</h3>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Keys are stored in your .env file and never transmitted.</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600">
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
                <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleSaveKeys}
                    disabled={isSavingKeys}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all disabled:opacity-50"
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
            <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 select-none">Workspace Preferences</h3>

              {/* Default session title */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Default Session Title</label>
                <input
                  type="text"
                  value={defaultWorkspaceTitle}
                  onChange={e => setDefaultWorkspaceTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold rounded-xl focus:outline-none focus:border-indigo-400 transition-all"
                />
              </div>

              {/* Max history */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Max Conversation History Items: <span className="text-indigo-600">{maxHistoryItems}</span>
                </label>
                <input
                  type="range" min={10} max={200} step={10}
                  value={maxHistoryItems}
                  onChange={e => setMaxHistoryItems(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1">
                  <span>10</span><span>200</span>
                </div>
              </div>

              <div className="space-y-3">
                <ToggleRow label="Auto-Save Sessions" desc="Automatically persist workspace conversations to database." checked={autoSaveSession} onChange={setAutoSaveSession} />
                <ToggleRow label="Show Agent Timeline" desc="Display real-time agent execution traces in the right panel." checked={showAgentTimeline} onChange={setShowAgentTimeline} />
                <ToggleRow label="Markdown Rendering" desc="Render AI responses with full markdown syntax highlighting." checked={enableMarkdown} onChange={setEnableMarkdown} />
                <ToggleRow label="Response Telemetry" desc="Log provider name, latency, and token count per response." checked={enableTelemetry} onChange={setEnableTelemetry} />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={handleSaveWorkspace}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Workspace Config</span>
                </button>
              </div>
            </GlassCard>
          )}

          {/* ── APPEARANCE ───────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 select-none">Appearance & Interface</h3>

              {/* Accent color */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">Accent Color</label>
                <div className="flex gap-3 flex-wrap">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`flex flex-col items-center gap-1.5 cursor-pointer group`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${c.cls} transition-all ${accentColor === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-70 hover:opacity-100'}`} />
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${accentColor === c.id ? 'text-slate-800' : 'text-slate-400'}`}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme preview */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">Theme Mode</label>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  {[
                    { id: 'light', label: 'Light Mode', bg: 'bg-white border-slate-200', dot: 'bg-slate-800' },
                    { id: 'dark',  label: 'Dark Mode',  bg: 'bg-slate-900 border-slate-700', dot: 'bg-white' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => t.id === 'light' && showSuccess('Light mode is active — dark mode coming soon!')}
                      className={`p-3 border rounded-2xl flex flex-col gap-2 cursor-pointer transition-all ${t.bg} ${t.id === 'light' ? 'ring-2 ring-indigo-400' : 'opacity-50'}`}
                    >
                      <div className="flex gap-1">
                        {['bg-rose-400','bg-amber-400','bg-emerald-400'].map(c => (
                          <div key={c} className={`w-2 h-2 rounded-full ${c}`} />
                        ))}
                      </div>
                      <div className={`h-1.5 w-3/4 rounded ${t.dot} opacity-30`} />
                      <div className={`h-1.5 w-1/2 rounded ${t.dot} opacity-20`} />
                      <span className={`text-[8px] font-black uppercase tracking-wider mt-1 ${t.id === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <ToggleRow label="Compact Mode" desc="Reduce padding and spacing across all dashboard panels." checked={compactMode} onChange={setCompactMode} />
                <ToggleRow label="Motion Animations" desc="Enable Framer Motion transitions and hover effects." checked={animationsEnabled} onChange={setAnimations} />
                <ToggleRow label="Collapsed Sidebar Default" desc="Start with the sidebar collapsed on dashboard load." checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Appearance</span>
                </button>
              </div>
            </GlassCard>
          )}

          {/* ── SECURITY ─────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 select-none">Security & Session</h3>

              {/* Session timeout */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">JWT Session Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 rounded-xl focus:outline-none focus:border-indigo-400"
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
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Environment Info</h4>
                {[
                  { key: 'NODE_ENV',    val: 'development' },
                  { key: 'JWT_SECRET',  val: '••••••••••••••••' },
                  { key: 'MONGODB_URI', val: 'mongodb://127.0.0.1:27017/taskpilot_ai' },
                  { key: 'PORT',        val: '5000' },
                ].map(row => (
                  <div key={row.key} className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-500 font-bold">{row.key}</span>
                    <span className="text-indigo-600 font-bold">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={handleSaveSecurity}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all"
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
