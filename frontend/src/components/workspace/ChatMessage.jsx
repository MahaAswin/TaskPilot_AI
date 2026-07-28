import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Cpu, User, Clipboard, Check, Image, Network, Layers, BarChart } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const ChatMessage = ({ message }) => {
  const { showSuccess } = useToast();
  const isAssistant = message.sender === 'assistant';

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    showSuccess('Code copied to clipboard!');
  };

  // Inline visualization indicators custom renderer
  const renderVisualPlaceholders = (content) => {
    const lower = content.toLowerCase();
    if (lower.includes('water cycle') || lower.includes('flowchart')) {
      return (
        <div className="mt-4 p-4 border border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wide">
            <Network className="w-4.5 h-4.5 animate-pulse" />
            <span>Flowchart Visualization: Water Cycle</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center py-4 font-mono text-[9px] font-semibold text-slate-500">
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">Evaporation</div>
            <span className="text-indigo-400">➔</span>
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">Condensation</div>
            <span className="text-indigo-400">➔</span>
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">Precipitation</div>
          </div>
        </div>
      );
    }
    if (lower.includes('mindmap') || lower.includes('mind map')) {
      return (
        <div className="mt-4 p-4 border border-dashed border-purple-200 bg-purple-50/40 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wide">
            <Layers className="w-4.5 h-4.5 animate-pulse" />
            <span>Mind Map Schema: Concept Hierarchy</span>
          </div>
          <div className="py-4 flex justify-center">
            <div className="relative border border-slate-200 bg-white p-3 rounded-lg shadow-sm text-center text-[10px] font-bold text-slate-800">
              Mitochondria Matrix
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-purple-400 font-bold">⬇</div>
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-purple-400 font-bold">⬅</div>
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-purple-400 font-bold">➡</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex gap-4 w-full max-w-3xl mx-auto py-5 border-b border-slate-100 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      
      {/* Sender Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-soft border ${
        isAssistant 
          ? 'bg-indigo-50 border-indigo-200/50 text-indigo-600' 
          : 'bg-slate-100 border-slate-200 text-slate-800'
      }`}>
        {isAssistant ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message content block */}
      <div className="flex-1 space-y-2 overflow-hidden px-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>{isAssistant ? 'TaskPilot Agent' : 'You'}</span>
          <span>•</span>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className={`prose prose-slate max-w-full text-xs font-medium leading-relaxed text-slate-600 ${
          isAssistant ? 'font-sans' : 'bg-slate-100/50 px-4 py-3 rounded-2xl border border-slate-200/40 text-slate-800 font-sans'
        }`}>
          {isAssistant ? (
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
                tr: ({ node, ...props }) => <tr {...props} />,
                th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-[10px] font-extrabold text-slate-700 uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-2 text-[10px] text-slate-500 font-semibold border-t border-slate-100" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 mt-4" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="marker:text-indigo-500" {...props} />,
                pre: ({ node, ...props }) => <pre className="p-0 bg-transparent" {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeStr = String(children).replace(/\n$/, '');
                  return !inline ? (
                    <div className="my-4 border border-slate-200 rounded-xl overflow-hidden shadow-soft">
                      <div className="bg-slate-50 px-4 py-1.5 flex items-center justify-between border-b border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        <span>{match ? match[1] : 'code'}</span>
                        <button 
                          onClick={() => copyCode(codeStr)}
                          className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
                        >
                          <Clipboard className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <code className="block p-4 overflow-x-auto text-[10px] bg-slate-950 text-slate-150 font-mono" {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Render diagrams mockup preview in chat stream */}
          {isAssistant && renderVisualPlaceholders(message.content)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
