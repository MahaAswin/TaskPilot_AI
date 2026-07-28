import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bold, Italic, Heading, List, Code, Undo2, Redo2, Maximize2, Minimize2, 
  Eye, Edit3, Save, X, RefreshCw, BadgeAlert
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const NoteEditor = ({ note, onSave, onClose }) => {
  const { showSuccess } = useToast();

  const [title, setTitle] = useState(note?.title || 'New Note');
  const [topic, setTopic] = useState(note?.topic || 'General Topic');
  const [category, setCategory] = useState(note?.category || 'General');
  const [content, setContent] = useState(note?.content || '');
  
  // Editor visual states
  const [previewMode, setPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState('Draft loaded');

  // History state for Undo/Redo
  const [history, setHistory] = useState([note?.content || '']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const textareaRef = useRef(null);

  // Autosave simulation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAutosaveStatus('Autosaving draft...');
      setTimeout(() => {
        setAutosaveStatus(`Saved draft ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      }, 800);
    }, 15000);

    return () => clearInterval(timer);
  }, [content]);

  // Handle content updates & save to history stack
  const handleContentChange = (val) => {
    setContent(val);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(val);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setContent(history[idx]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setContent(history[idx]);
    }
  };

  // Toolbar action formatter helper
  const insertFormatting = (syntax) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textVal = textarea.value;

    const selectedText = textVal.substring(start, end);
    let inserted;

    switch (syntax) {
      case 'bold':
        inserted = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        inserted = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        inserted = `\n### ${selectedText || 'Heading'}\n`;
        break;
      case 'list':
        inserted = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'code':
        inserted = `\n\`\`\`javascript\n${selectedText || '// code segment'}\n\`\`\`\n`;
        break;
      default:
        return;
    }

    const updatedText = textVal.substring(0, start) + inserted + textVal.substring(end);
    handleContentChange(updatedText);

    // Reset selection indexes
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + inserted.length, start + inserted.length);
    }, 100);
  };

  const executeSave = () => {
    onSave({
      id: note?._id,
      title,
      topic,
      category,
      content,
      difficulty: note?.difficulty || 'intermediate',
      language: note?.language || 'English',
      status: 'saved'
    });
    showSuccess('Document changes updated successfully!');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm" onClick={onClose} />

      {/* Editor Box */}
      <div className={`relative bg-white border border-slate-200 shadow-xl flex flex-col z-10 transition-all ${
        isFullscreen 
          ? 'w-screen h-screen rounded-none' 
          : 'w-full max-w-3xl h-[85vh] rounded-2xl overflow-hidden'
      }`}>
        
        {/* Editor Top Bar Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/30">
          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-4">
            <Edit3 className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs font-black uppercase text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full py-0.5" 
              placeholder="Note Title"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-400 font-mono hidden sm:inline">
              {autosaveStatus}
            </span>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 rounded-xl transition-all shadow-soft cursor-pointer"
            >
              {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </button>

            <button
              onClick={executeSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-[10px] font-bold text-white rounded-xl transition-all shadow-glow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Input Details */}
        <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/20 flex gap-4 shrink-0">
          <div className="flex-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Topic</span>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-[10px] text-slate-700 font-semibold focus:outline-none bg-transparent"
              placeholder="Biology Mitochondria"
            />
          </div>
          <div className="flex-1 border-l border-slate-100 pl-4">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Category</span>
            <input 
              type="text" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-[10px] text-slate-700 font-semibold focus:outline-none bg-transparent"
              placeholder="Programming"
            />
          </div>
        </div>

        {/* Formatting Toolbar */}
        {!previewMode && (
          <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <button onClick={() => insertFormatting('bold')} title="Bold" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
              <button onClick={() => insertFormatting('italic')} title="Italic" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
              <button onClick={() => insertFormatting('heading')} title="Header" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 cursor-pointer"><Heading className="w-3.5 h-3.5" /></button>
              <button onClick={() => insertFormatting('list')} title="Bullet List" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 cursor-pointer"><List className="w-3.5 h-3.5" /></button>
              <button onClick={() => insertFormatting('code')} title="Code block" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 cursor-pointer"><Code className="w-3.5 h-3.5" /></button>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button onClick={undo} disabled={historyIndex === 0} title="Undo" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 disabled:opacity-40 cursor-pointer"><Undo2 className="w-3.5 h-3.5" /></button>
              <button onClick={redo} disabled={historyIndex === history.length - 1} title="Redo" className="p-1 hover:bg-slate-200/50 rounded text-slate-500 disabled:opacity-40 cursor-pointer"><Redo2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}

        {/* Core Editor Viewport / Previewer */}
        <div className="flex-1 overflow-hidden relative bg-slate-50/5">
          {previewMode ? (
            <div className="w-full h-full p-6 md:p-8 overflow-y-auto prose prose-slate text-xs font-semibold leading-relaxed text-slate-600 font-sans">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({ node, ...props }) => <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 mt-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                  code: ({ node, inline, children, ...props }) => (
                    <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-extrabold text-[10px]" {...props}>
                      {children}
                    </code>
                  )
                }}
              >
                {content || '*No content generated. Start typing markdown text here...*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Draft your note configurations here using Markdown formatting..."
              className="w-full h-full p-6 focus:outline-none resize-none text-xs font-semibold leading-relaxed text-slate-700 bg-transparent font-sans"
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default NoteEditor;
