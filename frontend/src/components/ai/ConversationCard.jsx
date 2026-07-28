import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const ConversationCard = ({ messages = [] }) => {
  const { showSuccess } = useToast();
  const [copiedIdx, setCopiedIdx] = React.useState(null);

  const handleCopy = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    showSuccess('Message copied to clipboard.');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-3 select-none">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-3xl border flex items-start gap-3 transition-all ${
              isUser
                ? 'bg-slate-50 border-slate-200/80 ml-8'
                : 'bg-white border-indigo-100 shadow-soft mr-8'
            }`}
          >
            <div className={`p-2 rounded-2xl shrink-0 ${
              isUser ? 'bg-slate-200 text-slate-700' : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
            }`}>
              {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {isUser ? 'User Request' : 'Unified AI Response'}
                </span>
                <button
                  onClick={() => handleCopy(msg.content, idx)}
                  className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                  title="Copy text"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ConversationCard;
