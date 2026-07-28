import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Map, Filter, RefreshCw } from 'lucide-react';

export const AgentToolbar = ({ 
  zoomLevel = 100, 
  setZoomLevel, 
  showMiniMap, 
  setShowMiniMap 
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-soft flex items-center justify-between gap-3 select-none text-xs">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[10px] font-bold text-slate-500 w-10 text-center">
          {zoomLevel}%
        </span>

        <button
          onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setZoomLevel(100)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer ml-1"
          title="Reset Zoom"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMiniMap(!showMiniMap)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
            showMiniMap ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <Map className="w-3 h-3" />
          <span>Mini-Map</span>
        </button>
      </div>
    </div>
  );
};

export default AgentToolbar;
