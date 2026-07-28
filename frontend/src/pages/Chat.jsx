import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Send, Sparkles, Cpu, Loader2, Play } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AgentStatusList from '../components/AgentStatusList';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Chat = () => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Traces of currently executing agents
  const [agentTraces, setAgentTraces] = useState({});
  // Running text chunk accumulation
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);

  const messagesEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, agentTraces]);

  // Load chat messages when activeChatId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChatId) {
        setMessages([]);
        return;
      }

      try {
        setMessages([]);
        const res = await axios.get(`/chats/${activeChatId}/messages`);
        if (res.data?.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('[Chat] Failed to load messages:', err);
        addToast('Failed to fetch conversation history.', 'error');
      }
    };

    loadMessages();
  }, [activeChatId]);

  // Handle location triggers (e.g. from Dashboard click-suggestion or view-chat)
  useEffect(() => {
    if (location.state?.forceActiveChatId) {
      setActiveChatId(location.state.forceActiveChatId);
      // clean state trigger
      window.history.replaceState({}, document.title);
    } else if (location.state?.prefilledPrompt) {
      const runPrefilled = async () => {
        // Create new chat and send message instantly
        try {
          const res = await axios.post('/chats', { title: 'AI Collaboration' });
          if (res.data?.success) {
            const newId = res.data.chat._id;
            setActiveChatId(newId);
            setSidebarRefreshTrigger(prev => prev + 1);
            // Small delay to let chat register
            setTimeout(() => {
              handleSendMessage(location.state.prefilledPrompt, newId);
            }, 300);
          }
        } catch (err) {
          console.error(err);
        }
        window.history.replaceState({}, document.title);
      };
      runPrefilled();
    }
  }, [location.state]);

  const handleSendMessage = async (textToSend, overrideChatId = null) => {
    const targetChatId = overrideChatId || activeChatId;
    const promptText = textToSend || inputText;
    
    if (!promptText.trim() || !targetChatId) return;
    if (isStreaming) return;

    if (!textToSend) setInputText('');

    setIsStreaming(true);
    setStreamingText('');
    setAgentTraces({});

    // Append temporary user message locally
    const tempUserMsg = {
      _id: `temp-usr-${Date.now()}`,
      sender: 'user',
      content: promptText,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBase}/chats/${targetChatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported by server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep last incomplete chunk in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          
          const rawJSON = trimmed.slice(6).trim();
          if (rawJSON === '[DONE]') {
            break;
          }

          try {
            const data = JSON.parse(rawJSON);
            
            if (data.type === 'user_message') {
              // Replace placeholder with saved user message containing DB ID
              setMessages((prev) => 
                prev.map((msg) => msg._id === tempUserMsg._id ? data.payload : msg)
              );
            } 
            
            else if (data.type === 'status') {
              // Update agent traces object
              setAgentTraces((prev) => ({
                ...prev,
                [data.payload.agent]: data.payload.status
              }));
            } 
            
            else if (data.type === 'content') {
              // Accumulate textual stream
              setStreamingText((prev) => prev + data.payload);
            } 
            
            else if (data.type === 'assistant_message') {
              // Stream finished, insert final saved assistant message
              setMessages((prev) => [...prev, data.payload]);
              setStreamingText(''); // Clear buffer
              setAgentTraces({}); // Clear tracers
            }
          } catch (e) {
            console.error('Failed to parse SSE JSON chunk:', rawJSON, e);
          }
        }
      }
      
      // Update sidebar to display new titles / times
      setSidebarRefreshTrigger(prev => prev + 1);

    } catch (err) {
      console.error('[Chat Stream Error]', err);
      addToast(err.message || 'Error occurred during streaming.', 'error');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStartFirstChat = async () => {
    try {
      const res = await axios.post('/chats', { title: 'First AI Collaboration' });
      if (res.data?.success) {
        setActiveChatId(res.data.chat._id);
        setSidebarRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      addToast('Failed to start session.', 'error');
    }
  };

  const samplePrompts = [
    { title: 'Study Plan & Diagram', prompt: 'Create a Java coding study roadmap and generate a flowchart diagram for it.' },
    { title: 'Create Artwork Logo', prompt: 'Generate an digital art illustration of a cyberpunk desktop setup.' },
    { title: 'Productivity Review', prompt: 'Trigger a productivity score coach audit and give me actionable motivation.' },
    { title: 'Academic Summary', prompt: 'Explain the concept of quantum computing in simple bullet points and save this note.' }
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      
      {/* Historical Sessions Sidebar */}
      <Sidebar 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId}
        forceRefreshTrigger={sidebarRefreshTrigger}
      />

      {/* Main Chat Viewport */}
      <div className="flex-1 flex flex-col bg-zinc-950/20 h-full relative">
        
        {/* Messages list container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {!activeChatId ? (
            
            /* Empty Chat State */
            <div className="h-full max-w-2xl mx-auto flex flex-col justify-center items-center text-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/15 blur-2xl rounded-full scale-125 animate-pulse-glow" />
                <div className="relative p-4 bg-zinc-900 border border-white/5 rounded-2xl shadow-glass">
                  <Cpu className="w-8 h-8 text-indigo-400" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Initiate TaskPilot AI Orchestrator</h2>
                <p className="text-zinc-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                  Select a session from the history sidebar or click below to launch a new multi-agent collaboration canvas.
                </p>
              </div>

              <button
                onClick={handleStartFirstChat}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Initialize AI Environment</span>
              </button>

              {/* Sample Prompts Grid */}
              <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {samplePrompts.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={async () => {
                      try {
                        const res = await axios.post('/chats', { title: sample.title });
                        if (res.data?.success) {
                          const newId = res.data.chat._id;
                          setActiveChatId(newId);
                          setSidebarRefreshTrigger(prev => prev + 1);
                          setTimeout(() => handleSendMessage(sample.prompt, newId), 300);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="p-3 bg-zinc-900/35 hover:bg-indigo-600/5 border border-white/5 hover:border-indigo-500/25 rounded-xl text-left cursor-pointer transition-all flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300">{sample.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{sample.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            
            /* Conversations List Rendering */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`flex gap-4 p-5 rounded-2xl border ${
                    msg.sender === 'user' 
                      ? 'bg-zinc-900/40 border-white/5 ml-auto max-w-[85%]' 
                      : 'bg-zinc-900/10 border-transparent mr-auto w-full'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 font-bold text-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                      : 'bg-fuchsia-600/10 border-fuchsia-500/30 text-fuchsia-400'
                  }`}>
                    {msg.sender === 'user' ? user?.name[0].toUpperCase() : 'Co'}
                  </div>

                  {/* Content View */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-mono">
                      {msg.sender === 'user' ? 'Operator' : 'TaskPilot AI Orchestrator'}
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Section */}
              {isStreaming && (
                <div className="space-y-4">
                  {/* 1. Agent grid status tracker */}
                  <AgentStatusList traces={agentTraces} />

                  {/* 2. Chat Output text chunk preview */}
                  {streamingText && (
                    <div className="flex gap-4 p-5 rounded-2xl bg-zinc-900/10 border-transparent mr-auto w-full">
                      <div className="w-8 h-8 rounded-lg border bg-fuchsia-600/10 border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        Co
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-mono">
                          TaskPilot AI (Streaming...)
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <MarkdownRenderer content={streamingText} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Typing pulse if no text streamed yet */}
                  {!streamingText && (
                    <div className="flex gap-4 p-5 rounded-2xl bg-zinc-900/10 border-transparent mr-auto max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg border bg-fuchsia-600/10 border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center shrink-0 font-bold text-xs animate-pulse">
                        Co
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-zinc-600 animate-typing" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 rounded-full bg-zinc-600 animate-typing" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-zinc-600 animate-typing" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area at bottom */}
        {activeChatId && (
          <div className="p-4 bg-gradient-to-t from-background via-background to-transparent border-t border-white/5">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                disabled={isStreaming}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Coordinator Agent (e.g. 'Create a node.js setup schedule and generate a diagram')"
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl glassmorphism-input text-sm text-white placeholder-zinc-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isStreaming || !inputText.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-white shadow-glow transition-all shrink-0"
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Chat;
