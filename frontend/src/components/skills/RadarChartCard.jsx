import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass } from 'lucide-react';
import { RADAR_DATA } from '../../constants/skillMockData';

export const RadarChartCard = () => {
  // SVG Radar Chart math calculations for 6 axes
  const center = 120;
  const radius = 85;
  const numAxes = RADAR_DATA.length;

  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate SVG polygon points for actual score vs target score
  const scorePoints = RADAR_DATA.map((d, i) => {
    const { x, y } = getCoordinates(i, d.score);
    return `${x},${y}`;
  }).join(' ');

  const targetPoints = RADAR_DATA.map((d, i) => {
    const { x, y } = getCoordinates(i, d.target);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Multi-Domain Skill Radar Balance</span>
        </h4>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-indigo-600"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Current</span>
          <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Target</span>
        </div>
      </div>

      {/* SVG Radar Chart Graphic */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-2">
        <div className="relative">
          <svg width={center * 2} height={center * 2} className="overflow-visible">
            {/* Concentric Grid circles */}
            {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius * scale}
                fill="none"
                stroke="#e2e8f0"
                strokeDasharray="2 2"
              />
            ))}

            {/* Radar Spokes */}
            {RADAR_DATA.map((_, i) => {
              const { x, y } = getCoordinates(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              );
            })}

            {/* Target Polygon */}
            <polygon
              points={targetPoints}
              fill="rgba(148, 163, 184, 0.15)"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Score Polygon with SVG animation */}
            <motion.polygon
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              points={scorePoints}
              fill="rgba(79, 70, 229, 0.25)"
              stroke="#4f46e5"
              strokeWidth="2.5"
            />

            {/* Axis Label Placement */}
            {RADAR_DATA.map((d, i) => {
              const { x, y } = getCoordinates(i, 115);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[9px] font-bold fill-slate-700 font-sans"
                >
                  {d.domain}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend Ratings */}
        <div className="space-y-2 text-xs font-mono">
          {RADAR_DATA.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-6 p-2 bg-slate-50 rounded-xl border border-slate-200/50">
              <span className="font-bold text-slate-700">{d.domain}</span>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-extrabold">{d.score}%</span>
                <span className="text-slate-400 text-[10px]">/ {d.target}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarChartCard;
