import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  GraduationCap, BookOpen, Star, HelpCircle, Code2, ClipboardList, 
  History, Calendar, CheckSquare, Sparkles, ChevronRight, Play, BookOpenCheck 
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

// Components Imports
import LearningStats from '../../components/learning/LearningStats';
import StudySession from '../../components/learning/StudySession';
import FlashcardDeck from '../../components/learning/FlashcardDeck';
import QuizCard from '../../components/learning/QuizCard';
import CodingPractice from '../../components/learning/CodingPractice';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';

export const Learning = () => {
  const { showSuccess, showError } = useToast();

  // Tab views state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'study' | 'flashcards' | 'quiz' | 'coding' | 'revision' | 'bookmarks' | 'history'

  // Data states
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  // loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial logs, bookmarks, and parameters
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch History
      const histRes = await axios.get('/learning/history');
      if (histRes.data?.success) {
        setHistory(histRes.data.data);
      }

      // 2. Fetch Bookmarks
      const bookRes = await axios.get('/learning/bookmarks');
      if (bookRes.data?.success) {
        setBookmarks(bookRes.data.data);
      }

      // 3. Fetch Flashcards
      const flashRes = await axios.post('/learning/flashcards', { topic: 'Biology' });
      if (flashRes.data?.success) {
        setFlashcards(flashRes.data.data);
      }

      // 4. Fetch Quizzes
      const quizRes = await axios.post('/learning/quiz', { topic: 'Biology' });
      if (quizRes.data?.success) {
        setQuizzes(quizRes.data.data);
      }

    } catch (err) {
      showError('Failed to initialize Learning Hub logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Study Session Actions
  const handleStartSession = async (topic) => {
    try {
      const res = await axios.post('/learning/start', { topic });
      if (res.data?.success) {
        setActiveSession(res.data.data);
        setActiveTab('study');
        showSuccess(`Study session started for "${topic}".`);
      }
    } catch (err) {
      showError('Failed to initialize session.');
    }
  };

  const handleToggleBookmark = async (topic) => {
    try {
      const res = await axios.post('/learning/bookmark', {
        referenceId: '60c72b2f9b1d8b23c88b4567', // Static mock ObjectId
        contentType: 'topic',
        title: topic
      });
      if (res.data?.success) {
        const { bookmarked } = res.data.data;
        showSuccess(bookmarked ? 'Topic bookmarked.' : 'Bookmark removed.');
        // Refresh bookmarks
        const bookRes = await axios.get('/learning/bookmarks');
        if (bookRes.data?.success) {
          setBookmarks(bookRes.data.data);
        }
      }
    } catch (err) {
      showError('Bookmark update failed.');
    }
  };

  // MCQ Quiz Completion Handler
  const handleQuizComplete = async (score) => {
    try {
      // Save quiz score to user history logs
      await axios.post('/learning/history', {
        activityType: 'quiz',
        topic: 'Biology Cellular Respiration',
        score
      });
      
      // Refresh history
      const histRes = await axios.get('/learning/history');
      if (histRes.data?.success) {
        setHistory(histRes.data.data);
      }
    } catch (err) {
      console.error('Failed to log history score:', err);
    }
  };

  const compileStats = () => {
    return {
      hours: '3.5h',
      topics: history.filter(h => h.activityType === 'read').length || 4,
      flashcards: flashcards.length,
      quizScore: history.filter(h => h.activityType === 'quiz').length > 0
        ? `${Math.round(history.filter(h => h.activityType === 'quiz').reduce((acc, curr) => acc + curr.score, 0) / history.filter(h => h.activityType === 'quiz').length)}%`
        : '88%',
      bookmarks: bookmarks.length,
      streak: '4 Days 🔥'
    };
  };

  const isTopicBookmarked = (topic) => {
    return bookmarks.some(b => b.contentType === 'topic' && b.title === topic);
  };

  return (
    <PageContainer>
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span>LEARNING HUB</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Transform textbook resources into interactive study sessions</p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: 'dashboard', label: 'Hub' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'quiz', label: 'MCQ Quiz' },
            { id: 'coding', label: 'Coding Practice' },
            { id: 'revision', label: 'Revision' },
            { id: 'bookmarks', label: 'Bookmarks' },
            { id: 'history', label: 'History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="large" />
      ) : (
        <div className="space-y-6">
          
          {/* Dashboard Hub View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <LearningStats stats={compileStats()} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left columns: goal & sessions */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Today's Goal and Continue Study card */}
                  <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Daily Goal checklist</span>
                      </span>
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">Review Mitochondria membranes structures</h4>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        Completing this topic adds +4 XP to your overall profile rating benchmarks.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartSession('Biology: Cellular Respiration & ATP synthase')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all uppercase tracking-wider flex items-center gap-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start session</span>
                    </button>
                  </GlassCard>

                  {/* Quick start cards grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider select-none">Learning Modules</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
                      {[
                        { label: 'Study Flashcards', desc: 'Active recall training cards', tab: 'flashcards', icon: GraduationCap },
                        { label: 'MCQ Quiz practice', desc: 'Test cellular ATP respiration concepts', tab: 'quiz', icon: HelpCircle },
                        { label: 'Coding Practice', desc: 'Mock challenges & compiler consoles', tab: 'coding', icon: Code2 }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveTab(item.tab)}
                            className="p-4 border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/50 rounded-2xl text-left shadow-soft cursor-pointer transition-all flex flex-col justify-between h-36"
                          >
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wide">{item.label}</h5>
                              <p className="text-[8px] font-semibold text-slate-400 leading-normal mt-1">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right columns: recently studied timeline */}
                <div className="space-y-3 select-none">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recently Studied Topics</h4>
                  <div className="glassmorphism-card p-4 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                    {history.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-semibold">
                        <div className="space-y-0.5 truncate max-w-[150px]">
                          <span className="block text-slate-700 truncate">{item.topic}</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono uppercase tracking-wider">{item.activityType}</span>
                        </div>
                        <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-bold font-mono">
                          {item.score}% score
                        </span>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <span className="block text-[10px] text-slate-400 font-mono py-4 text-center uppercase font-bold">
                        No activity records found.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reading Session View */}
          {activeTab === 'study' && (
            <StudySession 
              topic={activeSession?.topic || 'Mitochondria Cellular Respiration'}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isTopicBookmarked(activeSession?.topic || 'Mitochondria Cellular Respiration')}
            />
          )}

          {/* Flashcard View */}
          {activeTab === 'flashcards' && (
            <FlashcardDeck cards={flashcards} />
          )}

          {/* Quiz View */}
          {activeTab === 'quiz' && (
            <QuizCard quizzes={quizzes} onComplete={handleQuizComplete} />
          )}

          {/* Coding Practice View */}
          {activeTab === 'coding' && (
            <CodingPractice />
          )}

          {/* Revision View */}
          {activeTab === 'revision' && (
            <div className="max-w-2xl mx-auto space-y-6 select-none">
              
              {/* Revision List checklist */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-soft space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ClipboardList className="w-4.5 h-4.5 text-indigo-600" />
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Weekly Revision Checklist</h4>
                </div>

                <div className="space-y-3 text-[10px] font-semibold text-slate-650">
                  <div className="flex items-center gap-2.5">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                    <span>Re-evaluate Krebs Cycle pathway MCQ Quiz (Weak Topic)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                    <span>Read inner/outer membrane notes in Knowledge Studio</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                    <span>Review ATP synthase 3D mindmap flowcharts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookmarks view */}
          {activeTab === 'bookmarks' && (
            <div className="max-w-2xl mx-auto space-y-3 select-none">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Saved Learning Bookmarks</h4>
              <div className="glassmorphism-card p-5 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-2">
                {bookmarks.map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-semibold p-2.5 border border-slate-200/50 bg-slate-50/20 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-800 font-bold uppercase tracking-wide">{b.title}</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">{b.contentType} reference</span>
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(b.title)}
                      className="px-2.5 py-1 text-[9px] text-rose-500 hover:bg-rose-50 border border-rose-100 rounded-lg font-bold uppercase cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {bookmarks.length === 0 && (
                  <span className="block text-[10px] text-slate-400 font-mono py-8 text-center uppercase font-bold">
                    No bookmarked items found.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* History view */}
          {activeTab === 'history' && (
            <div className="max-w-2xl mx-auto space-y-3 select-none">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Completed Sessions & Analytics Logs</h4>
              <div className="glassmorphism-card p-5 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                {history.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-semibold border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-50 border border-slate-250 rounded-xl text-slate-400 shrink-0">
                        <History className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-slate-800 uppercase tracking-wide font-extrabold">{h.topic}</span>
                        <span className="text-[8px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                          Type: {h.activityType} &middot; Date: {new Date(h.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
                      {h.score}% score
                    </span>
                  </div>
                ))}

                {history.length === 0 && (
                  <span className="block text-[10px] text-slate-400 font-mono py-8 text-center uppercase font-bold">
                    No activity logs recorded.
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </PageContainer>
  );
};

export default Learning;
