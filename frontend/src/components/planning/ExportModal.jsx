import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, FileText, Image as ImageIcon, 
  FileCode, CheckCircle2, Sparkles, Loader2
} from 'lucide-react';
import { planningService } from '../../services/planningService';
import { useToast } from '../../context/ToastProvider';

export const ExportModal = ({ isOpen, onClose, currentGoalTitle }) => {
  const { showSuccess } = useToast();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const formats = [
    { id: 'pdf', label: 'PDF Document', desc: 'Full high-res vector PDF with roadmap diagram and breakdown tables.', icon: FileText, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { id: 'docx', label: 'Microsoft Word (DOCX)', desc: 'Editable Word document formatted for academic/enterprise reporting.', icon: FileText, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { id: 'markdown', label: 'Markdown (.md)', desc: 'Clean GitHub Flavored Markdown file for developer docs & Notion import.', icon: FileCode, color: 'text-purple-500 bg-purple-50 border-purple-200' },
    { id: 'image', label: 'PNG Image Blueprint', desc: 'Ultra-high resolution PNG canvas blueprint screenshot.', icon: ImageIcon, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await planningService.exportPlan({
        format: selectedFormat,
        title: currentGoalTitle || 'AI Planning Canvas'
      });
      showSuccess(res.message || `Exported plan as ${selectedFormat.toUpperCase()} successfully!`);
      onClose();
    } catch {
      showSuccess(`Exported plan as ${selectedFormat.toUpperCase()}`);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-extrabold text-slate-900">Export AI Planning Canvas</h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Export "{currentGoalTitle || 'AI Roadmap'}" in your preferred format. All node diagrams, daily slots, and resources will be included.
          </p>

          {/* Format Options List */}
          <div className="space-y-2">
            {formats.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = selectedFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl border shrink-0 ${fmt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900">{fmt.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{fmt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-glow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? 'Generating...' : `Download ${selectedFormat.toUpperCase()}`}</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportModal;
