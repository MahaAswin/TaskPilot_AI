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
  const [llmProviderName, setLlmProviderName] = useState('TaskPilot Assessment Engine');

  // Comprehensive Bank of Default MCQs for instant loading
  const getDefaultMCQsForSkills = (skills, diff = 'Intermediate') => {
    const defaultBank = {
      'React': [
        {
          id: 'react-1',
          skill: 'React',
          question: 'Which React hook is used for performing side effects in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          answer: 0,
          explanation: 'useEffect is the standard React hook designed for handling side effects like data fetching and DOM mutations.'
        },
        {
          id: 'react-2',
          skill: 'React',
          question: 'What is the primary benefit of the React Virtual DOM?',
          options: [
            'Minimizes real DOM manipulation by computing diffs in memory',
            'Directly connects React components to backend databases',
            'Replaces CSS stylesheets with inline JS objects',
            'Bypasses JavaScript execution entirely'
          ],
          answer: 0,
          explanation: 'The Virtual DOM creates an in-memory representation to compute minimal UI diffs before updating the real DOM.'
        }
      ],
      'Node.js': [
        {
          id: 'node-1',
          skill: 'Node.js',
          question: 'Which mechanism in Node.js handles non-blocking asynchronous I/O operations?',
          options: ['Event Loop & libuv thread pool', 'Synchronous file descriptors', 'Thread locking system', 'Multi-process socket pipeline'],
          answer: 0,
          explanation: 'Node.js relies on a single-threaded Event Loop backed by libuv to execute non-blocking asynchronous I/O.'
        },
        {
          id: 'node-2',
          skill: 'Node.js',
          question: 'What is the purpose of package.json in a Node.js project?',
          options: ['Stores project metadata, scripts, and dependency declarations', 'Executes Linux OS kernel binaries', 'Configures database indexes', 'Compiles C++ native modules'],
          answer: 0,
          explanation: 'package.json contains project configuration, dependencies, and npm run script definitions.'
        }
      ],
      'Data Structures & Algorithms': [
        {
          id: 'dsa-1',
          skill: 'Data Structures & Algorithms',
          question: 'What is the average time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
          options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
          answer: 0,
          explanation: 'A balanced BST maintains logarithmic height, guaranteeing O(log n) search, insertion, and deletion complexity.'
        },
        {
          id: 'dsa-2',
          skill: 'Data Structures & Algorithms',
          question: 'Which algorithmic paradigm does Merge Sort utilize?',
          options: ['Divide and Conquer', 'Greedy Choice', 'Dynamic Programming', 'Backtracking'],
          answer: 0,
          explanation: 'Merge Sort recursively breaks arrays into halves, sorts them, and merges the sorted halves using Divide and Conquer.'
        }
      ],
      'System Design': [
        {
          id: 'sys-1',
          skill: 'System Design',
          question: 'Which component distributes incoming user traffic across multiple backend application servers?',
          options: ['Load Balancer', 'Database Shard', 'Garbage Collector', 'Reverse DNS Proxy'],
          answer: 0,
          explanation: 'Load balancers distribute traffic across multiple nodes to maximize throughput, minimize latency, and ensure fault tolerance.'
        }
      ],
      'Python': [
        {
          id: 'py-1',
          skill: 'Python',
          question: 'What is the primary feature of Python list comprehensions?',
          options: ['Constructs new lists from iterables in a single concise line', 'Deletes unused global variables', 'Compiles Python bytecode to C', 'Enforces static type constraints'],
          answer: 0,
          explanation: 'List comprehensions provide a compact, expressive syntax for creating new lists based on existing iterables.'
        }
      ],
      'SQL & Databases': [
        {
          id: 'sql-1',
          skill: 'SQL & Databases',
          question: 'Which SQL clause is used to filter individual records before any GROUP BY aggregations take place?',
          options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
          answer: 0,
          explanation: 'WHERE filters individual rows prior to grouping, while HAVING filters aggregated group results after grouping.'
        }
      ]
    };

    let questions = [];
    skills.forEach(skill => {
      if (defaultBank[skill]) {
        questions.push(...defaultBank[skill]);
      } else {
        questions.push({
          id: `custom-${skill}-1`,
          skill: skill,
          question: `Which of the following represents a core engineering best practice in ${skill}?`,
          options: [
            `Writing modular, testable code with clean exception handling in ${skill}`,
            `Hardcoding secret tokens directly into source files`,
            `Disabling automated test suites before deploying to production`,
            `Bypassing version control and code review workflows`
          ],
          answer: 0,
          explanation: `Modular architecture, clean error handling, and robust testing are essential for professional ${skill} development.`
        });
      }
    });

    return questions.slice(0, 5);
  };

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

  // Generate MCQs using instant default fallback or fast API response
  const handleGenerateMCQAssessment = async () => {
    if (selectedSkills.length === 0) {
      showError('Please select at least one skill to generate assessment.');
      return;
    }

    setAssessmentState('generating');
    
    // Prepare default instant questions
    const defaultQuestions = getDefaultMCQsForSkills(selectedSkills, difficulty);

    try {
      const skillsTopicPrompt = selectedSkills.join(', ');
      const options = { difficulty, count: 5 };
      
      // Fast Promise.race with 1-second timeout to prevent any loading delay
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1000));
      
      const res = await Promise.race([
        aiService.generateQuiz(skillsTopicPrompt, options).catch(() => null),
        timeoutPromise
      ]);

      let questions = [];
      if (res) {
        setLlmProviderName(res.provider || 'TaskPilot Assessment Engine');
        const rawData = res.data?.data || res.data;
        if (Array.isArray(rawData) && rawData.length > 0) {
          questions = rawData;
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          questions = res.data;
        }
      }

      if (!questions || questions.length === 0) {
        setLlmProviderName('TaskPilot Assessment Engine (Default)');
        questions = defaultQuestions;
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
      showSuccess(`Loaded ${formattedQuestions.length} skill assessment MCQs!`);
    } catch (err) {
      setLlmProviderName('TaskPilot Assessment Engine (Default)');
      setQuizQuestions(defaultQuestions);
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setAssessmentState('quiz');
      showSuccess(`Loaded skill assessment MCQs!`);
    }
  };

  // Answer selection
  const handleSelectOption = (qIdx, optionIdx) => {
    setUserAnswers({
      ...userAnswers,
      [qIdx]: optionIdx
    });
  };

  // Submit Quiz & Evaluate Score
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
      let skillPct = 70;
      if (stats && stats.total > 0) {
        skillPct = Math.round((stats.correct / stats.total) * 100);
        if (skillPct === 0) skillPct = 40;
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
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
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
          </div>
        </div>

        {/* ASSESSMENT STEP 1: INPUT & SKILL SELECTION */}
        {assessmentState === 'input' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>Configure Skill Assessment Targets</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Select the technical domains you want to test and benchmark.</p>
              </div>

              {/* Popular Skills Selection Chips */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Popular Skill Domains:</label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Skill Input */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Add Custom Skill or Framework:</label>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSkill(); }}
                    placeholder="e.g. Next.js, Kubernetes, GraphQL..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    onClick={handleAddCustomSkill}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Difficulty Selector & Launch Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Target Difficulty:</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                    {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          difficulty === d 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateMCQAssessment}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Skill Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ASSESSMENT STEP 2: GENERATING SPINNER */}
        {assessmentState === 'generating' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-16 text-center shadow-soft space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto shadow-inner">
              <Brain className="w-8 h-8 text-indigo-600 animate-bounce" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Synthesizing Customized MCQs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generating skill assessment questions for {selectedSkills.join(', ')}...
              </p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          </div>
        )}

        {/* ASSESSMENT STEP 3: INTERACTIVE MCQ QUIZ */}
        {assessmentState === 'quiz' && quizQuestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
              
              {/* Question Progress Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-black uppercase">
                    Question {currentQuestionIdx + 1} of {quizQuestions.length}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">
                    Domain: {quizQuestions[currentQuestionIdx]?.skill}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {Math.round(((currentQuestionIdx + 1) / quizQuestions.length) * 100)}% Complete
                </span>
              </div>

              {/* Question Body */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {quizQuestions[currentQuestionIdx]?.question}
                </h3>

                {/* MCQ Options List */}
                <div className="space-y-3 pt-2">
                  {quizQuestions[currentQuestionIdx]?.options.map((optionText, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                        className={`w-full p-4 rounded-2xl text-xs font-semibold border transition-all text-left flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 font-bold shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-500 bg-white'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="flex-1 leading-relaxed">{optionText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIdx < quizQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitAssessment}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Submit & Evaluate Assessment</span>
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* ASSESSMENT STEP 4: RADAR ANALYTICS & AI RECOMMENDATIONS */}
        {assessmentState === 'results' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 w-full"
          >
            {/* Score & Rank Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-500/20 pb-4 gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
                    Evaluation Complete
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-400" />
                    Skill Proficiency Evaluation Results
                  </h2>
                </div>

                <button
                  onClick={() => setAssessmentState('input')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-Take Assessment</span>
                </button>
              </div>

              {/* Score Badges Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Overall Score</span>
                  <div className="text-3xl font-black text-white">{evaluatedScore}%</div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Proficiency Rank</span>
                  <div className="text-2xl font-black text-emerald-400">{evaluatedRank}</div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Evaluated Domains</span>
                  <div className="text-2xl font-black text-indigo-300">{selectedSkills.length} Skills</div>
                </div>
              </div>
            </div>

            {/* Radar Chart & Recommendations Viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
              
              {/* Left 6 Columns: Radar Chart Component */}
              <div className="lg:col-span-6 w-full">
                <RadarChartCard 
                  data={radarChartData} 
                  overallScore={evaluatedScore} 
                  evaluatedRank={evaluatedRank} 
                />
              </div>

              {/* Right 6 Columns: AI Skill Recommendations */}
              <div className="lg:col-span-6 space-y-4 w-full">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    <span>AI Learning Recommendations ({aiRecommendations.length})</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {aiRecommendations.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </PageContainer>
  );
};

export default SkillCenter;
