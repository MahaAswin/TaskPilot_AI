import React, { useState } from 'react';
import { Code2, Play, Terminal, HelpCircle, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const CodingPractice = () => {
  const { showSuccess, showError } = useToast();
  
  const [activeCode, setActiveCode] = useState(`function findMax(arr) {\n  // Write your code here\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}`);
  const [isRunning, setIsRunning] = useState(false);
  const [testCasesStatus, setTestCasesStatus] = useState('Idle'); // 'Idle' | 'Running' | 'Passed' | 'Failed'

  const problem = {
    title: 'Find Maximum Element in Array',
    difficulty: 'Easy',
    topic: 'Arrays & Sorting',
    description: 'Write a function `findMax(arr)` that returns the largest element inside the provided array of integers.',
    examples: [
      { input: '[1, 5, 3, 9, 2]', output: '9' },
      { input: '[-10, -5, -2, -20]', output: '-2' }
    ]
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTestCasesStatus('Running');

    setTimeout(() => {
      setIsRunning(false);
      // Simulate evaluation result
      setTestCasesStatus('Passed');
      showSuccess('All mock test cases passed successfully!');
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto select-none">
      
      {/* Left panel: Problem Details */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Coding Challenge</h3>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
            {problem.difficulty}
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">{problem.title}</h4>
          <span className="text-[9px] font-bold text-slate-400 font-mono">Topic: {problem.topic}</span>
        </div>

        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
          {problem.description}
        </p>

        {/* Examples */}
        <div className="space-y-2.5">
          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Example Test Cases</span>
          {problem.examples.map((ex, idx) => (
            <div key={idx} className="p-3 border border-slate-200 bg-slate-50/50 rounded-xl space-y-1 text-[9px] font-mono text-slate-500">
              <div><strong className="text-slate-700">Input:</strong> {ex.input}</div>
              <div><strong className="text-slate-700">Output:</strong> {ex.output}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: Editor box */}
      <div className="flex flex-col border border-slate-200 bg-slate-950 rounded-2xl shadow-soft overflow-hidden h-[340px]">
        {/* Editor Toolbar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none">
          <span className="text-[9px] font-bold text-slate-400 font-mono">main.js</span>
          
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            <span>Run Code</span>
          </button>
        </div>

        {/* Editor Area */}
        <textarea
          value={activeCode}
          onChange={(e) => setActiveCode(e.target.value)}
          className="flex-1 p-4 bg-transparent text-[10px] font-mono text-slate-100 focus:outline-none resize-none leading-relaxed"
        />

        {/* Console logs output */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono select-none">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Test Cases Status:</span>
          </div>

          {testCasesStatus === 'Idle' && <span className="text-slate-400 font-bold uppercase">IDLE</span>}
          {testCasesStatus === 'Running' && <span className="text-indigo-400 font-bold uppercase animate-pulse">EVALUATING...</span>}
          {testCasesStatus === 'Passed' && (
            <span className="text-emerald-500 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PASSED (2/2)</span>
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default CodingPractice;
