import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Sparkles, Send, RefreshCw, Trash2, Paperclip, CheckCircle2,
  FileText, Cpu, Edit3, Wand2, ShieldCheck, AlertCircle, FileCheck,
  LogOut, ExternalLink, ShieldAlert
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { emailService } from '../../services/emailService';

export const EmailAgent = () => {
  const { showSuccess, showError } = useToast();

  // Gmail Connection State
  const [gmailState, setGmailState] = useState({ connected: false, email: '' });
  const [isCheckingGmail, setIsCheckingGmail] = useState(false);

  // Email Composition States
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [emailPrompt, setEmailPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [generatedBody, setGeneratedBody] = useState('');

  const [attachments, setAttachments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const tones = [
    { label: 'Professional', value: 'Professional' },
    { label: 'Friendly', value: 'Friendly' },
    { label: 'Formal', value: 'Formal' },
    { label: 'Casual', value: 'Casual' },
    { label: 'Apology', value: 'Apology' },
    { label: 'Thank You', value: 'Thank You' },
    { label: 'Follow Up', value: 'Follow Up' },
    { label: 'Job Application', value: 'Job Application' }
  ];

  const samplePrompts = [
    { label: 'Internship Request', text: 'I want to send an internship request to Infosys HR for a software engineer role.' },
    { label: 'Follow-up Email', text: 'Write a polite follow-up email regarding my job interview last week.' },
    { label: 'Project Delay Apology', text: 'Apologize to client for 2 days delay in project delivery due to bug fixes.' },
    { label: 'Thank You Letter', text: 'Thank the hiring manager for conducting a great technical interview.' }
  ];

  // Fetch Gmail Connection Status on Mount
  useEffect(() => {
    fetchGmailStatus();

    // Check if returning from OAuth callback URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      const email = urlParams.get('email') || 'user.taskpilot@gmail.com';
      setGmailState({ connected: true, email });
      showSuccess(`Connected Gmail Account: ${email}`);
      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchGmailStatus = async () => {
    setIsCheckingGmail(true);
    try {
      const res = await emailService.getGoogleStatus();
      setGmailState({ connected: Boolean(res?.connected), email: res?.email || '' });
    } catch (err) {
      console.warn('Failed to fetch Gmail status:', err);
    } finally {
      setIsCheckingGmail(false);
    }
  };

  // Google OAuth Connect Action
  const handleConnectGmail = async () => {
    try {
      const authUrl = await emailService.getGoogleAuthUrl();
      if (authUrl) {
        showSuccess('Redirecting to Google OAuth 2.0 Login...');
        window.location.href = authUrl;
      }
    } catch (err) {
      showError('Failed to initiate Google OAuth flow.');
    }
  };

  // Disconnect Gmail Action
  const handleDisconnectGmail = async () => {
    try {
      await emailService.disconnectGoogle();
      setGmailState({ connected: false, email: '' });
      showSuccess('Gmail account disconnected.');
    } catch (err) {
      showError('Failed to disconnect Gmail.');
    }
  };

  // Handle AI Email Generation
  const handleGenerateEmail = async (actionType = 'generate') => {
    if (!emailPrompt.trim() && !generatedBody.trim()) {
      showError('Please enter an email prompt or instructions to generate.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await emailService.generateEmail({
        prompt: emailPrompt.trim(),
        tone: selectedTone,
        action: actionType,
        existingSubject: subject,
        existingBody: generatedBody
      });

      if (response?.subject) setSubject(response.subject);
      if (response?.body) setGeneratedBody(response.body);

      showSuccess(`Email ${actionType === 'generate' ? 'generated' : 'refined'} successfully (${selectedTone} tone).`);
    } catch (err) {
      showError(err.message || 'Failed to generate email content.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Attachment Upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newAtts = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' }));
      setAttachments(prev => [...prev, ...newAtts]);
      showSuccess(`Attached ${files.length} file(s)`);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Clear Form
  const handleClear = () => {
    setRecipientEmail('');
    setSubject('');
    setEmailPrompt('');
    setSelectedTone('Professional');
    setGeneratedBody('');
    setAttachments([]);
    showSuccess('Email form cleared.');
  };

  // Send Email Action via Gmail API
  const handleSendEmail = async (e) => {
    if (e) e.preventDefault();

    if (!gmailState.connected) {
      showError('Please connect your Gmail account via Google OAuth 2.0 before sending.');
      handleConnectGmail();
      return;
    }

    if (!recipientEmail.trim()) {
      showError('Please enter recipient email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail.trim())) {
      showError('Please enter a valid recipient email address (e.g., hr@company.com).');
      return;
    }

    if (!subject.trim()) {
      showError('Please provide an email subject before sending.');
      return;
    }

    if (!generatedBody.trim()) {
      showError('Please generate or compose email body text before sending.');
      return;
    }

    setIsSending(true);

    try {
      const response = await emailService.sendEmail({
        to: recipientEmail.trim(),
        subject: subject.trim(),
        body: generatedBody.trim(),
        attachments
      });

      showSuccess(response?.message || 'Email sent successfully via Gmail API!');
    } catch (err) {
      showError(err.message || 'Failed to send email via Gmail API.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* 1. Gradient Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-indigo-500/20 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                TaskPilot AI Email Agent
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Mail className="w-8 h-8 text-indigo-400" />
                Email Agent (Google OAuth & Gmail API)
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                Connect your Gmail account securely via Google OAuth 2.0 to compose, refine, edit, and send emails directly using the official Gmail API.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Gmail API Engine Online
              </div>
            </div>
          </div>
        </div>

        {/* 2. Google OAuth & Gmail Connection Status Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${
              gmailState.connected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}>
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">Gmail Connection Status</h3>
                {gmailState.connected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {gmailState.connected
                  ? `Connected Account: ${gmailState.email}`
                  : 'Authenticate using Google OAuth 2.0 to enable sending emails from your Gmail account.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {gmailState.connected ? (
              <button
                type="button"
                onClick={handleDisconnectGmail}
                className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Gmail
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectGmail}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Connect Gmail
              </button>
            )}
          </div>
        </div>

        {/* 3. Main Composer & Generator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Controls & Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Email Details & Prompt</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">AI Assistant</span>
              </div>

              {/* Recipient Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Recipient Email Address</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g., hr@infosys.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Application for Software Engineering Internship"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold text-indigo-950"
                />
              </div>

              {/* Email Prompt */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Email Prompt / Instructions</label>
                <textarea
                  rows={4}
                  value={emailPrompt}
                  onChange={(e) => setEmailPrompt(e.target.value)}
                  placeholder='Example: "I want to send an internship request to Infosys HR for a software engineer role."'
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              {/* Tone Selection Radio / Pill Options */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">Select Email Tone</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => setSelectedTone(tone.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                        selectedTone === tone.value
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tone.label}</span>
                      {selectedTone === tone.value && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('generate')}
                  disabled={isGenerating}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating Email...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Email
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateEmail('improve')}
                  disabled={isGenerating || !generatedBody.trim()}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
                >
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  Improve Email
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>

              {/* Quick Sample Prompts */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Sample Prompts:</span>
                {samplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEmailPrompt(item.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium text-[11px] border border-slate-200 transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Preview & Gmail Send Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Editable Email Preview</h2>
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {selectedTone} Tone
                </span>
              </div>

              {/* AI Quick Utilities Bar */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('shorter')}
                  disabled={!generatedBody.trim() || isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold text-[11px] border border-slate-200 transition-all disabled:opacity-40"
                >
                  ✂️ Make Shorter
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('formal')}
                  disabled={!generatedBody.trim() || isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold text-[11px] border border-slate-200 transition-all disabled:opacity-40"
                >
                  💼 More Professional
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('improve')}
                  disabled={!generatedBody.trim() || isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold text-[11px] border border-slate-200 transition-all disabled:opacity-40"
                >
                  ✨ Fix Grammar
                </button>
              </div>

              {/* Email Preview Subject */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Generated subject line will appear here..."
                  className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* Email Body Textarea Preview */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email Message Body:</label>
                <textarea
                  rows={12}
                  value={generatedBody}
                  onChange={(e) => setGeneratedBody(e.target.value)}
                  placeholder="Generated AI email message body will appear here. You can freely edit text before sending..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              {/* Optional Attachments Bar */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    Attachments (Resume, Cover Letter, PDF)
                  </label>

                  <label className="cursor-pointer px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-slate-200 transition-all">
                    <span>+ Add File</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded Attachment Chips */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {attachments.map((att, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-medium flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="truncate max-w-[150px]">{att.name}</span>
                        <span className="text-[10px] text-indigo-500">({att.size})</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gmail API Send Button */}
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSending || !recipientEmail || !generatedBody}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending Email via Gmail API...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {gmailState.connected ? `Send Email via Gmail (${gmailState.email})` : 'Connect Gmail & Send Email'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default EmailAgent;
