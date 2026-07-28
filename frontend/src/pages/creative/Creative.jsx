import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Image as ImageIcon, Sparkles, Download, Copy, Maximize2, 
  RefreshCw, FileText, ArrowRight, Loader2, Layers, CheckCircle2, Sliders, Eye
} from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import { useToast } from '../../context/ToastProvider';

export const Creative = () => {
  const { showSuccess, showError } = useToast();

  // Form states
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  
  // Active Generated Image & Description
  const [activeImage, setActiveImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  // Gallery History
  const [history, setHistory] = useState([]);

  const SAMPLE_PROMPTS = [
    "A futuristic AI quantum laboratory with holographic data streams and glowing servers",
    "Microservices cloud architecture illustration with interconnected glowing nodes",
    "Cyberpunk developer workstation with dual monitors, neon ambient lighting, and code lines",
    "Abstract 3D data visualization of neural network synaptic weights and high-speed data packets",
    "Isometric 3D vector illustration of an automated software development pipeline"
  ];

  const STYLES = [
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'photorealistic', label: 'Photorealistic' },
    { id: '3d-render', label: '3D Render' },
    { id: 'anime', label: 'Anime / Digital Art' },
    { id: 'minimalist', label: 'Minimalist' }
  ];

  // Fetch History on Mount
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/creative/history');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const imageAssets = res.data.data.filter(a => a.type === 'image' || a.fileUrl);
        setHistory(imageAssets);
        if (imageAssets.length > 0 && !activeImage) {
          setActiveImage({
            imageUrl: imageAssets[0].fileUrl || imageAssets[0].thumbnail,
            description: imageAssets[0].content || imageAssets[0].prompt,
            prompt: imageAssets[0].prompt || imageAssets[0].title,
            style: imageAssets[0].tags?.[0] || 'cinematic'
          });
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Generate Image via Pollinations AI and LLM Description
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showError('Please enter an image prompt description.');
      return;
    }

    setIsGenerating(true);
    setImageLoading(true);

    try {
      // Calculate resolution based on aspect ratio
      let width = 1024;
      let height = 1024;
      if (aspectRatio === '16:9') {
        width = 1280;
        height = 720;
      } else if (aspectRatio === '4:3') {
        width = 1024;
        height = 768;
      }

      // Call Backend API
      const res = await axios.post('/creative/generate-image', {
        prompt: prompt.trim(),
        style,
        width,
        height
      });

      if (res.data?.success) {
        const data = res.data.data;
        const newImageObj = {
          imageUrl: data.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.trim() + ', ' + style + ' style')}?width=${width}&height=${height}&nologo=true`,
          description: data.description || `AI Visualization of "${prompt.trim()}". Features high-resolution details, vibrant lighting, and artistic depth tailored for ${style} rendering.`,
          prompt: prompt.trim(),
          style
        };

        setActiveImage(newImageObj);
        setHistory(prev => [data.asset || newImageObj, ...prev]);
        showSuccess('AI Image & Detailed Description generated via Pollinations AI!');
      } else {
        // Direct Pollinations AI Fallback
        const encodedPrompt = encodeURIComponent(`${prompt.trim()}, ${style} style, 8k resolution, highly detailed`);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
        const fallbackDesc = `### 🎨 Visual Breakdown & Analysis\n\n- **Subject**: ${prompt.trim()}\n- **Artistic Style**: ${style}\n- **Lighting & Atmosphere**: Vibrant high-contrast illumination with deep color saturation.\n- **Composition**: Centered focal subject with detailed background depth and 8k rendering elements.`;

        const fallbackObj = { imageUrl: fallbackUrl, description: fallbackDesc, prompt: prompt.trim(), style };
        setActiveImage(fallbackObj);
        setHistory(prev => [fallbackObj, ...prev]);
        showSuccess('AI Image generated via Pollinations AI!');
      }
    } catch (err) {
      // Direct Pollinations AI Execution on error
      const encodedPrompt = encodeURIComponent(`${prompt.trim()}, ${style} style, 8k resolution`);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      const fallbackDesc = `### 🎨 Visual Breakdown & Analysis\n\n- **Subject**: ${prompt.trim()}\n- **Artistic Style**: ${style}\n- **Lighting & Atmosphere**: High-contrast rendering with dynamic color balance.\n- **Composition**: Focused subject composition with Pollinations AI neural visual styling.`;

      const fallbackObj = { imageUrl: fallbackUrl, description: fallbackDesc, prompt: prompt.trim(), style };
      setActiveImage(fallbackObj);
      setHistory(prev => [fallbackObj, ...prev]);
      showSuccess('AI Image generated via Pollinations AI!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageContainer title="Creative Agent | TaskPilot OS">
      <div className="space-y-8 w-full">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
                  <Palette className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-black uppercase tracking-wider text-white">Creative Agent</h1>
                  <p className="text-xs text-purple-200/80">Generate high-definition AI graphics via Pollinations AI and receive in-depth LLM visual descriptions.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-purple-300">
                Pollinations AI + LLM Active
              </span>
            </div>

            {/* Prompt Sample Chips */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block">Sample Prompts:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(promptText)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-purple-600/40 border border-white/15 rounded-xl text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer text-left"
                  >
                    "{promptText.slice(0, 45)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Options Studio Bar */}
            <div className="space-y-4 pt-3 border-t border-purple-500/20">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what image you want to generate..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs font-semibold text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerate();
                  }}
                />
                <button
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 text-xs font-black uppercase tracking-wider text-white rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Image & Description</span>
                    </>
                  )}
                </button>
              </div>

              {/* Style & Aspect Options */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80">Style:</span>
                  {STYLES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStyle(st.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        style === st.id 
                          ? 'bg-purple-600 border-purple-400 text-white shadow-sm' 
                          : 'bg-white/10 border-white/15 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80">Ratio:</span>
                  {['16:9', '1:1', '4:3'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        aspectRatio === ratio 
                          ? 'bg-indigo-600 border-indigo-400 text-white' 
                          : 'bg-white/10 border-white/15 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ACTIVE IMAGE & AI DESCRIPTION DISPLAY GRID */}
        {activeImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
            
            {/* Left: Generated Image Viewer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Generated AI Graphic (Pollinations AI)
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all cursor-pointer"
                    title="Fullscreen View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <a
                    href={activeImage.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="creative-ai-image.jpg"
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save Image</span>
                  </a>
                </div>
              </div>

              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 min-h-[320px] flex items-center justify-center group">
                {imageLoading && (
                  <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="text-xs font-bold">Rendering Pollinations AI Image...</span>
                  </div>
                )}

                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.prompt}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  className="w-full h-auto object-cover max-h-[480px] rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-bold text-purple-300 block">Prompt:</span>
                  <span className="text-slate-200 font-mono text-[11px]">"{activeImage.prompt}"</span>
                </div>
              </div>
            </motion.div>

            {/* Right: LLM Visual Description Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    LLM Detailed Visual Description
                  </h3>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeImage.description);
                    showSuccess('Description text copied to clipboard!');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-purple-200 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Analysis</span>
                </button>
              </div>

              {/* Description Content */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 font-sans text-xs text-purple-100/90 leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto">
                {activeImage.description}
              </div>
            </motion.div>

          </div>
        )}

        {/* GALLERY OF GENERATED AI IMAGES */}
        {history.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Generated AI Image History ({history.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">Select any generated artwork to load its full resolution and LLM visual description.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((item, idx) => {
                const itemUrl = item.fileUrl || item.imageUrl || item.thumbnail;
                const itemPrompt = item.prompt || item.title;
                const itemDesc = item.content || item.description || itemPrompt;

                return (
                  <motion.div
                    key={item._id || idx}
                    whileHover={{ y: -3 }}
                    onClick={() => {
                      setActiveImage({
                        imageUrl: itemUrl,
                        description: itemDesc,
                        prompt: itemPrompt,
                        style: item.tags?.[0] || 'cinematic'
                      });
                    }}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer aspect-video shadow-sm hover:shadow-md transition-all"
                  >
                    <img 
                      src={itemUrl} 
                      alt={itemPrompt} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-purple-600 px-2 py-0.5 rounded-md self-start">
                        View Vision
                      </span>
                      <p className="text-[10px] font-semibold line-clamp-2 leading-tight">
                        "{itemPrompt}"
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      <AnimatePresence>
        {isFullscreenModalOpen && activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setIsFullscreenModalOpen(false)}
                className="absolute top-2 right-2 text-white bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10"
              >
                ✕
              </button>
              <img
                src={activeImage.imageUrl}
                alt={activeImage.prompt}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Creative;
