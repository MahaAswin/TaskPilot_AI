import React from 'react';
import { motion } from 'framer-motion';
import { 
  ZoomIn, ZoomOut, Maximize2, Grid, LayoutGrid, 
  Clock, ListChecks, Eye, Sparkles
} from 'lucide-react';

export const CanvasToolbar = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  activeView,
  setActiveView,
  showGrid,
  setShowGrid
}) => {
  const views = [
    { id: 'all', label: 'Full Canvas', icon: LayoutGrid },
    { id: 'nodes', label: 'Node Graph', icon: Sparkles },
    { id: 'timeline', label: 'Timeline View', icon: Clock },
    { id: 'breakdown', label: 'Weekly & Daily', icon: ListChecks }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-soft select-none mb-6">
      
      {/* View Selector Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = activeView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar Controls Right */}
      <div className="flex items-center gap-2">
        {/* Toggle Grid Overlay */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            showGrid
              ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Canvas Grid Pattern"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Grid</span>
        </button>

        {/* Zoom Controls Group */}
        <div className="flex items-center bg-slate-100/80 rounded-xl p-0.5 border border-slate-200/60 text-slate-600">
          <button
            onClick={onZoomOut}
            className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-700 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onZoomReset}
            className="px-2 py-1 text-[10px] font-mono font-bold hover:bg-white rounded-lg transition-colors text-slate-700 cursor-pointer"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-700 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onZoomReset}
          className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl transition-all cursor-pointer"
          title="Fit Canvas to Screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export default CanvasToolbar;
