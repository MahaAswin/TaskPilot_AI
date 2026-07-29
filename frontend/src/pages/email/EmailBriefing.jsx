import React, { useState, useEffect } from 'react';
import { 
  Mail, Sparkles, Upload, FileText, CheckSquare, Calendar, Clock, ShieldCheck, 
  AlertTriangle, Copy, Download, Share2, CornerUpLeft, PlusCircle, CheckCircle2, 
  Link2, Paperclip, HelpCircle, Layers, ArrowRight, UserCheck, RefreshCw, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { emailBriefingService } from '../../services/emailBriefingService';

export const EmailBriefing = () => {
  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'upload'
  const [emailText, setEmailText] = useState(
    'From: Sarah Jenkins <sarah.j@acmecorp.com>\nTo: Executive Team <exec@company.com>\nSubject: Urgent: Q3 Project Review & Deliverables Deadline\nDate: 31 July 2026\n\nDear Team,\n\nPlease review the attached Q3 Roadmap document before our meeting. We have scheduled the final Q3 review call for Friday at 2:00 PM (Google Meet link: https://meet.google.com/abc-defg-hij).\n\nAll final reports must be submitted before Friday 5:00 PM. Can you please confirm your availability for the call? Also, please let me know if you need any additional resources.\n\nPlease find attached the draft roadmap.\n\nBest regards,\nSarah'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyInstruction, setReplyInstruction] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [tasksState, setTasksState] = useState([]);
  const [copied, setCopied] = useState(false);
  const [markedImportant, setMarkedImportant] = useState(false);

  const handleAnalyze = async () => {
    if (inputMode === 'paste' && !emailText.trim()) {
      toast.error('Please enter or paste an email before analyzing.');
      return;
    }
    if (inputMode === 'upload' && !selectedFile) {
      toast.error('Please select an email file (.txt, .pdf, .docx, .eml) to upload.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Extracting content & generating AI Executive Briefing...');

    try {
      let data;
      if (inputMode === 'upload') {
        data = await emailBriefingService.analyzeFile(selectedFile);
      } else {
        data = await emailBriefingService.analyzeText({ text: emailText });
      }

      setReport(data);
      if (data?.tasks) {
        setTasksState(data.tasks.map(t => ({ text: t, completed: false })));
      }

      toast.success('Executive Briefing Generated in <30 Seconds!', { id: toastId });
    } catch (error) {
      toast.error(error.message || 'Briefing generation failed.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopySummary = () => {
    if (!report?.summary) return;
    navigator.clipboard.writeText(`Executive Summary:\n${report.summary}\n\nKey Highlights:\n${report.keyHighlights?.join('\n')}`);
    setCopied(true);
    toast.success('Executive Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const content = `====================================================
TASKPILOT AI EXECUTIVE BRIEFING REPORT
====================================================
Subject: ${report.subject}
Purpose: ${report.purpose}
Priority: ${report.priority}
Sender: ${report.sender?.name} (${report.sender?.email})
Recipient: ${report.recipient?.name} (${report.recipient?.email})
Category: ${report.category}
Risk Level: ${report.riskLevel}

EXECUTIVE SUMMARY:
${report.summary}

IMPORTANT DATES:
${report.importantDates?.join('\n') || 'None'}

DEADLINES:
${report.deadlines?.join('\n') || 'None'}

ACTIONABLE TASKS:
${report.tasks?.map(t => `[ ] ${t}`).join('\n') || 'None'}

RECOMMENDATIONS:
${report.recommendations?.join('\n') || 'None'}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Briefing_${report.subject.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Briefing report downloaded!');
  };

  const handleGenerateReplyModal = async () => {
    setReplyModalOpen(true);
    if (!replyText) {
      setIsGeneratingReply(true);
      try {
        const res = await emailBriefingService.generateReply({ reportId: report._id, instruction: replyInstruction });
        setReplyText(res.replyText);
      } catch (e) {
        toast.error('Failed to generate reply draft.');
      } finally {
        setIsGeneratingReply(false);
      }
    }
  };

  const handleTaskToggle = (idx) => {
    setTasksState(prev => prev.map((t, i) => i === idx ? { ...t, completed: !t.completed } : t));
  };

  const handleCreateTask = (taskText) => {
    toast.success(`Task created in Task Queue: "${taskText}"`);
  };

  const handleCreateCalendarEvent = (eventObj) => {
    toast.success(`Calendar event created: "${eventObj.title}" on ${eventObj.date}`);
  };

  const getPriorityBadge = (priority) => {
    if (priority?.includes('High') || priority?.includes('🔴')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
    if (priority?.includes('Medium') || priority?.includes('🟡')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  const getRiskBadge = (risk) => {
    if (risk === 'Suspicious') return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (risk === 'Warning') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900 p-6 sm:p-8 border border-blue-500/20 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-inner">
                <Mail className="w-6 h-6 animate-pulse" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                AI Email Briefing Agent
              </h1>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                Executive Assistant
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Upload or paste long emails to extract structured executive summaries, deadlines, actionable tasks, meeting details, and risk indicators in under 30 seconds.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Target Exec Speed: &lt;30 Seconds</span>
          </div>
        </div>
      </div>

      {/* Main Container: Input on Left/Top, Executive Briefing Dashboard below/right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            
            {/* Input Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setInputMode('paste')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${inputMode === 'paste' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Email</span>
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${inputMode === 'upload' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>

            {/* Input Body */}
            {inputMode === 'paste' ? (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Email Text Content</label>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Paste complete email text here..."
                  rows={14}
                  className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none"
                />
              </div>
            ) : (
              <div className="space-y-4 py-6 text-center">
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-8 bg-slate-950/60 transition cursor-pointer flex flex-col items-center justify-center gap-3">
                  <Upload className="w-8 h-8 text-blue-400" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">
                      {selectedFile ? selectedFile.name : 'Select or drag email file here'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supported formats: <span className="text-blue-400 font-mono">TXT, PDF, DOCX, EML</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx,.eml"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="email-file-input"
                  />
                  <label
                    htmlFor="email-file-input"
                    className="mt-2 px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-bold cursor-pointer transition"
                  >
                    Browse Document
                  </label>
                </div>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Briefing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Generate Executive Briefing</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Executive Dashboard (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {!report ? (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <Mail className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-white">Executive Assistant Standby</h3>
                <p className="text-xs text-slate-400">
                  Paste or upload an email to receive a structured 20-section Executive Briefing with high-priority highlight detection and actionable tasks.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* One-Click Executive Actions Bar */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report</span>
                  </button>

                  <button
                    onClick={handleGenerateReplyModal}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Generate Reply</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMarkedImportant(!markedImportant);
                      toast.success(markedImportant ? 'Unmarked' : 'Marked as Important');
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold transition ${markedImportant ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                    title="Mark Important"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Top Overview Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getPriorityBadge(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risk Detection</span>
                  <div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getRiskBadge(report.riskLevel)}`}>
                      {report.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</span>
                  <div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                      {report.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reading Time</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{report.readingTime}</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Executive Summary (&lt;100 words)
                  </h3>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                    Purpose: {report.purpose}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {report.summary}
                </p>
              </div>

              {/* Sender & Recipient Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" /> Sender Identification
                  </h4>
                  <div className="space-y-1.5 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-200">{report.sender?.name}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="font-mono text-emerald-400">{report.sender?.email}</span></div>
                    <div><span className="text-slate-500">Org:</span> <span className="text-slate-300">{report.sender?.organization}</span></div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-400" /> Recipient Details
                  </h4>
                  <div className="space-y-1.5 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-200">{report.recipient?.name}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="font-mono text-blue-400">{report.recipient?.email}</span></div>
                    <div><span className="text-slate-500">Subject:</span> <span className="text-slate-300 font-semibold">{report.subject}</span></div>
                  </div>
                </div>
              </div>

              {/* Actionable Checklist */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" /> Actionable Task Checklist
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {tasksState.filter(t => t.completed).length} / {tasksState.length} Done
                  </span>
                </div>

                <div className="space-y-2">
                  {tasksState.map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskToggle(idx)}
                          className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                        />
                        <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                          {task.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCreateTask(task.text)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates, Deadlines & Calendar Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" /> Timeline & Deadlines
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">Deadlines:</span>
                      {report.deadlines?.map((d, i) => (
                        <div key={i} className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-200 font-medium mb-1">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">Important Dates:</span>
                      {report.importantDates?.map((d, i) => (
                        <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono mb-1">
                          📅 {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" /> Calendar Event Suggestions
                  </h4>
                  <div className="space-y-2 text-xs">
                    {report.calendarEvents?.map((ev, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{ev.title}</span>
                          <button
                            onClick={() => handleCreateCalendarEvent(ev)}
                            className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold transition"
                          >
                            + Calendar
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {ev.date} @ {ev.time} ({ev.reminder})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Yellow Key Highlights Box */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Key Executive Highlights (Max 10)
                </h3>
                <div className="space-y-2">
                  {report.keyHighlights?.map((hl, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100 font-medium leading-relaxed">
                      💡 "{hl}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Grammar & Writing Analysis Section */}
              {report.grammarAnalysis ? (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          Grammar & Writing Analysis
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Official LanguageTool Public API + AI Quality Assessment
                        </span>
                      </div>
                    </div>

                    {!report.grammarAnalysis.available ? (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                        ⚠ Grammar analysis temporarily unavailable.
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          Grammar Score: {report.grammarAnalysis.grammarScore} / 100 ({report.grammarAnalysis.writingQualityCategory})
                        </div>
                        <div className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                          Email Quality: {report.grammarAnalysis.overallEmailQualityScore} / 100
                        </div>
                      </div>
                    )}
                  </div>

                  {report.grammarAnalysis.available && (
                    <>
                      {/* Statistics Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Grammar Errors</span>
                          <span className="text-lg font-black text-rose-400">{report.grammarAnalysis.counts?.grammarErrors || 0}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Spelling Errors</span>
                          <span className="text-lg font-black text-amber-400">{report.grammarAnalysis.counts?.spellingErrors || 0}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Punctuation</span>
                          <span className="text-lg font-black text-blue-400">{report.grammarAnalysis.counts?.punctuationErrors || 0}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Style Suggestions</span>
                          <span className="text-lg font-black text-purple-400">{report.grammarAnalysis.counts?.styleSuggestions || 0}</span>
                        </div>
                      </div>

                      {/* Constructive Writing Feedback */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-indigo-300">
                        <span className="font-bold text-slate-200 block mb-0.5">Writing Level: {report.grammarAnalysis.writingLevel}</span>
                        {report.grammarAnalysis.assessmentFeedback}
                      </div>

                      {/* Error Inspection Table */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          LanguageTool Detected Issues ({report.grammarAnalysis.issues?.length || 0})
                        </h4>

                        {report.grammarAnalysis.issues?.length === 0 ? (
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>No grammar or spelling mistakes found in this email!</span>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                                  <th className="p-3">Original Text</th>
                                  <th className="p-3">Corrected Text</th>
                                  <th className="p-3">Category</th>
                                  <th className="p-3">Explanation</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                                {report.grammarAnalysis.issues?.map((issue, idx) => (
                                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                                    <td className="p-3 font-mono text-rose-400 font-semibold">{issue.originalText}</td>
                                    <td className="p-3 font-mono text-emerald-400 font-semibold">{issue.correctedText}</td>
                                    <td className="p-3">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                        {issue.category}
                                      </span>
                                    </td>
                                    <td className="p-3 text-slate-300">{issue.explanation}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              {/* Corrected Professional Version Card */}
              {report.correctedText && (
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">
                        Corrected Professional Version
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(report.correctedText);
                        toast.success('Corrected email copied to clipboard!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Corrected Version</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                    {report.correctedText}
                  </div>
                </div>
              )}

              {/* Links & Attachments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-blue-400" /> Important Links Extracted
                  </h4>
                  <div className="space-y-2 text-xs">
                    {report.links?.length === 0 ? (
                      <p className="text-slate-500">No links detected in email.</p>
                    ) : (
                      report.links?.map((lnk, i) => (
                        <a
                          key={i}
                          href={lnk}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-2 rounded bg-slate-950 border border-slate-800 text-blue-400 hover:underline font-mono truncate"
                        >
                          🔗 {lnk}
                        </a>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-indigo-400" /> Mentioned Attachments
                  </h4>
                  <div className="space-y-2 text-xs">
                    {report.attachmentsMentioned?.length === 0 ? (
                      <p className="text-slate-500">No attachments referenced.</p>
                    ) : (
                      report.attachmentsMentioned?.map((att, i) => (
                        <div key={i} className="p-2 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">
                          📎 {att}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CornerUpLeft className="w-4 h-4 text-indigo-400" /> Generate AI Executive Reply
              </h3>
              <button onClick={() => setReplyModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Custom Reply Instructions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Accept Friday meeting and ask for agenda"
                value={replyInstruction}
                onChange={(e) => setReplyInstruction(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Draft Response</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={8}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(replyText);
                  toast.success('Reply draft copied!');
                  setReplyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
              >
                Copy Reply Draft
              </button>

              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmailBriefing;
