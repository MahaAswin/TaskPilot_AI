import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Clock, Calendar, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const RiskCard = ({ risks = [] }) => {
  const defaultRisks = risks.length > 0 ? risks : [
    { id: 'rk-1', title: 'Weak Topic: Dynamic Programming 2D', severity: 'High', category: 'Weak Topics', mitigation: 'Dedicate 1 hour daily exclusively to grid DP memoization patterns.' },
    { id: 'rk-2', title: 'Pending Tasks: 45 Unsolved Graph Problems', severity: 'Medium', category: 'Pending Tasks', mitigation: 'Group problems by BFS/DFS pattern rather than random solving.' },
    { id: 'rk-3', title: 'Time Constraint: 14 Days Remaining for Phase 2', severity: 'High', category: 'Time Constraints', mitigation: 'Increase daily focus blocks from 4 hours to 6 hours.' },
    { id: 'rk-4', title: 'Upcoming Deadline: Campus Online Assessment in 10 Days', severity: 'Critical', category: 'Upcoming Deadlines', mitigation: 'Complete company previous year tagged questions on LeetCode.' }
  ];

  const severityColors = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Critical: 'bg-red-100 text-red-800 border-red-300 animate-pulse'
  };

  const categoryIcons = {
    'Weak Topics': ShieldAlert,
    'Pending Tasks': Clock,
    'Time Constraints': AlertTriangle,
    'Upcoming Deadlines': Calendar
  };

  return (
    <section id="sec-risks" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>AI Risk & Bottleneck Analysis</span>
          </h3>
          <p className="text-xs text-slate-500">Identified weak topics, time constraints, pending backlogs, and AI predictive mitigations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Risk Items Cards */}
        {defaultRisks.map((risk) => {
          const Icon = categoryIcons[risk.category] || AlertTriangle;
          return (
            <motion.div
              key={risk.id}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded-full border border-slate-200">
                    <Icon className="w-3 h-3 text-slate-500" />
                    {risk.category}
                  </span>

                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${severityColors[risk.severity] || severityColors.Medium}`}>
                    {risk.severity} Severity
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900">{risk.title}</h4>
              </div>

              {/* Mitigation Strategy */}
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-600 block tracking-wider">Mitigation Plan:</span>
                <p className="text-[11px] text-slate-700 leading-snug">{risk.mitigation}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Future AI Risk Predictor Placeholder Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-white/10 text-cyan-300 text-[10px] font-black uppercase rounded-full border border-cyan-400/30">
                <Sparkles className="w-3 h-3" />
                AI Risk Agent Placeholder
              </span>
            </div>

            <h4 className="text-xs font-extrabold text-white">Predictive AI Risk Monitor</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Future AI will continuously analyze your weekly completion rate, quiz scores, and burnout metrics to auto-rebalance deadlines.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-mono text-cyan-400">Ready for Future AI Engine</span>
            <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 rounded-xl text-[10px] font-bold">
              Placeholder Mode
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RiskCard;
