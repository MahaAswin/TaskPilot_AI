import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download, ChevronDown, Check, Clipboard } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const CreativeToolbar = ({ zoom, onZoomChange, isFullscreen, onToggleFullscreen, onExport }) => {
  const { showSuccess } = useToast();
  const [showExportOptions, setShowExportOptions] = useState(false);

  const exportFormats = [
    { label: 'Portable Network Graphics (.png)', format: 'png' },
    { label: 'Joint Photographic Group (.jpg)', format: 'jpg' },
    { label: 'Scalable Vector Graphics (.svg)', format: 'svg' },
    { label: 'Document Format (.pdf)', format: 'pdf' }
  ];

  const handleExport = (format) => {
    onExport(format);
    setShowExportOptions(false);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border border-slate-200 bg-white rounded-xl shadow-soft select-none shrink-0 z-10 relative">
      
      {/* Zoom sliders */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => onZoomChange(Math.max(50, zoom - 10))}
          className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-black text-slate-400 font-mono w-10 text-center">{zoom}%</span>
        <button 
          onClick={() => onZoomChange(Math.min(150, zoom + 10))}
          className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Export & fullscreen actions */}
      <div className="flex items-center gap-2">
        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 rounded-xl transition-all shadow-soft cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Graphic</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showExportOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExportOptions(false)} />
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5">
                <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1.5">
                  Select Format
                </div>
                {exportFormats.map(item => (
                  <button
                    key={item.format}
                    onClick={() => handleExport(item.format)}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

    </div>
  );
};

export default CreativeToolbar;
