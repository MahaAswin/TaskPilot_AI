import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Mode 2: Job Application Navigation State
  const [isJobAppMode, setIsJobAppMode] = useState(false);
  const [jobAppDetails, setJobAppDetails] = useState(null);

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

  // Fetch Gmail Connection Status & Process Mode 2 Transferred State on Mount
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

    // MODE 2: One-Time Consumption of Job Application Data
    if (location.state?.fromJobApplication) {
      const data = location.state;
      setIsJobAppMode(true);
      setJobAppDetails({
        companyName: data.companyName || 'Target Enterprise',
        jobRole: data.jobRole || 'Software Engineer',
        applicationId: data.applicationId || 'APP-2026'
      });

      if (data.recipient) setRecipientEmail(data.recipient);
      if (data.subject) setSubject(data.subject);
      if (data.body) setGeneratedBody(data.body);
      if (data.attachments && Array.isArray(data.attachments)) {
        setAttachments(data.attachments);
      }
      setSelectedTone('Job Application');

      showSuccess(`Job Application Mode: Email & Attachments Pre-filled for ${data.companyName || 'Target Enterprise'}`);

      // ONE-TIME CONSUMPTION: Immediately wipe browser history state so refresh/navigation opens in Normal Mode
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

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

  // Reset Email Form & Exit Job Application Mode (without disconnecting Gmail)
  const resetForm = (silent = false) => {
    setRecipientEmail('');
    setSubject('');
    setEmailPrompt('');
    setSelectedTone('Professional');
    setGeneratedBody('');
    setAttachments([]);
    setIsJobAppMode(false);
    setJobAppDetails(null);
    window.history.replaceState({}, document.title, window.location.pathname);
    if (!silent) {
      showSuccess('Email form reset to Normal Mode.');
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

  // Clear Form Action
  const handleClear = () => {
    resetForm(false);
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

      // Post-Send Session Reset: Wipes compose fields & resets to Normal Mode immediately
      resetForm(true);
    } catch (err) {
      showError(err.message || 'Failed to send email via Gmail API.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* 1. SaaS Hero Header Card */}
        {/* 1. SaaS Hero Header Card */}
        <div className="bg-[#1B1E25] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(232,180,93,0.14)] border border-[#E8B45D]/30 text-[#E8B45D] text-xs font-bold">
              <Cpu className="w-3.5 h-3.5 text-[#E8B45D]" />
              AI EMAIL AGENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Mail className="w-7 h-7 text-[#E8B45D]" />
              <span>AI Email Agent</span>
            </h1>
            <p className="text-[#C6C9D1] text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
              Connect Gmail via Google OAuth 2.0 to draft, refine, edit, and send emails directly using the official Gmail API with AI tone control.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-[#242832] border border-white/10 text-xs font-mono text-[#57B5A8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#57B5A8] animate-pulse" />
              Gmail Engine Online
            </div>
          </div>
        </div>

        {/* 1.5. Job Application Mode Active Banner */}
        {isJobAppMode && (
          <div className="bg-[#1B1E25] border border-white/10 rounded-2xl p-5 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[rgba(232,180,93,0.14)] text-[#E8B45D] border border-[#E8B45D]/30 shrink-0">
                <Sparkles className="w-5 h-5 text-[#E8B45D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#E8B45D]">Job Application Mode Active</h3>
                  <span className="px-2 py-0.5 rounded-md bg-[rgba(87,181,168,0.14)] text-[#57B5A8] text-[10px] font-bold border border-[#57B5A8]/30">Auto Pre-filled</span>
                </div>
                <p className="text-xs text-[#C6C9D1] mt-1">
                  Pre-filled application email for <strong className="text-white font-bold">{jobAppDetails?.companyName}</strong> ({jobAppDetails?.jobRole}). Review details below, connect Gmail if needed, and click Send.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-[#868C99] block uppercase">Application ID</span>
              <span className="text-xs font-mono font-bold text-[#E8B45D]">{jobAppDetails?.applicationId || 'APP-2026'}</span>
            </div>
          </div>
        )}

        {/* 2. Google OAuth & Gmail Connection Status Banner */}
        <div className="bg-[#1B1E25] rounded-2xl p-5 border border-white/10 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${
              gmailState.connected
                ? 'bg-[rgba(87,181,168,0.14)] border-[#57B5A8]/30 text-[#57B5A8]'
                : 'bg-[rgba(232,180,93,0.14)] border-[#E8B45D]/30 text-[#E8B45D]'
            }`}>
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">Gmail Connection Status</h3>
                {gmailState.connected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[rgba(87,181,168,0.14)] text-[#57B5A8] border border-[#57B5A8]/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[rgba(232,180,93,0.14)] text-[#E8B45D] border border-[#E8B45D]/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#C6C9D1] mt-0.5">
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
                className="px-4 py-2 bg-[#242832] hover:bg-white/5 hover:text-white text-[#ECEAE3] rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Gmail
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectGmail}
                className="px-5 py-2.5 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-[#14161B]" />
                Connect Gmail
              </button>
            )}
          </div>
        </div>

        {/* 3. Main Composer & Generator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Controls & Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1B1E25] rounded-2xl p-6 border border-white/10 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#E8B45D]" />
                  <h2 className="text-base font-bold text-white">Email Details & Prompt</h2>
                </div>
                <span className="text-xs font-semibold text-[#868C99]">AI Assistant</span>
              </div>

              {/* Recipient Email */}
              <div>
                <label className="text-xs font-bold text-[#C6C9D1] mb-1 block">Recipient Email Address</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g., hr@infosys.com"
                  className="w-full px-3.5 py-2.5 bg-[#242832] border border-white/10 rounded-xl text-xs font-medium text-white placeholder-[#868C99] focus:outline-none focus:border-[#E8B45D] transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-[#C6C9D1] mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Application for Software Engineering Internship"
                  className="w-full px-3.5 py-2.5 bg-[#242832] border border-white/10 rounded-xl text-xs font-medium text-white placeholder-[#868C99] focus:outline-none focus:border-[#E8B45D] transition-all font-semibold"
                />
              </div>

              {/* Email Prompt */}
              <div>
                <label className="text-xs font-bold text-[#C6C9D1] mb-1 block">Email Prompt / Instructions</label>
                <textarea
                  rows={4}
                  value={emailPrompt}
                  onChange={(e) => setEmailPrompt(e.target.value)}
                  placeholder='Example: "I want to send an internship request to Infosys HR for a software engineer role."'
                  className="w-full px-3.5 py-2.5 bg-[#242832] border border-white/10 rounded-xl text-xs font-medium text-white placeholder-[#868C99] focus:outline-none focus:border-[#E8B45D] transition-all leading-relaxed"
                />
              </div>

              {/* Tone Selection Radio / Pill Options */}
              <div>
                <label className="text-xs font-bold text-[#C6C9D1] mb-2 block">Select Email Tone</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => setSelectedTone(tone.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                        selectedTone === tone.value
                          ? 'bg-[#E8B45D] text-[#14161B] border-[#E8B45D] shadow-sm'
                          : 'bg-[#242832] text-[#C6C9D1] border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span>{tone.label}</span>
                      {selectedTone === tone.value && <CheckCircle2 className="w-3.5 h-3.5 text-[#14161B]" />}
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
                  className="flex-1 py-3 px-5 bg-[#E8B45D] hover:bg-[#D4A253] disabled:opacity-50 text-[#14161B] rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#14161B]" />
                      Generating Email...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#14161B]" />
                      Generate Email
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateEmail('improve')}
                  disabled={isGenerating || !generatedBody.trim()}
                  className="py-3 px-5 bg-[#242832] hover:bg-white/5 disabled:opacity-40 text-[#ECEAE3] rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
                >
                  <Wand2 className="w-4 h-4 text-[#E8B45D]" />
                  Improve Email
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 px-4 bg-[#242832] hover:bg-[#E2836A]/20 hover:text-[#E2836A] text-[#C6C9D1] rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>

              {/* Quick Sample Prompts */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs text-[#C6C9D1]">
                <span className="font-semibold text-[#868C99]">Sample Prompts:</span>
                {samplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEmailPrompt(item.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#242832] hover:bg-white/5 text-[#C6C9D1] font-medium text-[11px] border border-white/10 transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Preview & Gmail Send Panel (5 Cols) - Dark Work Surface */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1B1E25] border border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#E8B45D]" />
                  <h2 className="text-base font-bold text-white">Editable Email Preview</h2>
                </div>
                <span className="text-xs font-semibold text-[#E8B45D] bg-[rgba(232,180,93,0.14)] px-2.5 py-0.5 rounded-full border border-[#E8B45D]/30">
                  {selectedTone} Tone
                </span>
              </div>

              {/* AI Quick Utilities Bar */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('shorter')}
                  disabled={!generatedBody.trim() || isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#ECEAE3] font-bold text-[11px] border border-white/10 transition-all disabled:opacity-40"
                >
                  ✂️ Make Shorter
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('formal')}
                  disabled={!generatedBody.trim() || isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#ECEAE3] font-bold text-[11px] border border-white/10 transition-all disabled:opacity-40"
                >
                  💼 More Professional
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateEmail('improve')}
                  disabled={!generatedBody.trim() || isGenerating}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#ECEAE3] font-bold text-[11px] border border-white/10 transition-all disabled:opacity-40"
                >
                  ✨ Fix Grammar
                </button>
              </div>

              {/* Email Preview Subject */}
              <div className="p-3 bg-[#242832] border border-white/10 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#868C99] uppercase tracking-wider">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Generated subject line will appear here..."
                  className="w-full bg-transparent font-bold text-xs text-white focus:outline-none"
                />
              </div>

              {/* Email Body Textarea Preview */}
              <div>
                <label className="text-[11px] font-bold text-[#868C99] uppercase tracking-wider mb-1 block">Email Message Body:</label>
                <textarea
                  rows={12}
                  value={generatedBody}
                  onChange={(e) => setGeneratedBody(e.target.value)}
                  placeholder="Generated AI email message body will appear here. You can freely edit text before sending..."
                  className="w-full p-4 bg-[#242832] border border-white/10 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E8B45D] transition-all leading-relaxed"
                />
              </div>

              {/* Optional Attachments Bar */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-[#E8B45D]" />
                    Attachments (Resume, Cover Letter, PDF)
                  </label>

                  <label className="cursor-pointer px-3 py-1 bg-[#E8B45D] hover:bg-[#D4A253] text-[#14161B] rounded-lg text-xs font-bold transition-all shadow-sm">
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
                      <div key={idx} className="px-3 py-1.5 bg-[#242832] border border-white/10 text-white rounded-xl text-xs font-medium flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-[#57B5A8]" />
                        <span className="truncate max-w-[150px]">{att.name}</span>
                        <span className="text-[10px] text-[#C6C9D1]">({att.size})</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-[#868C99] hover:text-[#E2836A] font-bold ml-1"
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
                className="w-full py-3.5 px-6 bg-[#E8B45D] hover:bg-[#D4A253] disabled:opacity-50 text-[#14161B] rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#14161B]" />
                    Sending Email via Gmail API...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#14161B]" />
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
