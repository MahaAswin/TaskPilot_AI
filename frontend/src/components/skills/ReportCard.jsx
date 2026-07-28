import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle2, FileCode, FileSpreadsheet } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const ReportCard = ({ reportData }) => {
  const { showSuccess } = useToast();
  const [activeReportTab, setActiveReportTab] = useState('weekly');

  const reports = {
    weekly: {
      title: 'Weekly Skill Improvement Snapshot',
      period: 'July 21 – July 28, 2026',
      summary: reportData?.weeklyReport || 'Overall skill score increased by +6.2% over the last 7 days. High growth recorded in SQL Indexing (+8%) and React Architecture (+10%).',
      highlights: [
        'Mastered 4 new topics in Database Systems',
        'Attempted 14 quizzes with 88% average accuracy',
        'Logged 18 hours of dedicated study time'
      ]
    },
    monthly: {
      title: 'Monthly Skill Mastery Report',
      period: 'July 2026',
      summary: reportData?.monthlyReport || 'Completed 2 major skill milestones. React mastery advanced from Expert to Elite (92%).',
      highlights: [
        'Mastered 16 total topics across 6 domains',
        'Completed 45 LeetCode coding problems',
        'Maintained a 21-day learning streak'
      ]
    },
    overall: {
      title: 'Comprehensive Skill Profile Report',
      period: 'Year-to-Date 2026',
      summary: reportData?.overallReport || 'Global Skill Rank: Master (Top 5% Learner). Strongest skills: React, SQL Databases, Java.',
      highlights: [
        'Total learning hours logged: 142 hours',
        '10 evaluated technology domains',
        '92% overall completion velocity'
      ]
    }
  };

  const currentReport = reports[activeReportTab] || reports.weekly;

  const handleExport = (format) => {
    showSuccess(`Report exported as ${format.toUpperCase()} (Placeholder download ready).`);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-5 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Progress Reports & Export Generator</span>
          </h3>
          <p className="text-[10px] text-slate-400">Generate executive skill evaluation reports for academic or enterprise reviews.</p>
        </div>

        {/* Report Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          {['weekly', 'monthly', 'overall'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveReportTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                activeReportTab === tab
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab} Report
            </button>
          ))}
        </div>
      </div>

      {/* Active Report View */}
      <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{currentReport.title}</h4>
            <span className="text-[10px] font-mono text-slate-400">Period: {currentReport.period}</span>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-mono font-bold">
            Verified Report
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentReport.summary}</p>

        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Key Growth Highlights</span>
          <div className="space-y-1.5">
            {currentReport.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-3">
        <span className="text-[10px] font-mono text-slate-400">Export Report Format:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('docx')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>DOCX</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('markdown')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/60"
          >
            <FileCode className="w-3.5 h-3.5 text-purple-500" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ReportCard;
