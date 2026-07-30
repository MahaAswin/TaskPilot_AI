import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Search, FileText, Mail, Send, CheckCircle2, 
  Sparkles, Upload, User, ArrowRight, ShieldCheck, RefreshCw, 
  ExternalLink, FileCode, Paperclip, Clock, Filter, Eye, ChevronRight, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageContainer from '../../components/common/PageContainer';
import { jobApplicationService } from '../../services/jobApplicationService';

export const JobApplication = () => {
  const navigate = useNavigate();
  // Stepper state (1: Input, 2: Select Job, 3: AI Recommendations, 4: Preview Email/Docs, 5: Submit & History)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [preferredRole, setPreferredRole] = useState('Senior Software Engineer');
  const [preferredLocation, setPreferredLocation] = useState('India');
  const [portfolioUrl, setPortfolioUrl] = useState('https://alexmorgan.dev');
  const [githubUrl, setGithubUrl] = useState('https://github.com/alexmorgan');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/alexmorgan');
  const [additionalNotes, setAdditionalNotes] = useState('Passionate about AI platform architecture and full-stack development.');
  const [resumeFile, setResumeFile] = useState(null);

  // Results & Selection State
  const [isSearching, setIsSearching] = useState(false);
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Preparation & Email Preview State
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparedData, setPreparedData] = useState(null);
  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');

  // Submission & History State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [historyFilter, historySearch]);

  const fetchHistory = async () => {
    const data = await jobApplicationService.getHistory({ status: historyFilter, search: historySearch });
    setHistoryList(data);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      toast.success(`Resume uploaded: ${file.name}`);
    }
  };

  const handleSearchJobs = async (e) => {
    e?.preventDefault();
    if (!preferredRole) {
      toast.error('Please enter preferred job role.');
      return;
    }

    setIsSearching(true);
    const toastId = toast.loading('Querying live jobs via AI Career Intelligence Agent...');

    try {
      const formData = new FormData();
      formData.append('preferredRole', preferredRole);
      formData.append('preferredLocation', preferredLocation);
      if (resumeFile) formData.append('resume', resumeFile);

      const result = await jobApplicationService.searchJobs(formData);
      setLiveJobs(result.jobs || []);
      setCurrentStep(2);
      toast.success(`Found ${result.jobs?.length || 0} live matching jobs!`, { id: toastId });
    } catch (err) {
      toast.error('Failed to search jobs. Please try again.', { id: toastId });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setCurrentStep(3);
    toast.success(`Selected job: ${job.title} at ${job.company}`);
  };

  const handlePrepareApplication = async () => {
    if (!selectedJob) return;

    setIsPreparing(true);
    const toastId = toast.loading('Coordinating AI Email & Document Generator Agents...');

    try {
      const payload = {
        fullName,
        email,
        phone,
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        preferredRole,
        preferredLocation,
        additionalNotes,
        targetJob: selectedJob
      };

      const result = await jobApplicationService.prepareApplication(payload);
      setPreparedData(result);
      setEditableSubject(result.emailSubject || '');
      setEditableBody(result.emailBody || '');
      setCurrentStep(4);
      toast.success('Generated email & cover letter attachments!', { id: toastId });
    } catch (err) {
      toast.error('Application preparation failed.', { id: toastId });
    } finally {
      setIsPreparing(false);
    }
  };

  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);

  const handleContinueToEmailAgent = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Transferring application to AI Email Agent...');

    try {
      const candidateName = fullName || 'Candidate';
      const company = selectedJob?.company || 'Target Enterprise';
      const role = selectedJob?.title || preferredRole || 'Software Engineer';
      const demoRecipient = 'mahaaswin.sb2024it@sece.ac.in';
      const appId = preparedData?.id || `APP-${Date.now()}`;

      const transferData = {
        fromJobApplication: true,
        applicationId: appId,
        recipient: demoRecipient,
        subject: editableSubject,
        body: editableBody,
        companyName: company,
        jobRole: role,
        attachments: [
          {
            name: `CoverLetter_${company.replace(/\s+/g, '')}.pdf`,
            size: 'PDF Document',
            type: 'application/pdf'
          },
          {
            name: `Resume_${candidateName.replace(/\s+/g, '')}.pdf`,
            size: 'PDF Document',
            type: 'application/pdf'
          }
        ]
      };

      // Record prepared application entry in history
      try {
        await jobApplicationService.submitApplication({
          fullName,
          email,
          phone,
          targetJob: selectedJob,
          emailSubject: editableSubject,
          emailBody: editableBody,
          matchPercentage: preparedData?.matchPercentage || selectedJob?.matchPercentage || 90
        });
        await fetchHistory();
      } catch (err) {
        console.warn('[JobApplication] History record notice:', err?.message);
      }

      toast.success('Transferred to AI Email Agent!', { id: toastId });
      navigate('/email-agent', { state: transferData });
    } catch (err) {
      toast.error('Failed to transfer data to Email Agent.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      {/* Top Header Banner Card */}
      <div className="bg-[#1B1E25] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(232,180,93,0.14)] border border-[#E8B45D]/30 text-[#E8B45D] text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            AI JOB APPLICATION AGENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-[#E8B45D]" />
            <span>AI Job Application Agent</span>
          </h1>
          <p className="text-[#C6C9D1] text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
            Automates job searching, AI match scoring, application email drafting, cover letter PDF generation, and HR email dispatch in one unified workflow.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep(5)}
          className="btn-secondary px-4 py-2.5 text-xs flex items-center gap-2 shrink-0 self-start md:self-auto shadow-sm"
        >
          <Clock className="w-4 h-4 text-[#E8B45D]" />
          <span>Application History ({historyList.length})</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-[#1B1E25] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between overflow-x-auto gap-4 py-1">
          {[
            { step: 1, label: 'Candidate & Role' },
            { step: 2, label: 'Search Live Jobs' },
            { step: 3, label: 'AI Match Analysis' },
            { step: 4, label: 'Email & Docs Preview' },
            { step: 5, label: 'History & Status' }
          ].map(s => (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-2.5 cursor-pointer shrink-0 transition-all ${currentStep === s.step ? 'text-[#E8B45D] font-bold' : currentStep > s.step ? 'text-[#C6C9D1] font-medium' : 'text-[#868C99] font-normal'}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === s.step ? 'bg-[#E8B45D] text-[#14161B] shadow-sm' : currentStep > s.step ? 'bg-[rgba(87,181,168,0.14)] text-[#57B5A8] border border-[#57B5A8]/30' : 'bg-[#242832] text-[#868C99] border border-white/10'}`}>
                {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
              </span>
              <span className="text-xs">{s.label}</span>
              {s.step < 5 && <ChevronRight className="w-4 h-4 text-white/20 ml-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: USER INPUT FORM */}
      {currentStep === 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" /> Candidate Profile & Preferred Job Target
            </h2>
            <p className="text-xs text-slate-400 mt-1">Provide your contact details and target position to query live jobs and generate custom application assets.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Preferred Job Role *</label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Preferred Location *</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. India / Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Portfolio URL (Optional)</label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">GitHub URL (Optional)</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">LinkedIn URL (Optional)</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Resume Upload Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Resume Upload (PDF or DOCX)</label>
            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 text-center transition bg-slate-950 flex flex-col items-center justify-center gap-2">
              <Upload className="w-6 h-6 text-emerald-400" />
              <div className="text-xs text-slate-300">
                {resumeFile ? <span className="text-emerald-400 font-bold">{resumeFile.name}</span> : 'Click or drop PDF / DOCX resume file'}
              </div>
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleResumeChange} className="hidden" id="resumeUploadInput" />
              <label htmlFor="resumeUploadInput" className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 text-[11px] font-bold cursor-pointer hover:bg-emerald-600/30">
                {resumeFile ? 'Change Resume' : 'Select Resume File'}
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Additional Notes (Optional)</label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSearchJobs}
              disabled={isSearching}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Live Jobs via AI Career Intelligence Agent</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: LIVE JOBS SELECTION */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div>
              <h2 className="text-sm font-bold text-white">Live Adzuna Jobs ({liveJobs.length})</h2>
              <p className="text-xs text-slate-400">Target Role: {preferredRole} | Location: {preferredLocation}</p>
            </div>
            <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-slate-400 hover:text-white">
              Edit Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 space-y-3 transition flex flex-col justify-between ${selectedJob?.id === job.id ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'}`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{job.title}</h3>
                      <p className="text-xs text-emerald-400 font-semibold">{job.company}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {job.matchPercentage}% Match
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>✉️ {job.hrEmail}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.matchedSkills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800/80 mt-3">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    View Original Listing <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleSelectJob(job)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Select Job Target
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: AI MATCH RECOMMENDATIONS */}
      {currentStep === 3 && selectedJob && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> AI Compatibility & Resume Optimization Insights
              </h2>
              <p className="text-xs text-slate-400 mt-1">Selected Job: <span className="text-emerald-400 font-bold">{selectedJob.title}</span> at {selectedJob.company}</p>
            </div>
            <span className="text-2xl font-black text-emerald-400">{selectedJob.matchPercentage}%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase">Matched Skills ({selectedJob.matchedSkills?.length || 3})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.matchedSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase">Skill Gaps to Emphasize ({selectedJob.missingSkills?.length || 2})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.missingSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold">
                    ! {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-2">
            <h4 className="font-bold flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Application Confidence Score: 92%
            </h4>
            <p>Your resume matches high-priority requirements for {selectedJob.company}. Moving forward will trigger the AI Email Agent and AI Document Generator Agent to generate tailored application assets.</p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button onClick={() => setCurrentStep(2)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
              Back to Job List
            </button>

            <button
              onClick={handlePrepareApplication}
              disabled={isPreparing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition"
            >
              {isPreparing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-200" />}
              <span>Generate Email & Cover Letter Attachments</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: EMAIL & DOCUMENT PREVIEW */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 7 Cols: Email Editor */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> Tailored HR Application Email (AI Email Agent)
              </h2>
              <span className="text-[10px] text-slate-500">Recipient: {selectedJob?.hrEmail}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Subject Line</label>
              <input
                type="text"
                value={editableSubject}
                onChange={(e) => setEditableSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Email Body</label>
              <textarea
                rows={12}
                value={editableBody}
                onChange={(e) => setEditableBody(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Right 5 Cols: Auto-Generated Document Attachments */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-400" /> Auto-Generated Attachments (AI Document Generator)
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-rose-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">CoverLetter_{selectedJob?.company?.replace(/\s+/g, '')}.pdf</h4>
                      <p className="text-[10px] text-slate-400">Formatted Cover Letter PDF</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">PDF Attached</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Resume_{fullName?.replace(/\s+/g, '')}.pdf</h4>
                      <p className="text-[10px] text-slate-400">Candidate Resume PDF</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">PDF Attached</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleContinueToEmailAgent}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-emerald-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-emerald-200" />}
                  <span>Continue to Email Agent →</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 5: APPLICATION HISTORY TABLE */}
      {currentStep === 5 && (
        <div className="space-y-6">
          
          {/* Delivery Confirmation Card */}
          {submissionSuccess && (
            <div className="bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-white">✓ Application Submitted Successfully</h3>
                  <p className="text-xs text-emerald-300">All application documents have been delivered to the configured demo HR mailbox.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Demo HR Recipient</span>
                  <span className="font-bold text-emerald-300 font-mono text-[11px]">{lastSubmissionResult?.recipient || 'mahaaswin.sb2024it@sece.ac.in'}</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Delivery Time</span>
                  <span className="font-bold text-slate-200">{lastSubmissionResult?.deliveryTime || new Date().toLocaleTimeString()}</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Delivery Status</span>
                  <span className="font-bold text-emerald-400 uppercase">✓ Delivered</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Message ID</span>
                  <span className="font-bold text-slate-300 font-mono text-[10px] truncate block">{lastSubmissionResult?.messageId || '<msg-demo@taskpilot.ai>'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" /> Application History & Delivery Tracker
                </h2>
                <p className="text-xs text-slate-400 mt-1">Track every job application submitted via TaskPilot AI.</p>
              </div>

              <button onClick={() => { setSubmissionSuccess(false); setCurrentStep(1); }} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition">
                + Apply for Another Job
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by company or role..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="under review">Under Review</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">App ID</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Demo HR Recipient</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Message ID</th>
                    <th className="py-3 px-4">Match %</th>
                    <th className="py-3 px-4">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {historyList.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{item.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{item.company}</div>
                        <div className="text-[11px] text-emerald-400">{item.role}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-300">{item.hrEmail || 'mahaaswin.sb2024it@sece.ac.in'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(item.appliedDate).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{item.messageId || `<msg-${item.id}@taskpilot.ai>`}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{item.matchPercentage}%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {item.deliveryStatus || item.status || 'Delivered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default JobApplication;
