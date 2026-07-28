import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, BookOpen, FileText, Code2, FolderGit2, 
  ExternalLink, Bookmark, Star, Tag, Sparkles
} from 'lucide-react';

export const ResourceCard = ({ resources = [] }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const defaultResources = resources.length > 0 ? resources : [
    { id: 'r-1', category: 'Videos', title: 'NeetCode 150 DSA Playlist', type: 'YouTube', link: '#', rating: '4.9 ★', badge: 'Essential', description: 'Step-by-step video solutions for top tech interview questions.' },
    { id: 'r-2', category: 'Books', title: 'Cracking the Coding Interview (6th Ed.)', type: 'Book', link: '#', rating: '4.8 ★', badge: 'Recommended', description: 'Comprehensive guide covering 189 programming questions and solutions.' },
    { id: 'r-3', category: 'Articles', title: 'System Design Primer GitHub Repository', type: 'Docs', link: '#', rating: '5.0 ★', badge: 'Top Rated', description: 'Learn how to design large-scale systems & prepare for system design rounds.' },
    { id: 'r-4', category: 'Practice Problems', title: 'LeetCode Top Interview 150', type: 'Coding', link: '#', rating: '4.9 ★', badge: 'Practice', description: 'Curated list of 150 essential LeetCode coding interview questions.' },
    { id: 'r-5', category: 'Projects', title: 'Distributed Key-Value Store Project', type: 'GitHub', link: '#', rating: '4.7 ★', badge: 'Portfolio', description: 'Hands-on project implementing Raft consensus and Redis-style caching.' }
  ];

  const categoryIcons = {
    Videos: Video,
    Books: BookOpen,
    Articles: FileText,
    'Practice Problems': Code2,
    Projects: FolderGit2
  };

  const categories = ['All', 'Videos', 'Books', 'Articles', 'Practice Problems', 'Projects'];

  const filteredResources = activeTab === 'All' 
    ? defaultResources 
    : defaultResources.filter(r => r.category === activeTab);

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  return (
    <section id="sec-resources" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Recommended Learning Resources</span>
          </h3>
          <p className="text-xs text-slate-500">Curated videos, books, articles, practice problems, and portfolio projects.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const Icon = categoryIcons[res.category] || BookOpen;
          const isBookmarked = bookmarkedIds.includes(res.id);

          return (
            <motion.div
              key={res.id}
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-soft flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full">
                    <Icon className="w-3 h-3" />
                    {res.category}
                  </span>

                  <button 
                    onClick={() => toggleBookmark(res.id)}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                      isBookmarked ? 'bg-amber-50 text-amber-500' : 'text-slate-300 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{res.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{res.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500">
                  <span className="text-amber-500">{res.rating}</span>
                  <span>•</span>
                  <span>{res.type}</span>
                </div>

                <a
                  href={res.link || '#'}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ResourceCard;
