import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, Copy, RefreshCw, 
  Trash2, BarChart2, Award, Zap, BookOpen, ShieldCheck, Mail, Sliders, Check, TrendingUp, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageContainer from '../../components/common/PageContainer';
import { emailCoachService } from '../../services/emailCoachService';

export const EmailCoach = () => {
  const [subject, setSubject] = useState('');
  const [emailText, setEmailText] = useState(
    'Dear Hiring Manager,\n\nI am writing to apply for the Senior Software Engineer position. I am interested for this role because I wanna contribute to your team. The project was completed by me yesterday. Please reply back ASAP if you have any questions.\n\nThanks,\nJohn'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load history & initial analysis on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const pastStats = await emailCoachService.getStats();
      const pastHistory = await emailCoachService.getHistory();
      setStats(pastStats);
      setHistory(pastHistory);
    } catch (e) {
      console.warn('Initial data load error:', e);
    }
  };

  const handleAnalyze = async () => {
    if (!emailText.trim()) {
      toast.error('Please enter or paste an email before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading('Analyzing email with LanguageTool & AI Coach...');

    try {
      const data = await emailCoachService.analyzeEmail({ text: emailText, subject });
      setAnalysisResult(data);

      if (data?.stats) setStats(data.stats);
      if (data?.report) {
        setHistory(prev => [data.report, ...prev.filter(h => h._id !== data.report._id)]);
      }

      toast.success('Email Quality Analysis Complete!', { id: toastId });
    } catch (error) {
      toast.error(error.message || 'Analysis failed. Please try again.', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setEmailText('');
    setSubject('');
    setAnalysisResult(null);
    toast.success('Cleared email input.');
  };

  const handleCopyCorrected = () => {
    if (!report?.correctedText) {
      toast.error('No corrected email available to copy.');
      return;
    }
    navigator.clipboard.writeText(report.correctedText);
    setCopied(true);
    toast.success('Corrected email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const report = analysisResult?.report;
  const comparison = analysisResult?.comparison;

  // Filter issues by tab
  const getFilteredIssues = () => {
    if (!report?.issues) return [];
    if (activeTab === 'grammar') {
      return report.issues.filter(i => i.type.includes('Grammar') || i.type.includes('Spelling') || i.type.includes('Preposition'));
    }
    if (activeTab === 'tone') {
      return report.issues.filter(i => i.type.includes('Informal') || i.type.includes('Passive'));
    }
    if (activeTab === 'structure') {
      return report.issues.filter(i => i.type.includes('Sentence') || i.type.includes('Long'));
    }
    if (activeTab === 'formatting') {
      return report.issues.filter(i => i.type.includes('Formatting') || i.type.includes('Punctuation') || i.type.includes('Capitalization'));
    }
    return report.issues;
  };

  // Helper for score category color
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Excellent':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'Good':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'Fair':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      default:
        return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
    }
  };

  const getStarRating = (stars) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <PageContainer>
      {/* Top Header Card */}
      <div className="bg-[#1B1E25] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(232,180,93,0.14)] border border-[#E8B45D]/30 text-[#E8B45D] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI EMAIL WRITING COACH
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ECEAE3] flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#E8B45D]" />
            <span>AI Email Writing Coach</span>
          </h1>
          <p className="text-[#C6C9D1] text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
            Inspect emails with LanguageTool API + AI to score writing quality, fix grammar errors, detect tone, and get mistake-based improvement tips.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          {comparison && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="btn-secondary px-4 py-2 text-xs flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-[#E8B45D]" />
              <span>Compare Previous</span>
            </button>
          )}
          <div className="px-4 py-2 rounded-xl bg-[#242832] border border-white/10 text-xs font-mono text-[#C6C9D1]">
            Stats: <span className="text-[#57B5A8] font-bold">{stats?.totalEmailsAnalyzed || 0} Analyzed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Email Text Editor (5 Cols) - Dark Work Surface */}
        <div className="lg:col-span-5 space-y-6">
          <div className="dark-work-surface p-6 flex flex-col h-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold tracking-wider text-[#ECEAE3] uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#E8B45D]" /> Email Input Editor
              </span>
              <span className="text-[11px] font-mono text-[#E8B45D] font-bold">
                {emailText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <div className="space-y-4 my-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-[#C6C9D1] mb-1">Subject (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Developer Application - John Doe"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#242832] border border-white/10 text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:border-[#E8B45D]"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-[300px]">
                <label className="block text-xs font-semibold text-[#C6C9D1] mb-1">Email Body Text</label>
                <textarea
                  placeholder="Paste or compose your email here..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={14}
                  className="w-full flex-1 p-4 rounded-xl bg-[#242832] border border-white/10 text-xs font-mono text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:border-[#E8B45D] leading-relaxed resize-none transition"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !emailText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] font-extrabold text-xs shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#14161B]" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#14161B]" />
                      <span>Analyze Email</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClear}
                  className="p-2.5 rounded-xl bg-[#242832] hover:bg-white/10 text-[#868C99] hover:text-[#ECEAE3] border border-white/10 text-xs transition"
                  title="Clear text"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {report?.correctedText && (
                <button
                  onClick={handleCopyCorrected}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[rgba(87,181,168,0.14)] hover:bg-[#57B5A8]/25 text-[#57B5A8] border border-[#57B5A8]/30 text-xs font-extrabold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#57B5A8]" /> : <Copy className="w-3.5 h-3.5 text-[#57B5A8]" />}
                  <span>{copied ? 'Copied' : 'Copy Corrected Email'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Report & Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {!report ? (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                <BookOpen className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-white">Ready for Email Inspection</h3>
                <p className="text-xs text-slate-400">
                  Click <span className="text-indigo-400 font-semibold">Analyze Email</span> to generate a complete Email Writing Quality Report with LanguageTool checks, tone detection, and mistake-based dynamic scoring.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Score & Final Verdict Top Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Circular Score Ring & Stars */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={report.overallScore >= 90 ? 'text-emerald-500' : report.overallScore >= 75 ? 'text-amber-500' : 'text-rose-500'}
                          strokeDasharray={`${report.overallScore}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-black text-white">{report.overallScore}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">/ 100</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getCategoryBadge(report.scoreCategory)}`}>
                          {report.scoreCategory}
                        </span>
                        <span className="text-amber-400 text-sm tracking-wider font-bold">
                          {getStarRating(report.finalVerdict?.stars || 5)}
                        </span>
                      </div>
                      <h2 className="text-lg font-extrabold text-white">
                        {report.finalVerdict?.verdictText || 'Email Quality Evaluation'}
                      </h2>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Ready to Send:</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${report.finalVerdict?.readyToSend ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                          {report.finalVerdict?.readyToSend ? '✅ Yes' : '⚠ Review Before Sending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level & Tone Pills */}
                  <div className="flex flex-col sm:items-end space-y-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Writing Level:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                        {report.writingLevel} ({report.levelConfidence}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Detected Tone:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                        {report.detectedTone} ({report.toneConfidence}%)
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic Score Breakdown Bars */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400" /> Score Breakdown Marks (Max 100)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Grammar Accuracy</span>
                      <span className="text-indigo-400 font-mono">{report.scoreBreakdown?.grammar || 40} / 40 Marks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((report.scoreBreakdown?.grammar || 40) / 40) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Spelling</span>
                      <span className="text-indigo-400 font-mono">{report.scoreBreakdown?.spelling || 15} / 15 Marks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((report.scoreBreakdown?.spelling || 15) / 15) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Sentence Structure</span>
                      <span className="text-indigo-400 font-mono">{report.scoreBreakdown?.sentenceStructure || 15} / 15 Marks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${((report.scoreBreakdown?.sentenceStructure || 15) / 15) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Professional Tone</span>
                      <span className="text-indigo-400 font-mono">{report.scoreBreakdown?.tone || 15} / 15 Marks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${((report.scoreBreakdown?.tone || 15) / 15) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Readability</span>
                      <span className="text-indigo-400 font-mono">{report.scoreBreakdown?.readability || 10} / 10 Marks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((report.scoreBreakdown?.readability || 10) / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Formatting</span>
                      <span className="text-indigo-400 font-mono">{report.scoreBreakdown?.formatting || 5} / 5 Marks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: `${((report.scoreBreakdown?.formatting || 5) / 5) * 100}%` }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Grammar & Issues Analysis */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      Grammar & Writing Issues ({report.issues?.length || 0})
                    </h3>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      All ({report.issues?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('grammar')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${activeTab === 'grammar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Grammar
                    </button>
                    <button
                      onClick={() => setActiveTab('tone')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${activeTab === 'tone' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Tone/Style
                    </button>
                    <button
                      onClick={() => setActiveTab('structure')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${activeTab === 'structure' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Structure
                    </button>
                  </div>
                </div>

                {/* Issues List */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {getFilteredIssues().length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span>No issues found in this category! Excellent writing.</span>
                    </div>
                  ) : (
                    getFilteredIssues().map((issue, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-indigo-500/40 transition">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            {issue.type}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            -{issue.deduction} Marks
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono bg-slate-900/90 p-2 rounded border border-slate-800">
                          "{issue.errorText}"
                        </p>
                        <p className="text-xs text-slate-400">
                          {issue.explanation}
                        </p>
                        <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Suggestion: {issue.suggestion}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* AI Coaching Suggestions & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Personalized AI Suggestions
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {report.aiSuggestions?.map((sugg, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{sugg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" /> Executive AI Summary
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                    {report.aiSummary}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Writing Feedback
                    </span>
                    <p className="text-xs text-indigo-300 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 font-medium">
                      {report.improvementFeedback}
                    </p>
                  </div>
                </div>

              </div>

              {/* Corrected Email Output Box */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      AI Corrected & Refined Email Version
                    </h3>
                  </div>
                  <button
                    onClick={handleCopyCorrected}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Corrected Email'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                  {report.correctedText}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {showComparisonModal && comparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Previous vs Current Email Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Previous Email Score</span>
                <span className="text-2xl font-black text-slate-300">{comparison.previousScore} / 100</span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/40">
                <span className="text-xs text-indigo-300 block mb-1">Current Email Score</span>
                <span className="text-2xl font-black text-emerald-400">{comparison.currentScore} / 100</span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Score Delta:</span>
                <span className="font-bold text-emerald-400">{comparison.scoreDelta}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Grammar Errors Reduced:</span>
                <span className="font-bold text-indigo-400">-{comparison.grammarErrorsReduced} Errors</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Spelling Errors Reduced:</span>
                <span className="font-bold text-indigo-400">-{comparison.spellingErrorsReduced} Errors</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Tone Improvement:</span>
                <span className="font-semibold text-slate-200">{comparison.toneImprovement}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
};

export default EmailCoach;
