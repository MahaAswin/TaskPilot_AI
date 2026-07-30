import React, { useState } from 'react';
import { 
  Pin, Star, Trash2, Edit3, MessageSquare, Search, Plus, FolderPlus, 
  ChevronDown, ChevronRight, Folder, FolderClosed 
} from 'lucide-react';

export const WorkspaceSidebar = ({ 
  chats = [], 
  activeChatId, 
  onSelectChat, 
  onCreateChat, 
  onRenameChat, 
  onDeleteChat, 
  onTogglePin, 
  onToggleFavorite 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({ Default: true });

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group chats by folder category
  const chatsByFolder = filteredChats.reduce((acc, chat) => {
    const fName = chat.folder || 'Default';
    if (!acc[fName]) acc[fName] = [];
    acc[fName].push(chat);
    return acc;
  }, {});

  const startEditing = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditTitle(chat.title);
  };

  const saveEdit = (id, e) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  return (
    <div className="w-64 border-r border-white/10 bg-[#1B1E25] flex flex-col h-full select-none shrink-0">
      
      {/* Search Header */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#ECEAE3] uppercase tracking-wider">Conversations</span>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => {
                const folderName = prompt('Enter new folder name:');
                if (folderName) {
                  setExpandedFolders(p => ({ ...p, [folderName]: true }));
                  onCreateChat('New Chat', folderName);
                }
              }}
              title="Add Folder"
              className="p-1 text-[#868C99] hover:text-[#ECEAE3] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onCreateChat('New Workspace Session', 'Default')}
              title="New Session"
              className="p-1 text-[#E8B45D] hover:bg-[rgba(232,180,93,0.14)] rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#868C99] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search active chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-white/10 bg-[#242832] focus:bg-[#242832] text-xs rounded-xl focus:outline-none focus:border-[#E8B45D]/50 text-white placeholder-[#868C99]"
          />
        </div>
      </div>

      {/* Folders & Chats scroll area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* Pinned section (Top layer) */}
        {chats.some(c => c.isPinned) && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-black text-[#E8B45D] uppercase tracking-wider">
              <Pin className="w-3 h-3 text-[#E8B45D] fill-[#E8B45D] rotate-45" />
              <span>Pinned Sessions</span>
            </div>
            {chats.filter(c => c.isPinned).map(chat => (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeChatId === chat._id
                    ? 'bg-[rgba(232,180,93,0.14)] border-[#E8B45D]/30 text-[#E8B45D]'
                    : 'bg-transparent border-transparent text-[#C6C9D1] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E8B45D]/75 shrink-0" />
                  {editingId === chat._id ? (
                    <form onSubmit={(e) => saveEdit(chat._id, e)} className="w-full">
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={(e) => saveEdit(chat._id, e)}
                        className="w-full bg-[#242832] text-[#ECEAE3] border border-white/10 px-1.5 py-0.5 rounded text-xs focus:outline-none focus:border-[#E8B45D]"
                      />
                    </form>
                  ) : (
                    <span className="truncate">{chat.title}</span>
                  )}
                </div>

                {editingId !== chat._id && (
                  <div className="hidden group-hover:flex items-center gap-1.5 shrink-0 pl-1">
                    <button onClick={(e) => { e.stopPropagation(); onTogglePin(chat._id, false); }} className="text-[#868C99] hover:text-[#ECEAE3]">
                      <Pin className="w-3 h-3 text-[#E8B45D] fill-[#E8B45D]" />
                    </button>
                    <button onClick={(e) => startEditing(chat, e)} className="text-[#868C99] hover:text-[#ECEAE3]">
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }} className="text-[#E2836A] hover:text-[#E2836A]/80">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Folders Accordion */}
        <div className="space-y-2">
          {Object.keys(chatsByFolder).map(folderName => {
            const isExpanded = expandedFolders[folderName];
            const folderChats = chatsByFolder[folderName];

            return (
              <div key={folderName} className="space-y-1">
                {/* Accordion header */}
                <button
                  onClick={() => toggleFolder(folderName)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-[#868C99] hover:text-[#ECEAE3] rounded-lg hover:bg-white/5 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    {isExpanded ? <Folder className="w-3.5 h-3.5 text-[#E8B45D]" /> : <FolderClosed className="w-3.5 h-3.5 text-[#868C99]" />}
                    <span>{folderName}</span>
                  </div>
                  <span className="font-mono text-[9px] font-semibold">{folderChats.length}</span>
                </button>

                {/* Expanded chat sessions list */}
                {isExpanded && (
                  <div className="pl-3 space-y-0.5 border-l border-white/10 ml-5">
                    {folderChats.map(chat => (
                      <div
                        key={chat._id}
                        onClick={() => onSelectChat(chat._id)}
                        className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          activeChatId === chat._id
                            ? 'bg-[rgba(232,180,93,0.14)] border-[#E8B45D]/30 text-[#E8B45D] shadow-sm'
                            : 'bg-transparent border-transparent text-[#C6C9D1] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#868C99] group-hover:text-[#E8B45D] shrink-0" />
                          {editingId === chat._id ? (
                            <form onSubmit={(e) => saveEdit(chat._id, e)} className="w-full">
                              <input
                                type="text"
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={(e) => saveEdit(chat._id, e)}
                                className="w-full bg-[#242832] text-[#ECEAE3] border border-white/10 px-1.5 py-0.5 rounded text-xs focus:outline-none focus:border-[#E8B45D]"
                              />
                            </form>
                          ) : (
                            <span className="truncate">{chat.title}</span>
                          )}
                        </div>

                        {editingId !== chat._id && (
                          <div className="hidden group-hover:flex items-center gap-1.5 shrink-0 pl-1">
                            <button onClick={(e) => { e.stopPropagation(); onTogglePin(chat._id, !chat.isPinned); }} className="text-[#868C99] hover:text-[#ECEAE3]">
                              <Pin className="w-3 h-3 rotate-45" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(chat._id, !chat.isFavorite); }} className="text-[#868C99] hover:text-[#ECEAE3]">
                              <Star className={`w-3 h-3 ${chat.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                            </button>
                            <button onClick={(e) => startEditing(chat, e)} className="text-[#868C99] hover:text-[#ECEAE3]">
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }} className="text-[#E2836A] hover:text-[#E2836A]/80">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default WorkspaceSidebar;
