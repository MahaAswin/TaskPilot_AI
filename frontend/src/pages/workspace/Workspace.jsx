import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, FileText, HelpCircle, Network, Layers, Sparkles, 
  MessageSquare, BookOpen, Image as ImageIcon, CheckSquare, BarChart, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

// Components Imports
import WorkspaceSidebar from '../../components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '../../components/workspace/WorkspaceHeader';
import ChatMessage from '../../components/workspace/ChatMessage';
import ChatInput from '../../components/workspace/ChatInput';
import AgentTimeline from '../../components/workspace/AgentTimeline';
import OutputCard from '../../components/workspace/OutputCard';
import UploadZone from '../../components/workspace/UploadZone';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';

export const Workspace = () => {
  const { showSuccess, showError } = useToast();
  
  // Layout views state togglers
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'notes' | 'images' | 'quiz' | 'tasks' | 'reports'

  // Chats states
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTraces, setActiveTraces] = useState([]);
  
  // Execution states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isTimelineThinking, setIsTimelineThinking] = useState(false);

  const messagesEndRef = useRef(null);

  // Quick prompt presets
  const quickPrompts = [
    { label: 'Create Roadmap', query: 'Create a roadmap for learning modern React hooks' },
    { label: 'Generate Flowchart', query: 'Generate a flowchart of the water cycle' },
    { label: 'Generate Quiz', query: 'Generate a multiple choice quiz on cellular respiration' },
    { label: 'Summarize Concept', query: 'Explain the mitochondria in a simple table' }
  ];

  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/chat');
        if (res.data?.success) {
          setChats(res.data.data);
          if (res.data.data.length > 0) {
            setActiveChatId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        showError('Failed to fetch conversation history.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Fetch messages when active chat session changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      setIsChatLoading(true);
      try {
        const res = await axios.get(`/chat/${activeChatId}/messages`);
        if (res.data?.success) {
          setMessages(res.data.data);
          
          // Hydrate right timeline using traces from the latest assistant message
          const assistantMsgs = res.data.data.filter(m => m.sender === 'assistant');
          if (assistantMsgs.length > 0) {
            setActiveTraces(assistantMsgs[assistantMsgs.length - 1].agentTraces || []);
          } else {
            setActiveTraces([]);
          }
        }
      } catch (err) {
        showError('Failed to fetch conversation details.');
      } finally {
        setIsChatLoading(false);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Conversation Management Handlers
  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setActiveTab('chat');
  };

  const handleCreateChat = async (title = 'New AI Session', folder = 'Default') => {
    try {
      const res = await axios.post('/chat', { title, folder });
      if (res.data?.success) {
        setChats(prev => [res.data.data, ...prev]);
        setActiveChatId(res.data.data._id);
        showSuccess('New workspace session initialized.');
      }
    } catch (err) {
      showError('Failed to initialize session.');
    }
  };

  const handleRenameChat = async (id, newTitle) => {
    try {
      const res = await axios.put(`/chat/${id}`, { title: newTitle });
      if (res.data?.success) {
        setChats(prev => prev.map(c => c._id === id ? res.data.data : c));
        showSuccess('Conversation renamed.');
      }
    } catch (err) {
      showError('Failed to update title.');
    }
  };

  const handleTogglePin = async (id, isPinned) => {
    try {
      const res = await axios.put(`/chat/${id}`, { isPinned });
      if (res.data?.success) {
        setChats(prev => prev.map(c => c._id === id ? res.data.data : c));
        showSuccess(isPinned ? 'Session pinned to top' : 'Session unpinned');
      }
    } catch (err) {
      showError('Pin operation failed.');
    }
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      const res = await axios.put(`/chat/${id}`, { isFavorite });
      if (res.data?.success) {
        setChats(prev => prev.map(c => c._id === id ? res.data.data : c));
        showSuccess(isFavorite ? 'Saved to Favorites' : 'Removed from Favorites');
      }
    } catch (err) {
      showError('Favorite operation failed.');
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      const res = await axios.delete(`/chat/${id}`);
      if (res.data?.success) {
        setChats(prev => prev.filter(c => c._id !== id));
        if (activeChatId === id) {
          const remaining = chats.filter(c => c._id !== id);
          if (remaining.length > 0) {
            setActiveChatId(remaining[0]._id);
          } else {
            setActiveChatId(null);
            setMessages([]);
            setActiveTraces([]);
          }
        }
        showSuccess('Conversation deleted.');
      }
    } catch (err) {
      showError('Delete operation failed.');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setActiveTraces([]);
    showSuccess('Conversation cleared locally.');
  };

  // Upload attachment zone
  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('size', file.size);
    formData.append('type', file.type);

    const res = await axios.post('/chat/upload', formData);
    return res.data;
  };

  // Export history triggers
  const handleExportChat = async (format) => {
    try {
      const res = await axios.post(`/chat/${activeChatId}/export`, { format });
      if (res.data?.success) {
        showSuccess(`Compiled chat history to ${format.toUpperCase()} successfully.`);
      }
    } catch (err) {
      showError('Export compilation failed.');
    }
  };

  // Send Prompt Message Flow
  const handleSendMessage = async (text, file = null) => {
    if (!activeChatId) return;

    // Append user message local bubble
    const localUserMsg = {
      _id: `user-temp-${Date.now()}`,
      sender: 'user',
      content: text + (file ? `\n\n*(Attachment uploaded: ${file.name})*` : ''),
      createdAt: new Date()
    };
    setMessages(prev => [...prev, localUserMsg]);
    setIsChatLoading(true);
    setIsTimelineThinking(true);

    try {
      const res = await axios.post(`/chat/${activeChatId}/message`, { prompt: text });
      if (res.data?.success) {
        // Mock stream delay to display multi-agent step run sequences
        setTimeout(() => {
          setMessages(prev => [...prev, res.data.data]);
          setActiveTraces(res.data.data.agentTraces || []);
          setIsChatLoading(false);
          setIsTimelineThinking(false);
          
          // Switch to corresponding preview tabs based on query keywords
          const lower = text.toLowerCase();
          if (lower.includes('roadmap') || lower.includes('plan')) {
            setActiveTab('tasks');
          } else if (lower.includes('quiz')) {
            setActiveTab('quiz');
          } else if (lower.includes('chart') || lower.includes('mindmap')) {
            setActiveTab('notes');
          }
        }, 1500);
      }
    } catch (err) {
      showError('Failed to route query through Coordinator.');
      setIsChatLoading(false);
      setIsTimelineThinking(false);
    }
  };

  const activeChatObj = chats.find(c => c._id === activeChatId);

  if (isInitialLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      
      {/* 1. Left Sidebar panel */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block h-full"
          >
            <WorkspaceSidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onCreateChat={handleCreateChat}
              onRenameChat={handleRenameChat}
              onDeleteChat={handleDeleteChat}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Center Panel: chat + workspace headers */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200 overflow-hidden relative">
        <WorkspaceHeader
          chatTitle={activeChatObj?.title}
          onClearChat={handleClearChat}
          onCreateChat={handleCreateChat}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          onExportChat={handleExportChat}
        />

        {/* Tab selector bar */}
        <div className="bg-white border-b border-slate-100 px-6 py-2 flex items-center gap-1.5 shrink-0 overflow-x-auto select-none">
          {[
            { id: 'chat', label: 'AI Chat', icon: MessageSquare },
            { id: 'notes', label: 'Study Notes', icon: BookOpen },
            { id: 'quiz', label: 'Flashcards & Quiz', icon: HelpCircle },
            { id: 'tasks', label: 'Timelines Board', icon: CheckSquare },
            { id: 'reports', label: 'Coach Logs', icon: BarChart }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Panel Viewport renderers */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/20">
          
          {/* Chat Tab Viewport */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 pt-12 select-none">
                    <div className="p-4 bg-indigo-50 border border-slate-150 rounded-2xl shadow-soft">
                      <Cpu className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Empty Workspace Session</h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Multi-Agent gateway is active. Send a message or click a preset below to instruct the coordinator.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <ChatMessage key={msg._id} message={msg} />
                  ))
                )}
                
                {/* Typing Stream Indicator */}
                {isChatLoading && (
                  <div className="flex gap-4 w-full max-w-3xl mx-auto py-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/50 flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2 bg-slate-150 rounded-full w-1/4 animate-pulse" />
                      <div className="h-2 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                      <div className="h-2 bg-slate-100 rounded-full w-2/3 animate-pulse" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Floating Quick Prompts Preset cards */}
              {messages.length === 0 && !isChatLoading && (
                <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto mb-4 px-2">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.query)}
                      className="p-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-left text-[10px] font-semibold text-slate-600 shadow-soft cursor-pointer hover:border-indigo-200 transition-all flex items-center justify-between"
                    >
                      <span>{p.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Input field */}
              <ChatInput 
                onSendMessage={handleSendMessage}
                onUploadFile={handleUploadFile}
                isLoading={isChatLoading}
              />
            </div>
          )}

          {/* Notes Tab Viewport */}
          {activeTab === 'notes' && (
            <div className="max-w-2xl mx-auto py-4 space-y-6">
              <OutputCard type="notes" />
              <OutputCard type="mindmap" />
            </div>
          )}

          {/* Quiz Tab Viewport */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto py-4 space-y-6">
              <OutputCard type="quiz" />
              <OutputCard type="flashcards" />
            </div>
          )}

          {/* Tasks Tab Viewport */}
          {activeTab === 'tasks' && (
            <div className="max-w-2xl mx-auto py-4 space-y-4">
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-wide">
                <CheckSquare className="w-4.5 h-4.5" />
                <span>Generated Study Tasks Board</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-soft space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-indigo-600 font-bold">
                    <span>Task 1: Membrane Passways</span>
                    <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">In Progress</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Study diffusion and active transport mechanisms.</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-soft space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-emerald-600 font-bold">
                    <span>Task 2: Krebs Cycle Diagram</span>
                    <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Completed</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Map Krebs enzyme matrices processes.</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab Viewport */}
          {activeTab === 'reports' && (
            <div className="max-w-2xl mx-auto py-4 space-y-4">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase tracking-wide">
                <BarChart className="w-4.5 h-4.5 animate-pulse" />
                <span>Productivity Coach Report Logs</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-soft space-y-3">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Performance Audit Log</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  Multi-Agent compiler successfully tracked query cycles. Overall interaction status has triggered +2 XP to operator dashboard profile ratings.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Right Sidebar panel (Agent execution & File Upload studio) */}
      <AnimatePresence initial={false}>
        {isRightPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block w-70 h-full overflow-y-auto bg-white p-4 space-y-6 shrink-0"
          >
            {/* Agent Timeline */}
            <AgentTimeline 
              activeTraces={activeTraces} 
              isThinking={isTimelineThinking} 
            />

            <hr className="border-slate-100" />

            {/* File Upload Zone */}
            <UploadZone onFileSelected={(file) => handleUploadFile(file)} />

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Workspace;
