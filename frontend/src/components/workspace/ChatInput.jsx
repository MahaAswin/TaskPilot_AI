import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, StopCircle, Loader2, File, X, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const ChatInput = ({ onSendMessage, onUploadFile, isLoading }) => {
  const { showError, showSuccess } = useToast();
  const [text, setText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isLoading || isUploading) return;

    if (!text.trim() && !attachedFile) return;

    onSendMessage(text, attachedFile);
    setText('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const selectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setIsUploading(true);
    try {
      // Simulate file check upload API
      await onUploadFile(file);
      setAttachedFile(file);
      showSuccess(`Attachment ${file.name} successfully uploaded.`);
    } catch (err) {
      showError(err.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      
      {/* Attached file status banner */}
      {attachedFile && (
        <div className="mb-2 p-2 border border-[#E8B45D]/30 bg-[rgba(232,180,93,0.14)] rounded-xl flex items-center justify-between animate-fade-in max-w-sm">
          <div className="flex items-center gap-2 text-[10px] text-[#E8B45D] font-bold">
            <File className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{attachedFile.name}</span>
          </div>
          <button 
            onClick={() => setAttachedFile(null)}
            className="p-0.5 text-[#868C99] hover:text-[#ECEAE3] hover:bg-white/5 rounded-lg cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating container */}
      <form 
        onSubmit={handleSubmit}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border rounded-2xl bg-[#1B1E25] shadow-2xl transition-all duration-300 ${
          dragActive 
            ? 'border-[#E8B45D] ring-4 ring-[#E8B45D]/5' 
            : 'border-white/10 hover:border-[#E8B45D]/30 focus-within:border-[#E8B45D]/50 focus-within:ring-4 focus-within:ring-[#E8B45D]/5'
        }`}
      >
        {/* Drag Overlay visual shield */}
        {dragActive && (
          <div className="absolute inset-0 bg-[rgba(232,180,93,0.9)] rounded-2xl flex items-center justify-center border-2 border-dashed border-[#E8B45D] z-10 text-xs font-bold text-[#14161B] uppercase tracking-wider gap-2">
            <Sparkles className="w-4 h-4 animate-bounce" />
            <span>Drop file here to upload (PDF, Image, Text)</span>
          </div>
        )}

        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "AI Agent is compiling results..." : "Ask TaskPilot Co-Pilot... (Press Enter to submit)"}
          disabled={isLoading || isUploading}
          className="w-full pl-4 pr-24 py-3 bg-transparent resize-none text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none leading-relaxed font-semibold"
        />

        {/* Input Tools panel */}
        <div className="absolute right-3.5 bottom-3 flex items-center gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={selectFile} 
            className="hidden" 
            accept=".pdf,.docx,.txt,image/*" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading || isUploading}
            title="Attach File"
            className="p-1.5 text-[#868C99] hover:text-[#ECEAE3] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8B45D]" /> : <Paperclip className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => alert('Voice input is locked in scaffolding.')}
            title="Voice input"
            className="p-1.5 text-[#868C99] hover:text-[#ECEAE3] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          {isLoading ? (
            <button
              type="button"
              title="Stop Generation"
              className="p-1.5 bg-[#E2836A]/20 text-[#E2836A] rounded-lg shrink-0 cursor-pointer"
            >
              <StopCircle className="w-4 h-4 animate-pulse" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!text.trim() && !attachedFile}
              className="p-2 bg-[#E8B45D] hover:bg-[#D4A253] disabled:opacity-40 text-[#14161B] rounded-xl shadow-2xl transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#14161B]" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
