import React, { useState } from 'react';
import {
  ShieldCheck, ShieldAlert, ShieldX, Globe, Lock, Unlock,
  AlertTriangle, CheckCircle2, RefreshCw, Search, ArrowRight,
  ExternalLink, Server, Activity, Cpu
} from 'lucide-react';
import { securityService } from '../../services/securityService';

export const ScannerAgent = () => {
  const [urlInput, setUrlInput] = useState('');
  const [scanMode, setScanMode] = useState('reputation'); // 'reputation' | 'behavioral'
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState(null); // 'reputation' | 'behavioral' | null
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState(null);

  const sampleUrls = [
    { label: 'Google', url: 'https://google.com' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Phishing Test', url: 'http://testsafebrowsing.appspot.com/s/phishing.html' }
  ];

  const handleScan = async (e, targetMode) => {
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
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete scanner agent inspection.');
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
    if (result.status === 'Safe') return 5;
    if (result.status === 'Suspicious') return 60;
    if (result.status === 'Malicious') return 95;
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
              TaskPilot AI Security Agent
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              Scanner Agent
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Dedicated URL & Website Security Scanner. Evaluates URL reputation via VirusTotal v3 API and inspects web page behaviors via urlscan.io.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              VirusTotal & urlscan.io Active
            </div>
          </div>
        </div>
      </div>

      {/* URL Input Form & Separate Scan Buttons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">URL Reputation & Behavioral Inspection</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">Scanner Agent Engine</span>
        </div>

        <form onSubmit={(e) => handleScan(e, scanMode)} className="flex flex-col gap-3">
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
              onClick={(e) => handleScan(e, 'reputation')}
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
              onClick={(e) => handleScan(e, 'behavioral')}
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>

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
                      <span className="text-slate-500">Threat Score</span>
                      <span className={colors.scoreColor}>{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${colors.progressBg} transition-all duration-500`} style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Threat Tags */}
                {resultData.threats && resultData.threats.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-slate-400">Detected Threat Categories:</span>
                    {resultData.threats.map((threat, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-mono text-[11px] font-bold border border-rose-200">
                        {threat}
                      </span>
                    ))}
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

          {/* Engine Detections (VirusTotal) */}
          {scanMode === 'reputation' && resultData.details && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">VirusTotal Antivirus Engine Intelligence</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-2xl font-extrabold text-slate-900">{resultData.details.stats?.malicious || 0}</div>
                  <div className="text-[11px] font-semibold text-rose-500">Malicious</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-2xl font-extrabold text-slate-900">{resultData.details.stats?.suspicious || 0}</div>
                  <div className="text-[11px] font-semibold text-amber-500">Suspicious</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-2xl font-extrabold text-slate-900">{resultData.details.stats?.harmless || 0}</div>
                  <div className="text-[11px] font-semibold text-emerald-500">Harmless</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-2xl font-extrabold text-slate-900">{resultData.details.stats?.undetected || 0}</div>
                  <div className="text-[11px] font-semibold text-slate-400">Undetected</div>
                </div>
              </div>

              {resultData.details.enginesFlagged && resultData.details.enginesFlagged.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-600">Flagged by Security Engines:</div>
                  <div className="flex flex-wrap gap-2">
                    {resultData.details.enginesFlagged.map((engine, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                        {engine}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Behavioral Page Metrics (urlscan.io) */}
          {scanMode === 'behavioral' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Server className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Page Metadata & Encryption</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-medium">Page Title:</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">
                      {resultData.pageMetadata?.title || 'Untitled'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-medium">IP Address & ASN:</span>
                    <span className="font-mono text-slate-800">
                      {resultData.pageMetadata?.ip} ({resultData.pageMetadata?.asn})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-medium">Web Server:</span>
                    <span className="font-mono text-slate-800">{resultData.pageMetadata?.server}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-medium">HTTPS Status:</span>
                    <span className={`font-semibold flex items-center gap-1 ${resultData.httpsStatus?.isHttps ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {resultData.httpsStatus?.isHttps ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      {resultData.httpsStatus?.isHttps ? 'Encrypted (SSL Valid)' : 'Unencrypted HTTP'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Redirects & Network Requests</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Redirect Chain Hops ({resultData.redirectChains?.length || 0}):</span>
                    <div className="space-y-1">
                      {resultData.redirectChains?.map((hop, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center gap-2 truncate">
                          <span className="text-indigo-500 font-bold">#{i + 1}</span>
                          <span className="truncate">{hop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Network Requests:</span>
                      <span className="text-slate-800 font-bold">{resultData.networkRequests?.total || 0} Total ({resultData.networkRequests?.securePercentage || 0}% HTTPS)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScannerAgent;
