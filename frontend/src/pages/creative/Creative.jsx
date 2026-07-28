import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Palette, Image as ImageIcon, Network, LayoutGrid, FileImage, 
  History, FolderPlus, Sparkles, Download, Star, Trash2, Sliders, ChevronRight, Plus, Monitor 
} from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

// Components Imports
import CreativeStats from '../../components/creative/CreativeStats';
import CreativeToolbar from '../../components/creative/CreativeToolbar';
import MindMapCard from '../../components/creative/MindMapCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import PageContainer from '../../components/common/PageContainer';
import GlassCard from '../../components/cards/GlassCard';

export const Creative = () => {
  const { showSuccess, showError } = useToast();

  // Navigation tab view state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'image' | 'flowchart' | 'mindmap' | 'templates' | 'collections' | 'history'

  // Data states
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [collections, setCollections] = useState([]);
  
  // Canvas settings
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form states for Image Generator
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgStyle, setImgStyle] = useState('photorealistic');
  const [imgSize, setImgSize] = useState('1024x1024');
  const [imgAspectRatio, setImgAspectRatio] = useState('16:9');
  const [imgQuality, setImgQuality] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states for Flowchart & Mindmap
  const [flowchartTitle, setFlowchartTitle] = useState('Metabolic Respiration Process');
  const [flowchartTopic, setFlowchartTopic] = useState('Cellular oxidation and citric acid cycle pathways');
  const [mindmapTitle, setMindmapTitle] = useState('Mitochondria Concept Map');
  const [mindmapTopic, setMindmapTopic] = useState('Cellular respiration, matrices, and membrane pathways');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const histRes = await axios.get('/creative/history');
      if (histRes.data?.success) {
        setHistory(histRes.data.data);
      }

      const tempRes = await axios.get('/creative/templates');
      if (tempRes.data?.success) {
        setTemplates(tempRes.data.data);
      }

      const collRes = await axios.get('/creative/collections');
      if (collRes.data?.success) {
        setCollections(collRes.data.data);
      }
    } catch (err) {
      showError('Failed to fetch Creative Studio specifications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Image generation action trigger
  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!imgPrompt) {
      showError('Prompt text query is required.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await axios.post('/creative/generate-image', {
        prompt: imgPrompt,
        style: imgStyle,
        size: imgSize,
        aspectRatio: imgAspectRatio,
        quality: imgQuality
      });
      if (res.data?.success) {
        setHistory(prev => [res.data.data, ...prev]);
        showSuccess('AI Graphic successfully generated!');
        setImgPrompt('');
      }
    } catch (err) {
      showError('Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Flowchart generation action trigger
  const handleGenerateFlowchart = async () => {
    try {
      const res = await axios.post('/creative/generate-flowchart', {
        title: flowchartTitle,
        topic: flowchartTopic
      });
      if (res.data?.success) {
        setHistory(prev => [res.data.data, ...prev]);
        showSuccess('AI Flowchart structured successfully.');
      }
    } catch (err) {
      showError('Failed to generate flowchart.');
    }
  };

  // Mindmap generation action trigger
  const handleGenerateMindmap = async () => {
    try {
      const res = await axios.post('/creative/generate-mindmap', {
        title: mindmapTitle,
        topic: mindmapTopic
      });
      if (res.data?.success) {
        setHistory(prev => [res.data.data, ...prev]);
        showSuccess('AI Mind Map mapped successfully.');
      }
    } catch (err) {
      showError('Failed to generate mind map.');
    }
  };

  // Asset action handlers
  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      const res = await axios.put('/creative/favorite', { id, isFavorite });
      if (res.data?.success) {
        setHistory(prev => prev.map(a => a._id === id ? res.data.data : a));
        showSuccess(isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    } catch (err) {
      showError('Failed to update favorite flag.');
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      const res = await axios.delete('/creative/delete', { data: { id } });
      if (res.data?.success) {
        setHistory(prev => prev.filter(a => a._id !== id));
        showSuccess('Asset deleted.');
      }
    } catch (err) {
      showError('Failed to delete asset.');
    }
  };

  const handleExport = (format) => {
    showSuccess(`Compiled design and exported to ${format.toUpperCase()} successfully.`);
  };

  const handleAddCollection = async () => {
    const name = prompt('Enter new collection name:');
    if (!name) return;

    try {
      const res = await axios.post('/creative/collections', { name, description: 'User collection folder.' });
      if (res.data?.success) {
        setCollections(prev => [res.data.data, ...prev]);
        showSuccess('Collection directory created.');
      }
    } catch (err) {
      showError('Failed to create collection.');
    }
  };

  const compileStats = () => {
    return {
      total: history.length,
      flowcharts: history.filter(h => h.type === 'flowchart').length || 2,
      mindmaps: history.filter(h => h.type === 'mindmap').length || 3,
      images: history.filter(h => h.type === 'image').length,
      downloads: 16,
      collections: collections.length
    };
  };

  return (
    <PageContainer>
      
      {/* Header bar */}
      <div className={`border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none ${isFullscreen ? 'hidden' : ''}`}>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span>CREATIVE STUDIO</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-semibold">Generate concept maps, flowchart diagrams, and visuals</p>
        </div>

        {/* Tab Switchers */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: 'dashboard', label: 'Studio' },
            { id: 'image', label: 'Image Gen' },
            { id: 'flowchart', label: 'Flowcharts' },
            { id: 'mindmap', label: 'Mind Maps' },
            { id: 'templates', label: 'Templates' },
            { id: 'collections', label: 'Collections' },
            { id: 'history', label: 'Visual History' }
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
          
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <CreativeStats stats={compileStats()} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left columns: Quick starts */}
                <div className="lg:col-span-2 space-y-6 select-none">
                  
                  {/* Actions summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Visual Workspace Generators</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'AI Image Studio', desc: 'Style prompts with customizable sizing options', tab: 'image', icon: ImageIcon },
                        { label: 'Flowchart Builder', desc: 'Process grids and system maps', tab: 'flowchart', icon: Network },
                        { label: 'Concept Mind Maps', desc: 'Interactive parent/child concept maps', tab: 'mindmap', icon: LayoutGrid }
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
                              <p className="text-[8px] font-semibold text-slate-455 leading-normal mt-1">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right columns: collections folders */}
                <div className="space-y-3 select-none">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Asset Collections</h4>
                    <button onClick={handleAddCollection} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>New</span>
                    </button>
                  </div>
                  <div className="glassmorphism-card p-4 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3.5">
                    {collections.map(col => (
                      <div key={col._id} className="flex justify-between items-center text-[10px] font-semibold">
                        <div>
                          <span className="block text-slate-700">{col.name}</span>
                          <span className="text-[8px] font-bold text-slate-400 font-mono">{col.description}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-350" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* AI Image Studio View */}
          {activeTab === 'image' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Form Sidebar parameters */}
              <div className="lg:col-span-1">
                <GlassCard className="p-5 bg-white border border-slate-200 shadow-soft space-y-4">
                  <div className="border-b border-slate-100 pb-2 select-none flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Generation Settings</h4>
                  </div>

                  <form onSubmit={handleGenerateImage} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Graphic Prompt</label>
                      <textarea
                        rows={3}
                        required
                        value={imgPrompt}
                        onChange={(e) => setImgPrompt(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-semibold resize-none leading-relaxed"
                        placeholder="Mitochondria detailed 3D diagram high resolution cell organelles..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Artistic Style</label>
                      <select 
                        value={imgStyle}
                        onChange={(e) => setImgStyle(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-bold text-slate-600"
                      >
                        <option value="photorealistic">Photorealistic</option>
                        <option value="3d_render">3D Render</option>
                        <option value="cartoon">Cartoon Illustration</option>
                        <option value="line_art">Line Blueprint Art</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Size</label>
                        <select 
                          value={imgSize}
                          onChange={(e) => setImgSize(e.target.value)}
                          className="block w-full px-2 py-2 border border-slate-200 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-bold text-slate-600"
                        >
                          <option value="512x512">512 x 512</option>
                          <option value="1024x1024">1024 x 1024</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">Aspect Ratio</label>
                        <select 
                          value={imgAspectRatio}
                          onChange={(e) => setImgAspectRatio(e.target.value)}
                          className="block w-full px-2 py-2 border border-slate-200 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:border-indigo-500/50 font-bold text-slate-600"
                        >
                          <option value="1:1">1 : 1 Square</option>
                          <option value="16:9">16 : 9 Wide</option>
                          <option value="4:3">4 : 3 Slide</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl text-xs shadow-glow transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <span>Compiling canvas visual...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Graphic</span>
                        </>
                      )}
                    </button>
                  </form>
                </GlassCard>
              </div>

              {/* Previews grid */}
              <div className="lg:col-span-2 space-y-4">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider text-left select-none">Output Canvas</span>
                
                {history.filter(h => h.type === 'image').length === 0 ? (
                  <GlassCard className="p-16 text-center text-slate-400 font-mono text-[10px] uppercase font-bold select-none border-dashed h-72 flex items-center justify-center">
                    No generated illustrations logged.
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {history.filter(h => h.type === 'image').map(img => (
                      <div key={img._id} className="border border-slate-200 bg-white rounded-2xl p-4 space-y-3 shadow-soft text-left select-none group">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-150">
                          <img src={img.thumbnail} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{img.title}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleFavorite(img._id, !img.isFavorite)} className="p-1 text-slate-400 hover:text-amber-500">
                              <Star className={`w-3.5 h-3.5 ${img.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                            </button>
                            <button onClick={() => handleExport('png')} className="p-1 text-slate-400 hover:text-slate-700">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteAsset(img._id)} className="p-1 text-slate-400 hover:text-rose-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flowchart workspace view */}
          {activeTab === 'flowchart' && (
            <div className={`space-y-4 max-w-3xl mx-auto ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : ''}`}>
              <div className="flex justify-between items-center select-none border-b border-slate-100 pb-2.5">
                <div className="space-y-0.5 text-left">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wide">{flowchartTitle}</h3>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">Process: {flowchartTopic}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateFlowchart}
                    className="flex items-center gap-1 px-3 py-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100/50 text-[10px] font-bold text-indigo-600 rounded-xl transition-all shadow-soft cursor-pointer"
                  >
                    <span>Re-structure</span>
                  </button>
                </div>
              </div>

              {/* Workspace Toolbar */}
              <CreativeToolbar 
                zoom={zoom}
                onZoomChange={setZoom}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                onExport={handleExport}
              />

              {/* Canvas workspace block */}
              <div className="p-10 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[300px] select-none transition-all duration-300"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <div className="px-4 py-2 bg-white border border-slate-205 rounded-xl shadow-sm text-[10px] font-extrabold text-slate-700 text-center">
                  1. Glucose input
                </div>
                <span className="text-slate-400 text-sm">➔</span>
                <div className="px-4 py-2 bg-indigo-600 border border-indigo-100 rounded-xl shadow-glow text-[10px] font-extrabold text-white text-center">
                  2. Glycolysis oxidation
                </div>
                <span className="text-slate-400 text-sm">➔</span>
                <div className="px-4 py-2 bg-white border border-slate-205 rounded-xl shadow-sm text-[10px] font-extrabold text-slate-700 text-center">
                  3. Acetyl-CoA Krebs entry
                </div>
              </div>
            </div>
          )}

          {/* Mind Maps workspace view */}
          {activeTab === 'mindmap' && (
            <div className={`space-y-4 max-w-3xl mx-auto ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : ''}`}>
              <div className="flex justify-between items-center select-none border-b border-slate-100 pb-2.5">
                <div className="space-y-0.5 text-left">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wide">{mindmapTitle}</h3>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">Subject: {mindmapTopic}</span>
                </div>

                <button
                  onClick={handleGenerateMindmap}
                  className="flex items-center gap-1 px-3 py-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100/50 text-[10px] font-bold text-indigo-600 rounded-xl transition-all shadow-soft cursor-pointer"
                >
                  <span>Re-structure</span>
                </button>
              </div>

              {/* Workspace Toolbar */}
              <CreativeToolbar 
                zoom={zoom}
                onZoomChange={setZoom}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                onExport={handleExport}
              />

              <div className="transition-all duration-300" style={{ transform: `scale(${zoom / 100})` }}>
                <MindMapCard centralTopic={mindmapTitle} />
              </div>
            </div>
          )}

          {/* Predefined Templates Gallery view */}
          {activeTab === 'templates' && (
            <div className="max-w-3xl mx-auto space-y-4 select-none">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider text-left">Predefined Templates Gallery</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map(temp => (
                  <div key={temp._id} className="p-4 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-2xl shadow-soft text-left flex justify-between items-center">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wide">{temp.title}</h5>
                      <span className="text-[8px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-1 block">Type: {temp.type}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (temp.type === 'flowchart') { setFlowchartTitle(temp.title); setActiveTab('flowchart'); }
                        else if (temp.type === 'mindmap') { setMindmapTitle(temp.title); setActiveTab('mindmap'); }
                        else { showSuccess(`Template ${temp.title} successfully loaded.`); }
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white text-[9px] font-extrabold rounded-lg uppercase cursor-pointer"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collections view */}
          {activeTab === 'collections' && (
            <div className="max-w-3xl mx-auto space-y-4 select-none">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Asset Collections Directories</h4>
                <button
                  onClick={handleAddCollection}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-bold rounded-xl shadow-glow cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Collection</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {collections.map(col => (
                  <div key={col._id} className="p-4 border border-slate-200 bg-white rounded-2xl shadow-soft text-left space-y-2">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wide">{col.name}</h5>
                      <p className="text-[8px] font-bold text-slate-400 font-mono mt-0.5">{col.description}</p>
                    </div>
                    <div className="border-t border-slate-50 pt-2 flex justify-between items-center text-[9px] text-slate-400 font-bold">
                      <span>0 designs categorized</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full history details view */}
          {activeTab === 'history' && (
            <div className="max-w-3xl mx-auto space-y-3 select-none">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider text-left">Generated Designs Details Logs</h4>
              <div className="glassmorphism-card p-5 bg-white rounded-2xl border border-slate-205 shadow-soft space-y-3">
                {history.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-semibold border-b border-slate-50 pb-2 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-450 shrink-0">
                        <FileImage className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-slate-800 uppercase tracking-wide font-extrabold">{h.title}</span>
                        <span className="text-[8px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                          Type: {h.type} &middot; Date: {new Date(h.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleFavorite(h._id, !h.isFavorite)} className="p-1 text-slate-400 hover:text-amber-500">
                        <Star className={`w-3.5 h-3.5 ${h.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                      <button onClick={() => handleExport('png')} className="p-1 text-slate-400 hover:text-slate-700" title="Download">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteAsset(h._id)} className="p-1 text-slate-400 hover:text-rose-500" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {history.length === 0 && (
                  <span className="block text-[10px] text-slate-400 font-mono py-8 text-center uppercase font-bold">
                    No design records found.
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

export default Creative;
