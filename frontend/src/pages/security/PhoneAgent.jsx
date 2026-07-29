import React, { useState } from 'react';
import {
  Phone, ShieldCheck, ShieldAlert, ShieldX, Cpu,
  AlertTriangle, CheckCircle2, RefreshCw, Search, ArrowRight,
  Check, X, Globe, Signal, MapPin
} from 'lucide-react';
import { securityService } from '../../services/securityService';

export const PhoneAgent = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState(null);

  const samplePhones = [
    { label: 'India Jio Mobile', phone: '+919876543210' },
    { label: 'US AT&T Mobile', phone: '+14155552671' },
    { label: 'UK Vodafone', phone: '+442079460912' },
    { label: 'Invalid Number', phone: '+000000000' }
  ];

  const handleInspectPhone = async (e) => {
    if (e) e.preventDefault();

    if (!phoneInput || !phoneInput.trim()) {
      setErrorMsg('Please enter a phone number to verify.');
      return;
    }

    const trimmed = phoneInput.trim();
    const digitsOnly = trimmed.replace(/[^\d]/g, '');

    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setErrorMsg('Invalid phone number format. Please enter digits with optional country code (e.g., +919876543210).');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setResultData(null);

    try {
      const data = await securityService.checkPhone(trimmed);
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete phone verification scan.');
    } finally {
      setIsLoading(false);
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
              <Phone className="w-8 h-8 text-indigo-400" />
              Phone Intelligence Agent
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Verifies international phone numbers, line types (Mobile/Landline/VoIP), network carriers, and geographic locations via Abstract Phone Validation API.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Abstract Phone API Active
            </div>
          </div>
        </div>
      </div>

      {/* Input Form & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Phone Number Verification & Carrier Intelligence</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">Abstract Phone API</span>
        </div>

        <form onSubmit={handleInspectPhone} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Enter phone number with country code (e.g., +919876543210 or +14155552671)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner font-mono"
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
                Verifying Phone Number...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verify Phone Number
              </>
            )}
          </button>
        </form>

        {/* Quick Test Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Quick Test Phone Numbers:</span>
          {samplePhones.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPhoneInput(item.phone)}
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

      {/* Analysis Results Display - Dashboard Layout */}
      {resultData && (
        <div className="space-y-6">
          {/* Main Intelligence Report Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">Phone Intelligence Report</h2>
              <span className="text-xs font-mono text-slate-400">Analyzed by Abstract API</span>
            </div>

            {/* Dashboard Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
              {/* Card 1: Status */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
                <div className="mt-2 flex items-center gap-1.5 font-extrabold text-sm">
                  {resultData.status === 'VALID' ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Valid Number
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <ShieldX className="w-4 h-4" /> Invalid Number
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Country */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Country</div>
                <div className="mt-2 font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  {resultData.country || 'Unknown'}
                </div>
              </div>

              {/* Card 3: Country Code */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Country Code</div>
                <div className="mt-2 font-mono font-extrabold text-slate-800 text-sm">
                  {resultData.countryCode || '-'}
                </div>
              </div>

              {/* Card 4: Carrier */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Carrier</div>
                <div className="mt-2 font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5 text-sky-500" />
                  {resultData.carrier || 'Unknown'}
                </div>
              </div>

              {/* Card 5: Line Type */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Line Type</div>
                <div className="mt-2 font-bold text-sm">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                    resultData.lineType === 'Mobile'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : resultData.lineType === 'VoIP'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {resultData.lineType || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Card 6: International Format */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">International Format</div>
                <div className="mt-2 font-mono text-xs font-bold text-slate-800 truncate">
                  {resultData.internationalFormat || '-'}
                </div>
              </div>

              {/* Card 7: Local Format */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Local Format</div>
                <div className="mt-2 font-mono text-xs font-bold text-slate-800 truncate">
                  {resultData.localFormat || '-'}
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

          {/* AI Explanation & Security Recommendation Section */}
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

export default PhoneAgent;
