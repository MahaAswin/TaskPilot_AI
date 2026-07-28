import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, Plus, FileText, Pin, Star, Grid, Search, SlidersHorizontal, 
  HelpCircle, Sparkles, ChevronRight, Award, FolderPlus, BookOpenCheck, RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

// Components Imports
import NoteCard from '../../components/knowledge/NoteCard';
import NoteViewer from '../../components/knowledge/NoteViewer';
import NoteEditor from '../../components/knowledge/NoteEditor';
import KnowledgeStats from '../../components/knowledge/KnowledgeStats';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';

export const Knowledge = () => {
  const { showSuccess, showError } = useToast();

  // Tab views state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'create' | 'all' | 'pinned' | 'favorites'
  
  // Note Lists state
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Overlay states
  const [viewerNote, setViewerNote] = useState(null);
  const [editorNote, setEditorNote] = useState(null);
  
  // Execution states
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states for note creation
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formTags, setFormTags] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('intermediate');
  const [formLanguage, setFormLanguage] = useState('English');

  const categoriesList = [
    'Programming', 'DSA', 'Database', 'Operating Systems', 'Networks', 
    'AI', 'Machine Learning', 'Cyber Security', 'Interview Prep', 'Personal Notes'
  ];

  // Fetch all notes on mount / refresh
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/knowledge/all', {
        params: {
          sortBy
        }
      });
      if (res.data?.success) {
        setNotes(res.data.data);
      }
    } catch (err) {
      showError('Failed to load notes library.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [sortBy]);

  // Synchronize filtered lists
  useEffect(() => {
    let result = [...notes];

    // Search query parsing
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(q) ||
        note.topic.toLowerCase().includes(q) ||
        note.category.toLowerCase().includes(q) ||
        note.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(n => n.category === selectedCategory);
    }

    // Tabs filters
    if (activeTab === 'pinned') {
      result = result.filter(n => n.isPinned);
    } else if (activeTab === 'favorites') {
      result = result.filter(n => n.isFavorite);
    }

    setFilteredNotes(result);
  }, [notes, searchQuery, selectedCategory, activeTab]);

  // Stats compiler
  const compileStats = () => {
    return {
      total: notes.length,
      pinned: notes.filter(n => n.isPinned).length,
      favorites: notes.filter(n => n.isFavorite).length,
      drafts: notes.filter(n => n.status === 'draft').length
    };
  };

  // Note Action Handlers
  const handleTogglePin = async (id, isPinned) => {
    try {
      const res = await axios.put('/knowledge/pin', { id, isPinned });
      if (res.data?.success) {
        setNotes(prev => prev.map(n => n._id === id ? res.data.data : n));
        showSuccess(isPinned ? 'Note pinned to dashboard' : 'Note unpinned');
      }
    } catch (err) {
      showError('Failed to pin note.');
    }
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      const res = await axios.put('/knowledge/favorite', { id, isFavorite });
      if (res.data?.success) {
        setNotes(prev => prev.map(n => n._id === id ? res.data.data : n));
        showSuccess(isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    } catch (err) {
      showError('Failed to update favorite status.');
    }
  };

  const handleDuplicate = async (note) => {
    try {
      const res = await axios.post('/knowledge/create', {
        title: `${note.title} (Copy)`,
        topic: note.topic,
        keywords: note.keywords,
        description: note.description,
        content: note.content,
        summary: note.summary,
        category: note.category,
        tags: note.tags,
        difficulty: note.difficulty,
        language: note.language,
        status: 'saved'
      });
      if (res.data?.success) {
        setNotes(prev => [res.data.data, ...prev]);
        showSuccess('Note duplicated successfully.');
      }
    } catch (err) {
      showError('Failed to duplicate note.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete('/knowledge/delete', { data: { id } });
      if (res.data?.success) {
        setNotes(prev => prev.filter(n => n._id !== id));
        showSuccess('Note deleted successfully.');
      }
    } catch (err) {
      showError('Failed to delete note.');
    }
  };

  const handleSaveNote = async (data) => {
    try {
      if (data.id) {
        // Edit Save
        const res = await axios.put('/knowledge/update', data);
        if (res.data?.success) {
          setNotes(prev => prev.map(n => n._id === data.id ? res.data.data : n));
          showSuccess('Note saved.');
        }
      } else {
        // Manual Create Save
        const res = await axios.post('/knowledge/create', data);
        if (res.data?.success) {
          setNotes(prev => [res.data.data, ...prev]);
          showSuccess('Note created successfully.');
        }
      }
      setEditorNote(null);
    } catch (err) {
      showError('Failed to save note.');
    }
  };

  // Mock AI Notes Generator Trigger
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formTitle || !formTopic || !formKeywords) {
      showError('Please fill in Title, Topic, and Keywords prior to generation.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await axios.post('/knowledge/generate', {
        title: formTitle,
        topic: formTopic,
        keywords: formKeywords,
        description: formDescription,
        category: formCategory,
        tags: formTags,
        difficulty: formDifficulty,
        language: formLanguage
      });
      if (res.data?.success) {
        setNotes(prev => [res.data.data, ...prev]);
        setViewerNote(res.data.data); // Open details viewer immediately!
        showSuccess('AI Notes summary generated successfully!');
        
        // Reset form inputs
        setFormTitle('');
        setFormTopic('');
        setFormKeywords('');
        setFormDescription('');
        setFormTags('');
        setActiveTab('all');
      }
    } catch (err) {
      showError('Failed to generate study guide.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Mock Export triggers
  const handleExport = async (id, format) => {
    try {
      showSuccess(`Compiled note to ${format.toUpperCase()} successfully.`);
    } catch (err) {
      showError('Export compilation failed.');
    }
  };

  return (
    <PageContainer>
      
      {/* Visual Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span>KNOWLEDGE STUDIO</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Generate and organize academic concept notes</p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-2">
            {[
              { id: 'dashboard', label: 'Studio' },
              { id: 'all', label: 'My Notes' },
              { id: 'create', label: 'Generate Note' },
              { id: 'pinned', label: 'Pinned' },
              { id: 'favorites', label: 'Favorites' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCategory(''); }}
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

          <button
            onClick={() => setEditorNote({ title: 'New Note', topic: 'General Topic', category: 'General', content: '' })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="large" />
      ) : (
        <div className="space-y-6">
          
          {/* Dashboard Hub View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <KnowledgeStats stats={compileStats()} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categories filtering list */}
                <div className="space-y-3 lg:col-span-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider select-none">Study Categories</h4>
                  <div className="glassmorphism-card p-4 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-1 select-none">
                    {categoriesList.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setActiveTab('all'); }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>{cat}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent notes queue list */}
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center justify-between select-none">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recent Notes Library</h4>
                    <button onClick={() => setActiveTab('all')} className="text-[10px] font-bold text-indigo-600 hover:underline">
                      See All Notes
                    </button>
                  </div>
                  
                  {notes.length === 0 ? (
                    <GlassCard className="p-12 text-center text-slate-400 font-mono text-[10px] uppercase font-bold select-none">
                      No saved notes document logged.
                    </GlassCard>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {notes.slice(0, 4).map(note => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onSelect={setViewerNote}
                          onTogglePin={handleTogglePin}
                          onToggleFavorite={handleToggleFavorite}
                          onDuplicate={handleDuplicate}
                          onEdit={setEditorNote}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Create / Generate Form View */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
              <GlassCard className="p-6 bg-white shadow-soft">
                <div className="border-b border-slate-100 pb-3 mb-6 select-none flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Configure Study Guide Prompt</h3>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Note Title */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Note Title</label>
                      <input 
                        type="text" 
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold"
                        placeholder="Mitochondria Respiration Biology Guide"
                      />
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Topic</label>
                      <input 
                        type="text" 
                        required
                        value={formTopic}
                        onChange={(e) => setFormTopic(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold"
                        placeholder="Cellular Respiration Krebs Cycle"
                      />
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Keywords (Comma separated)</label>
                    <input 
                      type="text" 
                      required
                      value={formKeywords}
                      onChange={(e) => setFormKeywords(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold"
                      placeholder="Mitochondria, ATP, Cristae, Krebs"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Context Description (Optional)</label>
                    <textarea 
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold resize-none leading-relaxed"
                      placeholder="Add syllabus outlines or exam instructions details here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category selection */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                      <select 
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-bold text-slate-600"
                      >
                        {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Difficulty selection */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Difficulty</label>
                      <select 
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-bold text-slate-600"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold"
                        placeholder="biology, ap_prep"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-glow cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                          <span>Generating Study Guide...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4.5 h-4.5" />
                          <span>Generate Notes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          )}

          {/* List Views (My Notes / Pinned / Favorites) */}
          {(activeTab === 'all' || activeTab === 'pinned' || activeTab === 'favorites') && (
            <div className="space-y-4">
              
              {/* Filter toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-200 bg-white rounded-2xl shadow-soft select-none">
                
                {/* Search bar */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tag, category, or title..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold"
                  />
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-slate-200 bg-white text-[10px] font-bold text-slate-600 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="pinned">Pinned first</option>
                      <option value="favorites">Favorites first</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes grid list */}
              {filteredNotes.length === 0 ? (
                <GlassCard className="p-16 text-center text-slate-400 font-mono text-[10px] uppercase font-bold select-none border-dashed">
                  No matching notes logged in this list category.
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onSelect={setViewerNote}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onDuplicate={handleDuplicate}
                      onEdit={setEditorNote}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Note Viewer Overlay Modal */}
      {viewerNote && (
        <NoteViewer
          note={viewerNote}
          onClose={() => setViewerNote(null)}
          onExport={handleExport}
          onEdit={(note) => { setViewerNote(null); setEditorNote(note); }}
        />
      )}

      {/* Note Editor Overlay Modal */}
      {editorNote && (
        <NoteEditor
          note={editorNote}
          onSave={handleSaveNote}
          onClose={() => setEditorNote(null)}
        />
      )}

    </PageContainer>
  );
};

export default Knowledge;
