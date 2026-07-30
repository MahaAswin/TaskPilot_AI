import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Sparkles, Upload, FileText, CheckCircle2, AlertTriangle, 
  MapPin, DollarSign, TrendingUp, Award, Layers, Search, Bookmark, 
  ExternalLink, Copy, RefreshCw, ArrowRight, ShieldCheck, UserCheck, 
  BookOpen, Plus, X, Star, ChevronRight, GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageContainer from '../../components/common/PageContainer';
import { careerService } from '../../services/careerService';

export const CareerIntelligence = () => {
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'upload'
  const [resumeText, setResumeText] = useState(
    'Name: Alex Mercer\nEmail: alex.mercer@dev.io\nPhone: +91 98765 43210\nEducation: B.Tech Computer Science & Engineering\nExperience: Fresher (0-1 Yrs Experience)\n\nSkills: Java, Spring Boot, REST APIs, SQL, Git, HTML, CSS\n\nProjects:\n1. E-Commerce Microservices Platform with Spring Boot and PostgreSQL\n2. AI Task Manager Application using React & Node.js\n\nGitHub: https://github.com/alexmercer\nLinkedIn: https://linkedin.com/in/alexmercer'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [role, setRole] = useState('Backend Developer');
  const [location, setLocation] = useState('Bangalore');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [skillTags, setSkillTags] = useState(['Java', 'Spring Boot', 'SQL', 'REST APIs']);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'salary'

  // Cover Letter Modal State
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false);
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);



  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newSkillInput.trim() && !skillTags.includes(newSkillInput.trim())) {
        setSkillTags([...skillTags, newSkillInput.trim()]);
        setNewSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillTags(skillTags.filter(s => s !== skillToRemove));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const toastId = toast.loading('Parsing resume, searching Adzuna jobs & building career roadmap...');

    try {
      let data;
      const extraPayload = {
        manualSkills: skillTags,
        role,
        location,
        experienceLevel,
        employmentType
      };

      if (inputMode === 'upload' && selectedFile) {
        data = await careerService.analyzeResumeFile(selectedFile, extraPayload);
      } else {
        data = await careerService.analyzeProfile({
          resumeText,
          ...extraPayload
        });
      }

      setReport(data);
      toast.success('Career Intelligence Analysis Complete!', { id: toastId });
    } catch (error) {
      toast.error(error.message || 'Analysis failed.', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleSaveJob = (jobId) => {
    const next = new Set(savedJobIds);
    if (next.has(jobId)) {
      next.delete(jobId);
      toast.success('Job removed from saved items.');
    } else {
      next.add(jobId);
      toast.success('Job saved to saved list!');
    }
    setSavedJobIds(next);
  };

  const handleOpenCoverLetterModal = async (job) => {
    setTargetJobTitle(job.title);
    setTargetCompany(job.company);
    setCoverLetterModalOpen(true);
    setIsGeneratingCoverLetter(true);

    try {
      const res = await careerService.generateCoverLetter({
        jobTitle: job.title,
        company: job.company,
        skills: report?.profileAnalysis?.primarySkills?.join(', '),
        experience: report?.resume?.experience
      });
      setCoverLetterText(res.coverLetter);
    } catch (e) {
      toast.error('Failed to generate cover letter.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const content = `====================================================
TASKPILOT AI CAREER INTELLIGENCE REPORT
====================================================
Candidate: ${report.resume?.name} (${report.resume?.email})
Target Role: ${role} | Location: ${location}
Overall Career Score: ${report.scores?.overallCareerScore} / 100 (${report.scores?.category})
ATS Resume Score: ${report.scores?.atsScore} / 100
Interview Readiness: ${report.interviewReadiness?.score}%

PRIMARY SKILLS:
${report.profileAnalysis?.primarySkills?.join(', ') || 'None'}

RANKED MISSING SKILLS:
${report.missingSkillsRanked?.join(', ') || 'None'}

LEARNING ROADMAP:
${report.learningRoadmap?.map((step, i) => `Step ${i + 1}: ${step}`).join('\n') || 'None'}

RECOMMENDED JOBS:
${report.jobs?.slice(0, 5).map(j => `- ${j.title} at ${j.company} (Match: ${j.matchPercentage}%)`).join('\n') || 'None'}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Career_Report_${role.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Career Report downloaded!');
  };

  // Filter / Sort Jobs
  const getSortedJobs = () => {
    if (!report?.jobs) return [];
    const list = [...report.jobs];
    if (sortBy === 'salary') {
      return list.sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
    }
    return list.sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  return (
    <PageContainer>
      {/* SaaS Hero Header Card */}
      <div className="bg-[#1B1E25] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(232,180,93,0.14)] border border-[#E8B45D]/30 text-[#E8B45D] text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            AI CAREER INTELLIGENCE AGENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-[#E8B45D]" />
            <span>AI Career Intelligence</span>
          </h1>
          <p className="text-[#C6C9D1] text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
            AI Career Advisor analyzing your resume and skills against live job listings from the Adzuna API to calculate job compatibility, identify skill gaps, and generate your career roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {report && (
            <button
              onClick={handleDownloadReport}
              className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2 shadow-sm text-[#14161B]"
            >
              <Award className="w-4 h-4 text-[#14161B]" />
              <span>Download Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout: Controls on Left (4 Cols), Career Dashboard on Right (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & Input (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1B1E25] border border-white/10 rounded-2xl p-5 shadow-xl space-y-5">
            
            {/* Input Mode Selector */}
            <div className="flex items-center gap-1 bg-[#242832] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${inputMode === 'text' ? 'bg-[#E8B45D] text-[#14161B] shadow' : 'text-[#868C99] hover:text-[#ECEAE3]'}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Resume</span>
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${inputMode === 'upload' ? 'bg-[#E8B45D] text-[#14161B] shadow' : 'text-[#868C99] hover:text-[#ECEAE3]'}`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF/DOCX</span>
              </button>
            </div>

            {/* Input Body */}
            {inputMode === 'text' ? (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#C6C9D1]">Paste Resume / Profile Text</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste complete resume or experience text here..."
                  rows={8}
                  className="w-full p-3.5 rounded-xl bg-[#242832] border border-white/10 text-xs text-[#ECEAE3] placeholder-[#868C99] focus:outline-none focus:border-[#E8B45D] font-sans leading-relaxed resize-none"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 hover:border-[#E8B45D]/60 rounded-2xl p-6 bg-[#242832] transition cursor-pointer text-center space-y-2">
                <Upload className="w-8 h-8 text-[#57B5A8] mx-auto" />
                <p className="text-xs font-bold text-[#ECEAE3]">
                  {selectedFile ? selectedFile.name : 'Select or drag Resume PDF / DOCX'}
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                  id="resume-file-input"
                />
                <label
                  htmlFor="resume-file-input"
                  className="inline-block px-3.5 py-1.5 rounded-xl bg-[rgba(87,181,168,0.14)] hover:bg-[#57B5A8]/30 text-[#57B5A8] text-xs font-bold cursor-pointer transition border border-[#57B5A8]/30"
                >
                  Browse File
                </label>
              </div>
            )}

            {/* Career Target Filters */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Job Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Experience</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="Internship">Internship</option>
                    <option value="Junior">Junior (1-3 Yrs)</option>
                    <option value="Senior">Senior (5+ Yrs)</option>
                  </select>
                </div>
              </div>

              {/* Skill Tag Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Manual Skill Tags</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Add skill (e.g. Docker, React)"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skillTags.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Adzuna Jobs & Matching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Analyze Career & Search Jobs</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Dashboard Results (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {!report ? (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <Briefcase className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-white">AI Career Advisor Standby</h3>
                <p className="text-xs text-slate-400">
                  Upload a resume or enter target skills to analyze profile compatibility against live Adzuna jobs, identify skill gaps, and generate your career roadmap.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Career Scores Ring & Gauge Header */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Career Score</span>
                    <span className="text-2xl font-black text-emerald-400">{report.scores?.overallCareerScore} / 100</span>
                    <span className="block text-[10px] text-emerald-300 font-bold">{report.scores?.category}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ATS Resume Score</span>
                    <span className="text-2xl font-black text-blue-400">{report.scores?.atsScore}%</span>
                    <span className="block text-[10px] text-blue-300 font-bold">Format Verified</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Skill Score</span>
                    <span className="text-2xl font-black text-purple-400">{report.scores?.skillScore}%</span>
                    <span className="block text-[10px] text-purple-300 font-bold">{report.profileAnalysis?.primarySkills?.length} Primary Skills</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Interview Readiness</span>
                    <span className="text-2xl font-black text-amber-400">{report.interviewReadiness?.score}%</span>
                    <span className="block text-[10px] text-amber-300 font-bold">Tech Ready</span>
                  </div>

                </div>
              </div>

              {/* Extracted Profile Details Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Extracted Candidate Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">Name:</span> <span className="font-bold text-slate-200">{report.resume?.name}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="font-mono text-emerald-400">{report.resume?.email}</span></div>
                    <div><span className="text-slate-500">Education:</span> <span className="text-slate-300">{report.resume?.education}</span></div>
                  </div>

                  <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">Experience:</span> <span className="font-semibold text-slate-200">{report.resume?.experience}</span></div>
                    <div><span className="text-slate-500">GitHub:</span> <span className="font-mono text-blue-400">{report.resume?.github}</span></div>
                    <div><span className="text-slate-500">Job Readiness:</span> <span className="font-bold text-emerald-400">{report.profileAnalysis?.jobReadiness}</span></div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Identified Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.profileAnalysis?.primarySkills?.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                        {s}
                      </span>
                    ))}
                    {report.profileAnalysis?.secondarySkills?.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary Insights Widget */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Adzuna Market Salary Insights ({role})
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-1">Average Salary</span>
                    <span className="text-sm font-bold text-emerald-400">{report.salaryInsights?.averageSalary}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-1">Min Salary</span>
                    <span className="text-sm font-bold text-slate-300">{report.salaryInsights?.minimumSalary}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-1">Max Salary</span>
                    <span className="text-sm font-bold text-blue-400">{report.salaryInsights?.maximumSalary}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Jobs Feed (Adzuna Integration) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">
                      Live Job Recommendations ({getSortedJobs().length})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Sort By:</span>
                    <button
                      onClick={() => setSortBy('match')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${sortBy === 'match' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Highest Match
                    </button>
                    <button
                      onClick={() => setSortBy('salary')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${sortBy === 'salary' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Highest Salary
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {getSortedJobs().length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                      <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 w-12 h-12 mx-auto flex items-center justify-center border border-amber-500/20">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">No Live Jobs Returned by Adzuna API</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        {report.jobStatusReason || 'No jobs found matching your search query on Adzuna. Strict Live API Policy: Simulated or placeholder jobs are strictly prohibited.'}
                      </p>
                      {!report.apiConfigured && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono inline-block">
                          Set ADZUNA_APP_ID and ADZUNA_APP_KEY in backend .env file to activate live jobs.
                        </div>
                      )}
                    </div>
                  ) : (
                    getSortedJobs().map((job) => {
                      const isSaved = savedJobIds.has(job.id);
                      return (
                        <div key={job.id} className="p-4.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition shadow-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                {job.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span className="font-semibold text-slate-300">{job.company}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {job.location}</span>
                                <span className="font-mono text-emerald-400 font-bold">{job.salaryDisplay}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                                {job.matchPercentage}% Match
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>

                          {/* "Why This Job Matches You" Card */}
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs">
                            <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">
                              Why This Job Matches You:
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed font-sans">
                              {job.matchReason}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase block">Strengths</span>
                                {job.strengths?.map((s, idx) => (
                                  <div key={idx} className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span>{s}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-amber-400 uppercase block">Weaknesses / Skill Gaps</span>
                                {job.weaknesses?.map((w, idx) => (
                                  <div key={idx} className="text-[11px] text-amber-300 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>{w}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
                            <div className="flex flex-wrap gap-1 text-[11px]">
                              <span className="text-slate-500">Matched:</span>
                              {job.matchedSkills?.map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">{s}</span>
                              ))}
                              <span className="text-slate-500 ml-2">Missing:</span>
                              {job.missingSkills?.map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold">{s}</span>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleSaveJob(job.id)}
                                className={`p-2 rounded-lg border text-xs font-bold transition ${isSaved ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
                                title="Save Job"
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>

                              <button
                                onClick={() => handleOpenCoverLetterModal(job)}
                                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition"
                              >
                                Cover Letter
                              </button>

                              <a
                                href={job.redirectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                              >
                                <span>Apply Now</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Missing Skills & Visual Learning Roadmap Timeline */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Skill Gaps & Personalized Learning Roadmap
                  </h3>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 block">Ranked Missing Skills for {role}:</span>
                  <div className="flex flex-wrap gap-2">
                    {report.missingSkillsRanked?.map((sk, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>#{i + 1} {sk}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline Roadmap Steps */}
                <div className="pt-4 space-y-3">
                  <span className="text-xs font-bold text-slate-400 block">Chronological Career Progression Roadmap:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {report.learningRoadmap?.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 relative space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">Step {idx + 1}</span>
                        <p className="text-xs font-bold text-slate-200">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* AI Advice & Interview Preparation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Actionable AI Career Advice
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {report.recommendations?.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" /> Interview Topics ({report.interviewReadiness?.score}% Ready)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {report.interviewReadiness?.recommendedTopics?.map((top, i) => (
                      <li key={i} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span>{top}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Review</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* Cover Letter Generator Modal */}
      {coverLetterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> AI Tailored Cover Letter ({targetJobTitle})
              </h3>
              <button onClick={() => setCoverLetterModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Target Company: <span className="text-emerald-400 font-bold">{targetCompany}</span></label>
              {isGeneratingCoverLetter ? (
                <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Drafting tailored cover letter...</span>
                </div>
              ) : (
                <textarea
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  rows={10}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coverLetterText);
                  toast.success('Cover letter copied to clipboard!');
                  setCoverLetterModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
              >
                Copy Cover Letter
              </button>

              <button
                onClick={() => setCoverLetterModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
};

export default CareerIntelligence;
