import React, { useState } from 'react';
import { 
  Download, Trash2, Plus, Settings, ChevronDown, Check, FileText, 
  Menu, Cpu, Clipboard, BookOpen, AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const WorkspaceHeader = ({ 
  chatTitle, 
  onClearChat, 
  onCreateChat, 
  onToggleSidebar, 
  onToggleRightPanel, 
  onExportChat 
}) => {
  const { showSuccess } = useToast();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportFormats = [
    { label: 'PDF Document (.pdf)', format: 'pdf', icon: FileText },
    { label: 'Word Document (.docx)', format: 'docx', icon: FileText },
    { label: 'Markdown Format (.md)', format: 'md', icon: FileText },
    { label: 'Plain Text File (.txt)', format: 'txt', icon: FileText },
    { label: 'Copy to Clipboard', format: 'copy', icon: Clipboard }
  ];

  const handleExport = (format) => {
    if (format === 'copy') {
      navigator.clipboard.writeText(`Exported content for chat: ${chatTitle}`);
      showSuccess('Conversation text copied to clipboard!');
    } else {
      onExportChat(format);
    }
    setShowExportMenu(false);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0">
      
      {/* Left items: title & sidebar toggle */}
      <div className="flex items-center gap-3 overflow-hidden">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-2 overflow-hidden">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
          <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider truncate max-w-[180px] sm:max-w-xs">
            {chatTitle || 'AI Productivity Companion'}
          </h2>
        </div>
      </div>

      {/* Right actions toolbar */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onCreateChat('New Workspace Session', 'Default')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/50 text-indigo-600 text-[10px] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Export dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 rounded-xl transition-colors shadow-soft cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showExportMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5">
                <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1.5">
                  Select Format
                </div>
                {exportFormats.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.format}
                      onClick={() => handleExport(item.format)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <button 
          onClick={onClearChat}
          title="Clear Conversation"
          className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button 
          onClick={onToggleRightPanel}
          title="Agent Timeline & Previews"
          className="p-2 border border-slate-200 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
        </button>
      </div>

    </header>
  );
};

export default WorkspaceHeader;
