import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Play, Download, ExternalLink, Calendar, CheckSquare, MessageSquare, 
  Sparkles, Award, ArrowRight, RefreshCw, Loader2, Image as ImageIcon 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await axios.get('/productivity/dashboard');
      if (res.data?.success) {
        setData(res.data.summary);
      }
    } catch (err) {
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSuggestionClick = (suggestionText) => {
    // Navigate to chat pre-filled
    navigate('/chat', { state: { prefilledPrompt: suggestionText } });
    addToast('Orchestration query loaded to Co-Pilot Chat.', 'info');
  };

  const handleDownload = async (url, prompt) => {
    addToast('Downloading image...', 'info');
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `taskpilot-${prompt.replace(/\s+/g, '_').substring(0, 15)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6 items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="text-zinc-500 text-sm font-semibold tracking-wider uppercase font-mono">
          Compiling productivity matrices...
        </span>
      </div>
    );
  }

  // Fallbacks if data empty
  const summary = data || {
    greeting: 'Welcome back, User',
    productivityScore: 70,
    tasks: { pending: 0, todayTotal: 0, todayCompleted: 0 },
    recentChats: [],
    recentImages: [],
    productivityHistory: [],
    upcomingReminders: [],
    suggestions: []
  };

  const taskPercentage = summary.tasks.todayTotal > 0 
    ? Math.round((summary.tasks.todayCompleted / summary.tasks.todayTotal) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            {summary.greeting}
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-medium">
            Here's your Agentic Productivity overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-zinc-900/30 hover:bg-zinc-800/40 rounded-xl text-xs font-bold text-zinc-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Matrix</span>
          </button>
          <Link
            to="/chat"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-glow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Co-Pilot</span>
          </Link>
        </div>
      </div>

      {/* Grid Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: Productivity Score Gauge */}
        <GlassCard delay={0.05} className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Productivity Score</h3>
            <Award className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          
          <div className="my-6 flex items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full border border-white/5 bg-white/2">
              {/* Pulsing ring visual */}
              <div className="absolute inset-2 rounded-full border border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="flex flex-col items-center z-10 leading-none">
                <span className="text-4xl font-black text-white font-mono">{summary.productivityScore}%</span>
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider mt-1 uppercase">Rating</span>
              </div>
              
              {/* Colored border gauge using standard styling */}
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-indigo-500 border-r-indigo-500" />
            </div>
          </div>

          <div className="text-xs text-zinc-500 text-center leading-relaxed font-medium">
            Score is computed from total items completed. Ask the coach to generate advice to improve.
          </div>
        </GlassCard>

        {/* Widget 2: Today's Tasks completed */}
        <GlassCard delay={0.1} className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Today's Progress</h3>
            <CheckSquare className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="my-6 space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white font-mono">{summary.tasks.todayCompleted}/{summary.tasks.todayTotal}</span>
                <span className="text-xs text-zinc-500 font-semibold mt-0.5">Tasks Completed Today</span>
              </div>
              <span className="text-sm font-bold text-indigo-400 font-mono">{taskPercentage}%</span>
            </div>

            {/* Premium progress bar */}
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${taskPercentage}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-zinc-400 flex items-center justify-between bg-white/3 border border-white/5 p-3 rounded-xl">
            <span className="font-semibold">Pending checklist total:</span>
            <span className="font-bold text-white bg-indigo-500/20 px-2 py-0.5 border border-indigo-500/30 rounded-md font-mono">
              {summary.tasks.pending} active
            </span>
          </div>
        </GlassCard>

        {/* Widget 3: Productivity Analytics Log (Mini Chart) */}
        <GlassCard delay={0.15} className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Weekly Metric History</h3>
            <Calendar className="w-5 h-5 text-fuchsia-400" />
          </div>

          <div className="my-6 h-28 flex items-end justify-between gap-2.5">
            {summary.productivityHistory.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 italic">
                No logs recorded yet. Create tasks!
              </div>
            ) : (
              summary.productivityHistory.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full bg-zinc-800 border border-white/5 rounded-t-md overflow-hidden flex items-end" style={{ height: '80%' }}>
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-500/60 to-fuchsia-500 rounded-t-sm group-hover:opacity-85 transition-opacity" 
                      style={{ height: `${day.score}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-zinc-950 border border-white/10 text-[9px] font-black font-mono text-white px-1.5 py-0.5 rounded shadow-lg z-20 whitespace-nowrap">
                      {day.score}% ({day.completed} completed)
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono font-semibold uppercase">{day.date.substring(5)}</span>
                </div>
              ))
            )}
          </div>

          <div className="text-xs text-zinc-500 text-center leading-none font-semibold">
            Chronological Daily Score Analysis
          </div>
        </GlassCard>

      </div>

      {/* Center Section: AI Suggestions & Upcoming Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Copilot Suggestions */}
        <GlassCard delay={0.2} className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">AI Co-Pilot Recommendations</h3>
          </div>
          
          <div className="space-y-3">
            {summary.suggestions.map((sug, idx) => (
              <div 
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="group flex items-start gap-3 p-3.5 bg-white/2 hover:bg-indigo-600/5 border border-white/5 hover:border-indigo-500/30 rounded-xl cursor-pointer transition-all"
              >
                <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg mt-0.5 shrink-0 group-hover:bg-indigo-600/20 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-300 font-medium group-hover:text-white transition-colors leading-relaxed">
                    {sug}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Reminders / Deadlines */}
        <GlassCard delay={0.25} className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Upcoming Schedule Milestones</h3>
          </div>

          <div className="space-y-3">
            {summary.upcomingReminders.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500 bg-white/2 rounded-xl border border-white/5 border-dashed">
                No upcoming deadlines. You're fully caught up!
              </div>
            ) : (
              summary.upcomingReminders.map((rem) => {
                const isOverdue = new Date(rem.dueDate) < new Date();
                return (
                  <div key={rem._id} className="flex items-center justify-between p-3.5 bg-white/2 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        rem.priority === 'high' ? 'bg-rose-500' : rem.priority === 'medium' ? 'bg-amber-400' : 'bg-zinc-500'
                      }`} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-200 truncate">{rem.title}</span>
                        <span className={`text-[10px] font-semibold mt-0.5 ${isOverdue ? 'text-rose-400' : 'text-zinc-500'}`}>
                          Due: {new Date(rem.dueDate).toLocaleDateString()} {isOverdue ? '(Overdue)' : ''}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/tasks"
                      className="text-[10px] font-bold text-indigo-400 hover:underline shrink-0"
                    >
                      View Board
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>

      </div>

      {/* Gallery Section: Recent Images */}
      <GlassCard delay={0.3} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-fuchsia-400" />
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Recent Generated Artwork</h3>
          </div>
          <Link
            to="/chat"
            className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Ask Creative Agent</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {summary.recentImages.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500 bg-white/2 rounded-2xl border border-white/5 border-dashed">
            No illustrations generated. Enter the chat and ask "Generate a concept logo of a space jet".
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {summary.recentImages.map((img) => (
              <div 
                key={img._id} 
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-950 border border-white/5 hover:border-fuchsia-500/40 transition-all duration-300"
              >
                <img 
                  src={img.url} 
                  alt={img.prompt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Hover mask */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5">
                  <button
                    onClick={() => handleDownload(img.url, img.prompt)}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    title="Zoom"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* History section: recent chats */}
      <GlassCard delay={0.35} className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Recent AI Conversations</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.recentChats.length === 0 ? (
            <div className="col-span-full text-center py-6 text-xs text-zinc-600">
              No conversation sessions found. Start a new session in chat!
            </div>
          ) : (
            summary.recentChats.map((chat) => (
              <Link
                key={chat._id}
                to="/chat"
                state={{ forceActiveChatId: chat._id }}
                className="flex items-center justify-between p-4 bg-white/2 hover:bg-indigo-600/5 border border-white/5 hover:border-indigo-500/25 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MessageSquare className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-zinc-200 truncate pr-2">{chat.title}</span>
                    <span className="text-[9px] text-zinc-500 font-semibold font-mono mt-0.5">
                      Updated: {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              </Link>
            ))
          )}
        </div>
      </GlassCard>

    </div>
  );
};

export default Dashboard;
