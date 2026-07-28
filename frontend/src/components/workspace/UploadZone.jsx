import React, { useState } from 'react';
import { UploadCloud, Eye, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const UploadZone = ({ onFileSelected }) => {
  const [isOCRActive, setIsOCRActive] = useState(true);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="p-5 border border-slate-200 bg-white rounded-2xl shadow-soft space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Upload Studio</span>
        
        {/* OCR toggle placeholder */}
        <button
          type="button"
          onClick={() => setIsOCRActive(!isOCRActive)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer ${
            isOCRActive
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>OCR Scanning</span>
        </button>
      </div>

      {/* Box zone */}
      <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400/60 bg-slate-50/50 hover:bg-indigo-50/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
        <input 
          type="file" 
          onChange={handleFileChange}
          className="hidden" 
          accept=".pdf,.docx,.txt,image/*" 
        />
        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
        <span className="text-[11px] font-bold text-slate-700">Click to upload doc</span>
        <span className="text-[9px] text-slate-400 mt-1 font-semibold">Supports PDF, DOCX, TXT up to 10MB</span>
      </label>

      {/* Info indicator */}
      <div className="flex gap-2 p-2.5 bg-indigo-50/50 border border-indigo-100/40 rounded-xl text-[9px] text-indigo-700 leading-normal font-semibold">
        <HelpCircle className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
        <p>OCR scanning automatically reads structural headings, notes, tables, and exercises from PDFs.</p>
      </div>
    </div>
  );
};

export default UploadZone;
