import React, { useState } from 'react';
import {
  ShieldCheck, ShieldAlert, ShieldX, Globe, Lock, Unlock,
  AlertTriangle, CheckCircle2, RefreshCw, Search, ArrowRight,
  ExternalLink, Server, Activity, FileText, Cpu, Mail, QrCode, FileCode, Send
} from 'lucide-react';
import { securityService } from '../../services/securityService';

export const SecurityAI = () => {
  // Navigation Tabs: 'link' | 'email'
  const [activeAgentTab, setActiveAgentTab] = useState('link');

  // Link Agent State
  const [urlInput, setUrlInput] = useState('');
  const [scanMode, setScanMode] = useState('reputation'); // 'reputation' | 'behavioral'

  // Email Agent State
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState(null);

  const sampleUrls = [
    { label: 'Google', url: 'https://google.com' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Phishing Test', url: 'http://testsafebrowsing.appspot.com/s/phishing.html' }
  ];

  const sampleEmails = [
    {
      label: 'Phishing Alert Sample',
      sender: 'support-security@paypal-notice-alert.com',
      subject: 'URGENT: Your PayPal Account Has Been Suspended!',
      body: 'Dear customer, your account requires immediate verification within 24 hours or it will be locked permanently. Please click http://login-paypal-verify.top to reset your credentials.'
    },
    {
      label: 'Spam Offer Sample',
      sender: 'payouts@crypto-wealth-bonus.xyz',
      subject: 'Claim your free $5,000 crypto gift card bonus now!',
      body: 'Congratulations! You have been selected for an exclusive bonus payout. Click here to claim your reward immediately.'
    },
    {
      label: 'Legitimate Invoice Sample',
      sender: 'billing@taskpilot.ai',
      subject: 'TaskPilot AI Subscription Receipt #89421',
      body: 'Thank you for your TaskPilot AI Pro subscription. Attached is your invoice receipt for July 2026.'
    }
  ];

  // Handle Link Security Scan
  const handleLinkScan = async (e, targetMode) => {
    if (e) e.preventDefault();

    if (!urlInput || !urlInput.trim()) {
      setErrorMsg('Please enter a valid URL to analyze.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setLoadingMode(targetMode);
    setScanMode(targetMode);
    setResultData(null);

    try {
      let data;
      if (targetMode === 'reputation') {
        data = await securityService.checkLink(urlInput.trim());
      } else {
        data = await securityService.analyzeWebsite(urlInput.trim());
      }
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete link security scan.');
    } finally {
      setIsLoading(false);
      setLoadingMode(null);
    }
  };

  // Handle Email Security Scan
  const handleEmailScan = async (e) => {
    if (e) e.preventDefault();

    if (!emailBody.trim() && !emailSubject.trim()) {
      setErrorMsg('Please enter email subject or body text to analyze.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setLoadingMode('email');
    setResultData(null);

    try {
      const data = await securityService.checkEmail({
        sender: emailSender.trim(),
        subject: emailSubject.trim(),
        body: emailBody.trim()
      });
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete email threat scan.');
    } finally {
      setIsLoading(false);
      setLoadingMode(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-500',
          badge: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
          icon: ShieldCheck,
          scoreColor: 'text-emerald-500',
          progressBg: 'bg-emerald-500'
        };
      case 'suspicious':
      case 'spam':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-500',
          badge: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
          icon: ShieldAlert,
          scoreColor: 'text-amber-500',
          progressBg: 'bg-amber-500'
        };
      case 'malicious':
      case 'phishing':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          text: 'text-rose-500',
          badge: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
          icon: ShieldX,
          scoreColor: 'text-rose-500',
          progressBg: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-500',
          badge: 'bg-slate-500/20 text-slate-600 border-slate-500/30',
          icon: ShieldAlert,
          scoreColor: 'text-slate-500',
          progressBg: 'bg-slate-500'
        };
    }
  };

  const calculateRiskScore = (result) => {
    if (!result) return 0;
    if (result.spamScore !== undefined) return result.spamScore;
    if (result.status === 'Safe') return 5;
    if (result.status === 'Suspicious' || result.status === 'Spam') return 60;
    if (result.status === 'Malicious' || result.status === 'Phishing') return 95;
    return 35;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-indigo-500/20 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              TaskPilot AI Security Suite
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              Cybersecurity AI Multi-Agent Center
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Deploy AI agents to analyze URL reputations via VirusTotal, inspect website behaviors via urlscan.io, and detect email phishing attacks.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              VirusTotal & Email Defense Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Agent Selection Tabs */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => {
            setActiveAgentTab('link');
            setResultData(null);
            setErrorMsg('');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeAgentTab === 'link'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Link & Website Security Agent
        </button>

        <button
          onClick={() => {
            setActiveAgentTab('email');
            setResultData(null);
            setErrorMsg('');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeAgentTab === 'email'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email Security & Phishing Agent
        </button>
      </div>

      {/* TAB 1: Link & Website Security Agent UI */}
      {activeAgentTab === 'link' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Link Reputation & Website Behavior Scanner</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">VirusTotal & urlscan.io</span>
          </div>

          <form onSubmit={(e) => handleLinkScan(e, scanMode)} className="flex flex-col gap-3">
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste any link URL to analyze (e.g., https://example.com)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={(e) => handleLinkScan(e, 'reputation')}
                disabled={isLoading}
                className={`flex-1 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  scanMode === 'reputation' && resultData
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                } disabled:opacity-50`}
              >
                {isLoading && loadingMode === 'reputation' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning VirusTotal...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    Check Link Reputation (VirusTotal)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handleLinkScan(e, 'behavioral')}
                disabled={isLoading}
                className={`flex-1 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  scanMode === 'behavioral' && resultData
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-300'
                } disabled:opacity-50`}
              >
                {isLoading && loadingMode === 'behavioral' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing urlscan.io...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-sky-400" />
                    Analyze Website Behavior (urlscan.io)
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Test URLs */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Quick Test URLs:</span>
            {sampleUrls.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrlInput(item.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-mono text-[11px] border border-slate-200 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Email Security Agent UI (Dedicated Page View) */}
      {activeAgentTab === 'email' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Email Phishing & Spam Defense Agent</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">AI Threat & Red Flag Detector</span>
          </div>

          <form onSubmit={handleEmailScan} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Sender Email Address (Optional)</label>
                <input
                  type="text"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  placeholder="e.g., support-security@paypal-alert.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g., URGENT: Verify your account credentials"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Email Message Body / Header Text</label>
              <textarea
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Paste the full email text or message content to inspect..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Email with AI Security Agent...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Inspect Email for Phishing & Threats
                </>
              )}
            </button>
          </form>

          {/* Quick Test Email Templates */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Quick Test Samples:</span>
            {sampleEmails.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setEmailSender(sample.sender);
                  setEmailSubject(sample.subject);
                  setEmailBody(sample.body);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium text-[11px] border border-slate-200 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Analysis Results Display */}
      {resultData && (
        <div className="space-y-6">
          {/* Status & Risk Gauge Card */}
          {(() => {
            const colors = getStatusColor(resultData.status);
            const StatusIcon = colors.icon;
            const score = calculateRiskScore(resultData);

            return (
              <div className={`rounded-2xl p-6 border ${colors.border} ${colors.bg} backdrop-blur-md shadow-sm space-y-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm border ${colors.border}`}>
                      <StatusIcon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{resultData.status} Status</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${colors.badge}`}>
                          {resultData.risk} Risk
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-1">
                        {resultData.detectionSummary || resultData.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* Threat Meter Score */}
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shrink-0 min-w-[200px]">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-500">Threat / Spam Score</span>
                      <span className={colors.scoreColor}>{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${colors.progressBg} transition-all duration-500`} style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Email Red Flag Indicators */}
                {resultData.indicators && resultData.indicators.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-600">Detected Security Indicators:</div>
                    <div className="space-y-1">
                      {resultData.indicators.map((ind, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-white/70 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* AI Security Explanation Card */}
          {resultData.explanation && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Security Explanation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">What Was Detected</div>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    {resultData.explanation.whatWasDetected}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Why It Is Dangerous</div>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    {resultData.explanation.whyDangerous}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Level Assessment</div>
                  <p className="text-xs font-bold text-indigo-600">
                    {resultData.explanation.riskLevel}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Recommended Action</div>
                  <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                    {resultData.explanation.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security AI Agent Roadmap Teasers */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Security AI Agent Ecosystem</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Extensible Modular Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white w-fit">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-indigo-950">Email Security Agent</h4>
            <p className="text-[11px] text-indigo-700">Phishing detection & urgency indicator analysis.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all space-y-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit">
              <FileCode className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">File Malware Scanner</h4>
            <p className="text-[11px] text-slate-500">Hash lookups and static file payload checks.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all space-y-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 w-fit">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">QR Code Threat Agent</h4>
            <p className="text-[11px] text-slate-500">Decodes & scans embedded QR destination links.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all space-y-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Website Trust Analyzer</h4>
            <p className="text-[11px] text-slate-500">WHOIS domain age and SSL issuer reputation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAI;
