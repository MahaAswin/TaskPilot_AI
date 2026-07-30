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
    <div className="p-5 border border-white/10 bg-[#1B1E25] rounded-2xl shadow-2xl space-y-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-[10px] font-black text-white uppercase tracking-wider">Document Upload Studio</span>
        
        {/* OCR toggle placeholder */}
        <button
          type="button"
          onClick={() => setIsOCRActive(!isOCRActive)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer ${
            isOCRActive
              ? 'bg-[rgba(232,180,93,0.14)] border-[#E8B45D]/30 text-[#E8B45D]'
              : 'bg-[#242832] border-white/10 text-[#868C99]'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>OCR Scanning</span>
        </button>
      </div>

      {/* Box zone */}
      <label className="border-2 border-dashed border-white/10 hover:border-[#E8B45D]/60 bg-[#242832] hover:bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
        <input 
          type="file" 
          onChange={handleFileChange}
          className="hidden" 
          accept=".pdf,.docx,.txt,image/*" 
        />
        <UploadCloud className="w-8 h-8 text-[#868C99] group-hover:text-[#E8B45D] transition-colors mb-2" />
        <span className="text-[11px] font-bold text-[#ECEAE3]">Click to upload doc</span>
        <span className="text-[9px] text-[#868C99] mt-1 font-semibold">Supports PDF, DOCX, TXT up to 10MB</span>
      </label>

      {/* Info indicator */}
      <div className="flex gap-2 p-2.5 bg-[rgba(232,180,93,0.14)] border border-[#E8B45D]/30 rounded-xl text-[9px] text-[#E8B45D] leading-normal font-semibold">
        <HelpCircle className="w-4 h-4 shrink-0 text-[#E8B45D] mt-0.5" />
        <p>OCR scanning automatically reads structural headings, notes, tables, and exercises from PDFs.</p>
      </div>
    </div>
  );
};

export default UploadZone;
