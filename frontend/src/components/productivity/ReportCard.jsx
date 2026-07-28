import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle2, FileCode, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';
import { DAILY_REPORT, WEEKLY_REPORT, MONTHLY_REPORT } from '../../constants/productivityMockData';

export const ReportCard = () => {
  const { showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState('daily');

  const handleExport = (format) => {
    showSuccess(`Productivity report exported as ${format.toUpperCase()} (Placeholder ready).`);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-5 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Productivity Coach Reports Engine</span>
          </h3>
          <p className="text-[10px] text-slate-400">Automated performance reports synthesized across Task, Learning & Skill Agents.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab} Report
            </button>
          ))}
        </div>
      </div>

      {/* DAILY REPORT */}
      {activeTab === 'daily' && (
        <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Daily Productivity Summary</h4>
              <span className="text-[10px] font-mono text-slate-400">Date: {DAILY_REPORT.date}</span>
            </div>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-mono font-bold">
              +{DAILY_REPORT.xpEarned} XP Earned
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Tasks Completed</span>
              <span className="font-bold text-slate-800">{DAILY_REPORT.tasksCompleted} Tasks</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Focus Time</span>
              <span className="font-bold text-amber-600">{DAILY_REPORT.focusTime}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Study Time</span>
              <span className="font-bold text-slate-800">{DAILY_REPORT.studyTime}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Badges Unlocked</span>
              <span className="font-bold text-emerald-600">{DAILY_REPORT.achievements.length} Badges</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Daily Highlights</span>
            {DAILY_REPORT.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-800">
            <span className="font-bold block mb-0.5">Areas for Improvement:</span>
            <span>{DAILY_REPORT.areasForImprovement}</span>
          </div>
        </div>
      )}

      {/* WEEKLY REPORT */}
      {activeTab === 'weekly' && (
        <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Weekly Performance Index</h4>
              <span className="text-[10px] font-mono text-slate-400">{WEEKLY_REPORT.period}</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-mono font-bold">
              {WEEKLY_REPORT.weeklyProductivity}% Score
            </span>
          </div>

          <p className="text-xs text-slate-700 font-medium">{WEEKLY_REPORT.summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Weekly Learning</span>
              <span className="font-bold text-slate-800">{WEEKLY_REPORT.weeklyLearning}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Skill Growth</span>
              <span className="font-bold text-emerald-600">{WEEKLY_REPORT.skillImprovement}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Task Completion</span>
              <span className="font-bold text-indigo-600">{WEEKLY_REPORT.taskCompletion}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Habit Consistency</span>
              <span className="font-bold text-amber-600">{WEEKLY_REPORT.habitConsistency}</span>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY REPORT */}
      {activeTab === 'monthly' && (
        <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Monthly Achievement Overview</h4>
              <span className="text-[10px] font-mono text-slate-400">{MONTHLY_REPORT.period}</span>
            </div>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[9px] font-mono font-bold">
              {MONTHLY_REPORT.goalsCompleted} Goals Achieved
            </span>
          </div>

          <p className="text-xs text-slate-700 font-medium">{MONTHLY_REPORT.monthlySummary}</p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Hours Invested</span>
              <span className="font-bold text-slate-800 text-sm">{MONTHLY_REPORT.hoursInvested} Total Hours</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/60">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Achievements Unlocked</span>
              <span className="font-bold text-purple-600 text-sm">{MONTHLY_REPORT.achievementsUnlocked} Badges</span>
            </div>
          </div>
        </div>
      )}

      {/* Export Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-3">
        <span className="text-[10px] font-mono text-slate-400">Export Report Format:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60">
            <FileText className="w-3.5 h-3.5 text-rose-500" /> PDF
          </button>
          <button onClick={() => handleExport('docx')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60">
            <FileText className="w-3.5 h-3.5 text-blue-500" /> DOCX
          </button>
          <button onClick={() => handleExport('csv')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> CSV
          </button>
          <button onClick={() => handleExport('markdown')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60">
            <FileCode className="w-3.5 h-3.5 text-purple-500" /> Markdown
          </button>
        </div>
      </div>

    </div>
  );
};

export default ReportCard;
