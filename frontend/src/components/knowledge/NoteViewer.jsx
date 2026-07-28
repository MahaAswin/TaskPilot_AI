import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  X, Clipboard, Download, BookOpen, AlertCircle, FileText, Check, 
  HelpCircle, Calendar, Printer, Share2, Compass, Network, Award
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const NoteViewer = ({ note, onClose, onExport, onEdit }) => {
  const { showSuccess } = useToast();
  const [showExportOptions, setShowExportOptions] = useState(false);

  const copyNoteContent = () => {
    navigator.clipboard.writeText(note.content);
    showSuccess('Note content copied to clipboard!');
  };

  const handleExport = (format) => {
    onExport(note._id, format);
    setShowExportOptions(false);
  };

  const triggerPrint = () => {
    window.print();
  };

  const renderCallouts = (content) => {
    const lines = content.split('\n');
    const matched = lines.some(l => l.includes('>[!NOTE]') || l.includes('>[!IMPORTANT]') || l.includes('>[!WARNING]'));
    if (!matched) return null;

    return (
      <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-indigo-700">
        <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-[10px] leading-normal font-semibold">
          Study Reminder: Oxidative phosphorylation yields 32-34 ATP. Study matrices structures during active hours.
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm" onClick={onClose} />

      {/* Viewer Box */}
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl h-[85vh] flex flex-col z-10 overflow-hidden animate-fade-in select-none">
        
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/30">
          <div className="flex items-center gap-2 overflow-hidden">
            <BookOpen className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider truncate max-w-sm">
              {note.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(note)}
                title="Edit Note"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100/50 text-[10px] font-bold text-indigo-600 rounded-xl transition-all shadow-soft cursor-pointer"
              >
                <span>Edit</span>
              </button>
            )}

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 rounded-xl transition-all shadow-soft cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {showExportOptions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportOptions(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1">
                    {['pdf', 'docx', 'md', 'txt'].map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => handleExport(fmt)}
                        className="w-full text-left px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors capitalize cursor-pointer"
                      >
                        {fmt === 'md' ? 'Markdown (.md)' : `${fmt.toUpperCase()} Document`}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={copyNoteContent}
              title="Copy to Clipboard"
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Clipboard className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={triggerPrint}
              title="Print"
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-slate-200 bg-slate-50/50 rounded-xl text-left">
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Subject Topic</span>
              <span className="text-[10px] font-bold text-slate-700">{note.topic}</span>
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Category</span>
              <span className="text-[10px] font-bold text-slate-700">{note.category}</span>
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Difficulty</span>
              <span className="text-[10px] font-bold text-slate-700 capitalize">{note.difficulty}</span>
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Created Date</span>
              <span className="text-[10px] font-bold text-slate-700 font-mono">
                {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Markdown Content Parser */}
          <div className="prose prose-slate max-w-full text-xs font-semibold leading-relaxed text-slate-600 font-sans">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="my-4 overflow-x-auto border border-slate-200 rounded-xl shadow-soft">
                    <table className="min-w-full divide-y divide-slate-200" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-slate-50/50" {...props} />,
                tbody: ({ node, ...props }) => <tbody className="divide-y divide-slate-100 bg-white" {...props} />,
                th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-[10px] font-black text-slate-700 uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-2 text-[10px] text-slate-550 border-t border-slate-100" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 mt-4" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
                  return !inline ? (
                    <div className="my-3 border border-slate-200 rounded-xl overflow-hidden shadow-soft font-mono text-[9px] bg-slate-950 text-slate-200 p-4">
                      <code {...props}>{children}</code>
                    </div>
                  ) : (
                    <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-extrabold text-[10px]" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {note.content}
            </ReactMarkdown>

            {/* Custom GFM callouts render placeholders */}
            {renderCallouts(note.content)}
          </div>

          {/* Future Diagrams placeholders */}
          <div className="border border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center space-y-2">
            <Compass className="w-6 h-6 text-slate-400 animate-pulse" />
            <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Interactive Canvas Placeholders</h5>
            <p className="text-[9px] text-slate-400 max-w-sm leading-normal font-semibold">
              Future mindmaps, infographics, and generated flowcharts from the Creative Agent will compile and hook directly here.
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400 shrink-0 font-mono font-bold">
          <span>Note Status: {note.status.toUpperCase()}</span>
          <span>Workspace Ref: {note.topic}</span>
        </div>

      </div>
    </div>
  );
};

export default NoteViewer;
