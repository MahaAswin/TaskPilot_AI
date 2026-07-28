import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ activeChatId, onSelectChat, forceRefreshTrigger }) => {
  const { addToast } = useToast();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch chats on mount and when forced
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/chats');
      if (res.data?.success) {
        setChats(res.data.chats);
      }
    } catch (err) {
      console.error('[Sidebar] Error loading chats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [forceRefreshTrigger]);

  const handleCreateChat = async () => {
    setIsCreating(true);
    try {
      const res = await axios.post('/chats', { title: `Session #${chats.length + 1}` });
      if (res.data?.success) {
        const newChat = res.data.chat;
        setChats((prev) => [newChat, ...prev]);
        onSelectChat(newChat._id);
        addToast('New conversation session initialized.', 'success');
      }
    } catch (err) {
      addToast('Failed to create new session.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Avoid selecting chat
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const res = await axios.delete(`/chats/${chatId}`);
      if (res.data?.success) {
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        if (activeChatId === chatId) {
          onSelectChat(null); // Clear selection
        }
        addToast('Conversation deleted.', 'success');
      }
    } catch (err) {
      addToast('Failed to delete conversation.', 'error');
    }
  };

  return (
    <aside className="w-80 border-r border-white/5 bg-zinc-950/40 backdrop-blur-md h-[calc(100vh-4rem)] flex flex-col shrink-0">
      
      {/* Action Header */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={handleCreateChat}
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-xl text-xs font-bold text-white shadow-glow transition-all duration-200"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>New AI Collaboration</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Recent Sessions</span>
          <button 
            onClick={fetchChats} 
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            title="Reload Chats"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            <span className="text-xs text-zinc-500">Loading history...</span>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-zinc-600">
            No active conversations. Start one to collaborate with agents!
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = chat._id === activeChatId;
            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-300 shadow-sm'
                    : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                  <span className="text-xs font-semibold truncate pr-2">{chat.title}</span>
                </div>
                
                {/* Delete button (only show on hover or active) */}
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-950/30 rounded text-zinc-500 hover:text-rose-400 transition-all ${
                    isActive ? 'opacity-100' : ''
                  }`}
                  title="Delete Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Info Footnote */}
      <div className="p-4 border-t border-white/5 bg-zinc-950/20 flex items-center justify-between text-[10px] text-zinc-600 font-medium">
        <span>Active Agents: 6 online</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Gateway Connected
        </span>
      </div>
      
    </aside>
  );
};

export default Sidebar;
