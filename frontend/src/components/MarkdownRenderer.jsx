import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Dedicated sub-component to handle compile scopes for Mermaid Diagrams
const MermaidDiagram = ({ chart }) => {
  const elementRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!window.mermaid || !elementRef.current) return;
      
      const uniqueId = `mermaid-${Math.floor(Math.random() * 1000000)}`;
      try {
        // Clear any previous error
        setError(false);
        // Render diagram async using mermaid api
        const { svg: renderedSvg } = await window.mermaid.render(uniqueId, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('[Mermaid compile error]', err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(renderChart, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [chart]);

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl my-4 text-xs font-mono text-rose-400">
        ⚠️ Failed to parse Mermaid diagram. Please double check syntax.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-xl my-4 flex justify-center overflow-x-auto shadow-inner">
      <div ref={elementRef} className="hidden" />
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full max-w-lg" />
      ) : (
        <div className="text-zinc-500 text-xs animate-pulse">Compiling flowchart diagram...</div>
      )}
    </div>
  );
};

const MarkdownRenderer = ({ content = '' }) => {
  const { addToast } = useToast();
  const [copiedBlockId, setCopiedBlockId] = useState(null);

  const handleCopyCode = (codeText, blockId) => {
    navigator.clipboard.writeText(codeText);
    setCopiedBlockId(blockId);
    addToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedBlockId(null), 2000);
  };

  const handleDownloadImage = async (url, filename = 'taskpilot-artwork.jpg') => {
    addToast('Downloading image...', 'info');
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addToast('Image downloaded successfully!', 'success');
    } catch (err) {
      // Fallback: open in new tab
      window.open(url, '_blank');
      addToast('Opening image in new tab for manual download.', 'info');
    }
  };

  // Helper to parse inline markdown (bold, italic, code)
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    
    // Escape HTML to prevent injection
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold (**text** or __text__)
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italics (*text* or _text_)
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/_(.*?)_/g, '<em>$1</em>');

    // Inline Code (`code`)
    parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-fuchsia-400 font-mono text-xs font-semibold">$1</code>');

    return parsed;
  };

  // Process sections of text (extract code blocks vs standard text)
  const renderSections = () => {
    if (!content) return null;

    // Split text by markdown code blocks (```language ... ```)
    const sections = content.split(/(```[\s\S]*?```)/g);

    return sections.map((section, idx) => {
      // Code Block Detection
      if (section.startsWith('```')) {
        const match = section.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const codeText = match ? match[2].trim() : section.replace(/```/g, '').trim();

        // 1. Mermaid Flowchart
        if (language.toLowerCase() === 'mermaid') {
          return <MermaidDiagram key={idx} chart={codeText} />;
        }

        // 2. Standard Code Block with Copy
        const blockId = `code-${idx}`;
        return (
          <div key={idx} className="my-5 border border-white/5 rounded-xl overflow-hidden shadow-2xl bg-zinc-950/80 font-mono text-sm leading-relaxed">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-900/50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{language || 'text'}</span>
              <button
                onClick={() => handleCopyCode(codeText, blockId)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/5"
              >
                {copiedBlockId === blockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-zinc-300 font-mono">
              <pre><code>{codeText}</code></pre>
            </div>
          </div>
        );
      }

      // Standard Text Paragraphs, Headers, and Lists
      const lines = section.split('\n');
      const elements = [];
      let activeList = [];
      let activeListType = null; // 'ul' | 'ol'

      const flushList = (key) => {
        if (activeList.length > 0) {
          if (activeListType === 'ul') {
            elements.push(
              <ul key={`ul-${key}`} className="list-disc pl-6 my-3 space-y-1.5 text-zinc-300 text-sm md:text-base leading-relaxed">
                {activeList.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
              </ul>
            );
          } else {
            elements.push(
              <ol key={`ol-${key}`} className="list-decimal pl-6 my-3 space-y-1.5 text-zinc-300 text-sm md:text-base leading-relaxed">
                {activeList.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
              </ol>
            );
          }
          activeList = [];
          activeListType = null;
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 1. Image Embed Detection (e.g., ![prompt](url))
        const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (imageMatch) {
          flushList(i);
          const altText = imageMatch[1] || 'Generated Artwork';
          const imageUrl = imageMatch[2];

          elements.push(
            <div key={`img-${i}`} className="my-6 glassmorphism border border-white/5 rounded-2xl overflow-hidden shadow-glass group max-w-xl mx-auto">
              <div className="relative aspect-[4/3] bg-zinc-950 flex items-center justify-center overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={altText} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between">
                  <span className="text-xs font-medium text-white truncate max-w-[70%]">{altText}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadImage(imageUrl, `${altText.replace(/\s+/g, '_')}.jpg`)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-white/5 bg-zinc-900/30 flex items-center gap-2 text-xs text-zinc-400">
                <ImageIcon className="w-4 h-4 text-fuchsia-400 shrink-0" />
                <span className="italic truncate">Prompt: "{altText}"</span>
              </div>
            </div>
          );
          continue;
        }

        // 2. Headers
        if (line.startsWith('### ')) {
          flushList(i);
          elements.push(
            <h3 key={`h3-${i}`} className="text-base md:text-lg font-bold text-zinc-100 mt-6 mb-3 flex items-center gap-2 border-l-2 border-indigo-500 pl-2">
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.slice(4)) }} />
            </h3>
          );
        } else if (line.startsWith('## ')) {
          flushList(i);
          elements.push(
            <h2 key={`h2-${i}`} className="text-lg md:text-xl font-extrabold text-white mt-8 mb-4 border-b border-white/5 pb-1 flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.slice(3)) }} />
            </h2>
          );
        } else if (line.startsWith('# ')) {
          flushList(i);
          elements.push(
            <h1 key={`h1-${i}`} className="text-xl md:text-2xl font-black text-gradient-primary mt-10 mb-5">
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.slice(2)) }} />
            </h1>
          );
        }

        // 3. Dividers
        else if (line.trim() === '---') {
          flushList(i);
          elements.push(<hr key={`hr-${i}`} className="my-6 border-white/5" />);
        }

        // 4. Bullet lists
        else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          if (activeListType && activeListType !== 'ul') {
            flushList(i);
          }
          activeListType = 'ul';
          activeList.push(parseInlineMarkdown(line.trim().slice(2)));
        }

        // 5. Numbered lists
        else if (/^\d+\.\s/.test(line.trim())) {
          if (activeListType && activeListType !== 'ol') {
            flushList(i);
          }
          activeListType = 'ol';
          const sliceIndex = line.trim().indexOf('.') + 1;
          activeList.push(parseInlineMarkdown(line.trim().slice(sliceIndex).trim()));
        }

        // 6. Blockquote
        else if (line.trim().startsWith('> ')) {
          flushList(i);
          elements.push(
            <blockquote key={`bq-${i}`} className="border-l-4 border-fuchsia-500 bg-white/5 rounded-r-xl p-4 my-4 italic text-sm md:text-base text-zinc-300 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.trim().slice(2)) }} />
            </blockquote>
          );
        }

        // 7. Regular paragraphs
        else if (line.trim() !== '') {
          flushList(i);
          elements.push(
            <p 
              key={`p-${i}`} 
              className="text-sm md:text-base text-zinc-300 leading-relaxed my-3"
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }}
            />
          );
        }
      }

      // Flush final elements if list remained active
      flushList(lines.length);

      return <div key={idx}>{elements}</div>;
    });
  };

  return <div className="markdown-body space-y-1">{renderSections()}</div>;
};

export default MarkdownRenderer;
