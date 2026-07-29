import React, { useState } from 'react';
import {
  Mail, ShieldCheck, ShieldAlert, ShieldX, Cpu,
  AlertTriangle, CheckCircle2, RefreshCw, Search, ArrowRight,
  Check, X, Server, Send, Globe, Info
} from 'lucide-react';
import { securityService } from '../../services/securityService';

export const SpamAgent = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState(null);

  const sampleEmails = [
    { label: 'Valid Gmail', email: 'example@gmail.com' },
    { label: 'Disposable Email', email: 'test-user@tempmail.com' },
    { label: 'Invalid Domain', email: 'user@nonexistent-domain-test.com' }
  ];

  const handleInspectEmail = async (e) => {
    if (e) e.preventDefault();

    if (!emailInput || !emailInput.trim()) {
      setErrorMsg('Please enter an email address to analyze.');
      return;
    }

    const trimmed = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMsg('Invalid email format. Please enter a valid email address (e.g., example@gmail.com).');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setResultData(null);

    try {
      const data = await securityService.checkEmail(trimmed);
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete email reputation scan.');
    } finally {
      setIsLoading(false);
    }
  };

  const getQualityBadge = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'poor':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-indigo-500/20 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              TaskPilot AI Security Agent
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Mail className="w-8 h-8 text-indigo-400" />
              Email Security Agent
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Verifies email reputation, deliverability status, SMTP validity, MX records, and disposable email detection via Abstract Email Reputation API.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Abstract Email API Active
            </div>
          </div>
        </div>
      </div>

      {/* Input Form & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Email Address Reputation & Quality Verification</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">Abstract Email API</span>
        </div>

        <form onSubmit={handleInspectEmail} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter an email address to verify (e.g., example@gmail.com)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying Email...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Inspect Email Reputation
              </>
            )}
          </button>
        </form>

        {/* Quick Test Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Quick Test Emails:</span>
          {sampleEmails.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setEmailInput(item.email)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-mono text-[11px] border border-slate-200 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>

      {/* Analysis Results Display - Modern Dashboard Layout */}
      {resultData && (
        <div className="space-y-6">
          {/* Main Reputation Status Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">Email Reputation Report</h2>
              <span className="text-xs font-mono text-slate-400">Analyzed by Abstract API</span>
            </div>

            {/* Dashboard Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {/* Card 1: Status */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
                <div className="mt-2 flex items-center gap-1.5 font-extrabold text-sm">
                  {resultData.status === 'VALID' ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Valid Email
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <ShieldX className="w-4 h-4" /> Invalid Email
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Deliverability */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deliverability</div>
                <div className="mt-2 font-bold text-slate-800 text-sm">
                  {resultData.deliverability || 'Unknown'}
                </div>
              </div>

              {/* Card 3: SMTP */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SMTP Validation</div>
                <div className="mt-2 font-bold text-sm">
                  {resultData.smtpValid ? (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Valid</span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Invalid</span>
                  )}
                </div>
              </div>

              {/* Card 4: MX Records */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MX Records</div>
                <div className="mt-2 font-bold text-sm">
                  {resultData.mxValid ? (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Available</span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Not Found</span>
                  )}
                </div>
              </div>

              {/* Card 5: Disposable */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disposable</div>
                <div className="mt-2 font-bold text-sm">
                  {resultData.disposable ? (
                    <span className="text-rose-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Yes</span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> No</span>
                  )}
                </div>
              </div>

              {/* Card 6: Quality */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Quality</div>
                <div className="mt-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getQualityBadge(resultData.quality)}`}>
                    {resultData.quality || 'Good'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reason if Invalid */}
            {resultData.status === 'INVALID' && resultData.reason && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Reason for Failure:
                </div>
                <p className="font-medium pl-5">{resultData.reason}</p>
              </div>
            )}
          </div>

          {/* AI Explanation & Recommendation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Summary */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Summary</h3>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {resultData.summary}
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-indigo-50/60 rounded-2xl p-6 border border-indigo-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-indigo-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-indigo-950">Security Recommendation</h3>
              </div>
              <p className="text-xs font-semibold text-indigo-900 leading-relaxed">
                {resultData.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpamAgent;
