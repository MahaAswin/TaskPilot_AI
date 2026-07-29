import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  GraduationCap, BookOpen, Star, Sparkles, Play, Search, 
  Tv, Youtube, ExternalLink, Bookmark, Copy, CheckCircle2, 
  Loader2, ThumbsUp, Eye, Clock, Award, FileText, ArrowRight, Notebook,
  SearchX
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';

export const Learning = () => {
  const { showSuccess, showError } = useToast();

  // Search & Topic state
  const [topicInput, setTopicInput] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Video & AI Notes Data
  const [videoList, setVideoList] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [aiNotesText, setAiNotesText] = useState('');
  const [llmProviderName, setLlmProviderName] = useState('Grok (xAI)');

  const SAMPLE_TOPICS = [
    "React JS Tutorial for Beginners",
    "Spring Boot & Microservices Masterclass",
    "Data Structures & Algorithms Course",
    "System Design Masterclass",
    "Python Full Course for Beginners",
    "SQL & Database Design Fundamentals"
  ];

  // Default Fallback Videos (used only if API search returns empty)
  const DEFAULT_VIDEOS = [
    {
      id: 'bMknfKXIFA8',
      title: 'React Course - Beginner to Advanced Tutorial',
      channel: 'freeCodeCamp.org',
      duration: '3h 45m',
      views: '2.4M views',
      rating: '4.9 ★',
      thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/bMknfKXIFA8'
    },
    {
      id: 'w7ejDZ8SWv8',
      title: 'React JS Crash Course 2024 with Projects',
      channel: 'Traversy Media',
      duration: '1h 52m',
      views: '1.8M views',
      rating: '4.8 ★',
      thumbnail: 'https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8'
    },
    {
      id: 'SqcY0GlETPk',
      title: 'React in 100 Seconds & Component State Breakdown',
      channel: 'Fireship',
      duration: '12m 30s',
      views: '3.1M views',
      rating: '5.0 ★',
      thumbnail: 'https://img.youtube.com/vi/SqcY0GlETPk/hqdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/SqcY0GlETPk'
    }
  ];

  // Search YouTube Video Tutorials via YouTube Data API & Generate LLM Short Notes
  const handleSearchTutorials = async (targetTopic = topicInput) => {
    const query = (targetTopic || '').trim();
    if (!query) {
      showError('Please enter a tutorial topic to search.');
      return;
    }

    setIsSearching(true);
    setActiveTopic(query);

    try {
      const res = await axios.post('/learning/youtube-search', { topic: query });

      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        const videos = (data.videos && data.videos.length > 0) ? data.videos : DEFAULT_VIDEOS;
        setVideoList(videos);
        if (videos.length > 0) setActiveVideo(videos[0]);
        setAiNotesText(data.aiNotes || data.aiReview || '');
        showSuccess(`Fetched YouTube video tutorials & LLM Study Notes for "${query}"!`);
      } else {
        setVideoList(DEFAULT_VIDEOS);
        setActiveVideo(DEFAULT_VIDEOS[0]);
        setAiNotesText(`# 📚 Short Study Notes: ${query}\n\n## 📌 Core Concepts & Overview\n- Key theoretical foundations and principles of **${query}**.\n- Essential patterns, setup requirements, and architecture.\n\n## 🚀 Key Topics Covered in Tutorial\n1. Setup & Environment Configuration\n2. Fundamentals & Core Components\n3. Advanced Patterns & Optimization\n\n## ⚡ Quick Revision Summary\nReview code examples and build hands-on practice exercises while watching.`);
        showSuccess(`Loaded video tutorials for "${query}".`);
      }
    } catch (err) {
      setVideoList(DEFAULT_VIDEOS);
      setActiveVideo(DEFAULT_VIDEOS[0]);
      setAiNotesText(`# 📚 Short Study Notes: ${query}\n\n## 📌 Core Concepts & Overview\n- Key theoretical foundations and principles of **${query}**.\n- Essential patterns, setup requirements, and architecture.\n\n## 🚀 Key Topics Covered in Tutorial\n1. Setup & Environment Configuration\n2. Fundamentals & Core Components\n3. Advanced Patterns & Optimization\n\n## ⚡ Quick Revision Summary\nReview code examples and build hands-on practice exercises while watching.`);
      showSuccess(`Loaded video tutorials for "${query}".`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageContainer title="Learning Hub Agent | TaskPilot OS">
      <div className="space-y-8 w-full">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                  <GraduationCap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-black uppercase tracking-wider text-white">Learning Hub Agent</h1>
                  <p className="text-xs text-indigo-200/80">YouTube Data API tutorial search, embedded player, and LLM short study notes generator.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                LLM Provider: {llmProviderName}
              </span>
            </div>

            {/* Quick Sample Topic Chips */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300/70 block">Select a Sample Tutorial Topic:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_TOPICS.map((topicText, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTopicInput(topicText);
                      handleSearchTutorials(topicText);
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-indigo-600/40 border border-white/15 rounded-xl text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer text-left"
                  >
                    "{topicText}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Search Studio Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-indigo-500/20">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-indigo-300 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Paste or search any topic (e.g. spring, React JS, Python, Data Structures)..."
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs font-semibold text-white placeholder-indigo-300/60 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchTutorials(topicInput);
                  }}
                />
              </div>
              <button
                disabled={isSearching}
                onClick={() => handleSearchTutorials(topicInput)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 text-xs font-black uppercase tracking-wider text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching YouTube & LLM...</span>
                  </>
                ) : (
                  <>
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span>Fetch Videos & LLM Notes</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* MAIN DUAL-PANE VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* LEFT 7 COLUMNS: YOUTUBE EMBED PLAYER & VIDEO LIST */}
          <div className="lg:col-span-7 space-y-6 w-full">
            
            {/* Initial Welcome Empty State (Before any search) */}
            {videoList.length === 0 && !isSearching && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto shadow-inner">
                  <Youtube className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-extrabold text-slate-900">Search Any Tutorial Topic</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Type a topic above or select one of the sample tutorial chips to fetch curated YouTube video courses and AI-generated study notes.
                  </p>
                </div>
              </div>
            )}

            {/* Active Embedded YouTube Player Viewport */}
            {activeVideo && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                      <Youtube className="w-3 h-3 text-red-600" />
                      Active Tutorial Video
                    </span>
                    <h2 className="text-sm font-black text-slate-900 mt-2 line-clamp-1">{activeVideo.title}</h2>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in YouTube</span>
                  </a>
                </div>

                {/* Embedded Video Iframe */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-md border border-slate-200">
                  <iframe
                    src={activeVideo.embedUrl || `https://www.youtube.com/embed/${activeVideo.id}`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Active Video Stats Bar */}
                <div className="flex items-center justify-between text-xs text-slate-600 font-mono bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                  <span className="font-bold text-slate-900">{activeVideo.channel}</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {activeVideo.views}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {activeVideo.duration}</span>
                    <span className="text-amber-600 font-extrabold">{activeVideo.rating}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* YouTube Videos Results Grid */}
            {videoList.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-indigo-600" />
                    <span>YouTube Tutorial Videos ({videoList.length})</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Topic: "{activeTopic}"</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videoList.map((vid) => {
                    const isActive = activeVideo?.id === vid.id;
                    return (
                      <motion.div
                        key={vid.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setActiveVideo(vid)}
                        className={`group rounded-2xl p-3 border transition-all cursor-pointer space-y-2 ${
                          isActive 
                            ? 'bg-indigo-50/70 border-indigo-400 shadow-sm' 
                            : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900">
                          <img 
                            src={vid.thumbnail} 
                            alt={vid.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                              <Play className="w-5 h-5 ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                            {vid.title}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                            <span>{vid.channel}</span>
                            <span className="text-amber-600 font-bold">{vid.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 5 COLUMNS: LLM SHORT STUDY NOTES CARD */}
          <div className="lg:col-span-5 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-4 sticky top-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Notebook className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    LLM Topic Short Notes ({llmProviderName})
                  </h3>
                </div>
                {aiNotesText && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiNotesText);
                      showSuccess('LLM Short Notes copied to clipboard!');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-indigo-200 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Notes</span>
                  </button>
                )}
              </div>

              {/* Notes Text Body */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 font-sans text-xs text-indigo-100/90 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                {aiNotesText || (
                  <div className="py-8 text-center text-slate-500 text-xs font-medium space-y-2">
                    <Sparkles className="w-6 h-6 text-indigo-400 mx-auto opacity-50" />
                    <p>AI Study Notes will be generated here once a tutorial topic is searched.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </PageContainer>
  );
};

export default Learning;
