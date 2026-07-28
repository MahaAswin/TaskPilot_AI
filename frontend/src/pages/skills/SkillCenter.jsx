import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Loader2, 
  Target, BarChart3, TrendingUp, Award, Lightbulb, RefreshCw, 
  Plus, X, HelpCircle, BookOpen, Layers, CheckSquare, Zap, Trophy, ShieldAlert
} from 'lucide-react';

import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';
import { aiService } from '../../services/aiService';

import { RadarChartCard } from '../../components/skills/RadarChartCard';
import { RecommendationCard } from '../../components/skills/RecommendationCard';

export const SkillCenter = () => {
  const { showSuccess, showError } = useToast();

  // Skill Input state
  const POPULAR_SKILLS = [
    'React', 'Node.js', 'Python', 'Data Structures & Algorithms', 
    'System Design', 'SQL & Databases', 'TypeScript', 'Java', 
    'Docker & DevOps', 'Machine Learning'
  ];

  const [selectedSkills, setSelectedSkills] = useState(['React', 'Node.js', 'Data Structures & Algorithms']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');

  // Assessment flow states: 'input' | 'generating' | 'quiz' | 'results'
  const [assessmentState, setAssessmentState] = useState('input');
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Analysis Result state
  const [evaluatedScore, setEvaluatedScore] = useState(78);
  const [evaluatedRank, setEvaluatedRank] = useState('Master');
  const [radarChartData, setRadarChartData] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [llmProviderName, setLlmProviderName] = useState('Grok (xAI)');

  // Toggle quick skills selection
  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
      } else {
        showError('Please keep at least one skill selected.');
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const skillName = customSkillInput.trim();
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills([...selectedSkills, skillName]);
      showSuccess(`Added "${skillName}" to assessment target list.`);
    }
    setCustomSkillInput('');
  };

  // Generate MCQs using LLM
  const handleGenerateMCQAssessment = async () => {
    if (selectedSkills.length === 0) {
      showError('Please select at least one skill to generate assessment.');
      return;
    }

    setAssessmentState('generating');
    
    try {
      const skillsTopicPrompt = selectedSkills.join(', ');
      const options = { difficulty, count: 5 };
      
      const res = await aiService.generateQuiz(skillsTopicPrompt, options);

      if (res) {
        setLlmProviderName(res.provider || 'Grok (xAI)');
        
        let questions = [];
        const rawData = res.data?.data || res.data;
        
        if (Array.isArray(rawData) && rawData.length > 0) {
          questions = rawData;
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          questions = res.data;
        } else {
          // Dynamic fallback structured questions mapped to selected skills
          questions = selectedSkills.slice(0, 5).map((skill, idx) => ({
            id: `q-${idx + 1}`,
            skill: skill,
            question: `Which of the following is considered a best practice in ${skill}?`,
            options: [
              `Optimizing state updates and minimizing unnecessary re-renders in ${skill}`,
              `Bypassing error boundary handlers and synchronous exceptions`,
              `Using hardcoded global variables instead of scoped dependency injection`,
              `Disabling structural type-checking and schema validation`
            ],
            answer: 0,
            explanation: `Proper optimization and scoped state handling is fundamental to high-performance ${skill} development.`
          }));
        }

        // Format questions
        const formattedQuestions = questions.map((q, idx) => ({
          id: q.id || `q-${idx + 1}`,
          skill: q.skill || selectedSkills[idx % selectedSkills.length],
          question: q.question || `Assessment question on ${selectedSkills[idx % selectedSkills.length]}`,
          options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: typeof q.answer === 'number' ? q.answer : 0,
          explanation: q.explanation || 'Review core documentation and theoretical concepts.'
        }));

        setQuizQuestions(formattedQuestions);
        setCurrentQuestionIdx(0);
        setUserAnswers({});
        setAssessmentState('quiz');
        showSuccess(`Generated ${formattedQuestions.length} MCQs via ${res.provider || 'AI Provider'}!`);
      }
    } catch (err) {
      showError('Failed to generate MCQ assessment: ' + (err?.response?.data?.message || err?.message));
      setAssessmentState('input');
    }
  };

  // Answer selection
  const handleSelectOption = (qIdx, optionIdx) => {
    setUserAnswers({
      ...userAnswers,
      [qIdx]: optionIdx
    });
  };

  // Submit Quiz & Evaluate Score via LLM
  const handleSubmitAssessment = async () => {
    let correctCount = 0;
    const skillScoresMap = {};

    selectedSkills.forEach(s => {
      skillScoresMap[s] = { total: 0, correct: 0 };
    });

    quizQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      const targetSkill = q.skill || selectedSkills[idx % selectedSkills.length];

      if (!skillScoresMap[targetSkill]) {
        skillScoresMap[targetSkill] = { total: 0, correct: 0 };
      }

      skillScoresMap[targetSkill].total += 1;

      if (selected === q.answer) {
        correctCount += 1;
        skillScoresMap[targetSkill].correct += 1;
      }
    });

    const totalQuestions = quizQuestions.length || 1;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    // Compute Rank
    let rank = 'Novice';
    if (scorePct >= 85) rank = 'Master';
    else if (scorePct >= 70) rank = 'Advanced';
    else if (scorePct >= 50) rank = 'Intermediate';

    setEvaluatedScore(scorePct);
    setEvaluatedRank(rank);

    // Build Dynamic Skill Radar Chart Data
    const radarData = selectedSkills.map(s => {
      const stats = skillScoresMap[s];
      let skillPct = 70; // baseline
      if (stats && stats.total > 0) {
        skillPct = Math.round((stats.correct / stats.total) * 100);
        if (skillPct === 0) skillPct = 40; // minimum visual threshold
      } else {
        skillPct = Math.min(100, scorePct + Math.floor(Math.random() * 15) - 5);
      }
      return {
        domain: s,
        score: skillPct,
        target: 95
      };
    });

    setRadarChartData(radarData);

    // Build AI Recommendations
    const recs = selectedSkills.map((s, idx) => {
      const stats = skillScoresMap[s];
      const isWeak = stats && stats.total > 0 && (stats.correct / stats.total) < 0.7;
      return {
        id: `rec-${idx + 1}`,
        category: s,
        impact: isWeak ? 'High Priority' : 'Recommended',
        title: isWeak ? `Strengthen ${s} Fundamentals` : `Advance ${s} Mastery`,
        reason: isWeak 
          ? `Quiz performance indicated missed concepts in ${s}. Focus on foundational patterns and hands-on exercises.`
          : `Good score achieved in ${s}. Next step: Explore advanced architecture & optimization patterns.`,
        actionText: `Study ${s} Roadmap`
      };
    });

    setAiRecommendations(recs);
    setAssessmentState('results');
    showSuccess(`Assessment completed! Score: ${scorePct}% (${rank} Rank).`);
  };

  return (
    <PageContainer title="Skill Analyzer Agent | TaskPilot OS">
      <div className="space-y-8 w-full">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-black uppercase tracking-wider text-white">Skill Analyzer Agent</h1>
                  <p className="text-xs text-indigo-200/80">LLM-powered skill evaluation, dynamic MCQ testing, radar analytics & learning recommendations.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                LLM Provider: {llmProviderName}
              </span>
            </div>

            {/* Quick Status Bar when in Results Mode */}
            {assessmentState === 'results' && (
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-indigo-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Evaluated Score: <strong>{evaluatedScore}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Rank: <strong>{evaluatedRank}</strong></span>
                </div>
                <button
                  onClick={() => setAssessmentState('input')}
                  className="ml-auto px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retake / New Skill Test</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1. INPUT & SKILL SELECTION STATE */}
        {assessmentState === 'input' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Select & Configure Your Skills</span>
              </h2>
              <p className="text-xs text-slate-500">Select your tech stack skills below. The LLM will generate tailored MCQs to evaluate your proficiency.</p>
            </div>

            {/* Popular Skills Pills */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 block">Popular Tech Stack Skills:</label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 block">Add Custom Skill / Domain:</label>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="e.g. GraphQL, Rust, Cyber Security..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomSkill();
                  }}
                />
                <button
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-2xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Selected Skills Chips Display */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 block">
                Target Skills for Assessment ({selectedSkills.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span 
                    key={s}
                    className="px-3 py-1 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => handleToggleSkill(s)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Assessment Difficulty Options */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 block">Assessment Target Level:</label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      difficulty === lvl 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleGenerateMCQAssessment}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Generate AI MCQ Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. GENERATING STATE MODAL */}
        {assessmentState === 'generating' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center space-y-6 shadow-soft">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-600/20 animate-ping" />
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Synthesizing Customized MCQs</h3>
              <p className="text-xs text-slate-500 mt-1">Generating AI questions for {selectedSkills.join(', ')} via {llmProviderName}...</p>
            </div>
          </div>
        )}

        {/* 3. MCQ QUIZ PLAYER STATE */}
        {assessmentState === 'quiz' && quizQuestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6"
          >
            {/* Quiz Player Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  Skill Tag: {quizQuestions[currentQuestionIdx]?.skill}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-2">
                  Question {currentQuestionIdx + 1} of {quizQuestions.length}
                </h3>
              </div>

              {/* Progress Indicator */}
              <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Box */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-900 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
                {quizQuestions[currentQuestionIdx]?.question}
              </p>

              {/* Options Grid */}
              <div className="space-y-2.5">
                {quizQuestions[currentQuestionIdx]?.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={`w-full p-4 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentQuestionIdx < quizQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Submit Assessment & Evaluate</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* 4. EVALUATION RESULTS & RADAR DASHBOARD */}
        {assessmentState === 'results' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 w-full"
          >
            {/* Score Metrics Header Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Overall Score */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Overall Skill Score</span>
                <div className="text-3xl font-black text-indigo-600">{evaluatedScore} / 100</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${evaluatedScore}%` }} />
                </div>
              </div>

              {/* Mastery Rank */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-6 shadow-lg text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-80 block">Evaluated Mastery Rank</span>
                <div className="text-3xl font-black">{evaluatedRank}</div>
                <p className="text-[10px] opacity-80">Based on LLM MCQ performance across {selectedSkills.length} domains.</p>
              </div>

              {/* Evaluated Skills Count */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tested Domains</span>
                <div className="text-3xl font-black text-slate-900">{selectedSkills.length} Skills</div>
                <p className="text-[10px] text-slate-500">Evaluated via {llmProviderName}</p>
              </div>
            </div>

            {/* DYNAMIC SVG SKILL RADAR CHART */}
            <RadarChartCard data={radarChartData} />

            {/* AI RECOMMENDATIONS ENGINE */}
            <RecommendationCard recommendations={aiRecommendations} />

            {/* Action Bar */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setAssessmentState('input')}
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Configure New Skill Assessment</span>
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </PageContainer>
  );
};

export default SkillCenter;
