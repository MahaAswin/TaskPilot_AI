import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Bell, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastProvider';

export const FocusTimer = () => {
  const { showSuccess } = useToast();

  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      showSuccess(mode === 'focus' ? '🎉 Focus Session completed! Take a 5-minute break.' : 'Break completed! Ready for your next focus session.');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = (newMode = mode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-6 select-none max-w-xl mx-auto">
      
      {/* Header Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => resetTimer('focus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'focus' 
                ? 'bg-amber-500 text-white shadow-soft' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Focus Mode (25m)
          </button>
          <button
            onClick={() => resetTimer('break')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'break' 
                ? 'bg-emerald-500 text-white shadow-soft' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Break Mode (5m)
          </button>
        </div>

        <span className="text-[10px] font-mono text-slate-400">Pomodoro Timer</span>
      </div>

      {/* Timer Counter Circle Display */}
      <div className="text-center space-y-4 py-4">
        <div className="text-5xl font-black font-mono tracking-tight text-slate-900 drop-shadow-xs">
          {formatTime(secondsLeft)}
        </div>
        <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
          {mode === 'focus' ? '🔥 Focus Block Active' : '☕ Rest & Re-charge'}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white flex items-center gap-2 shadow-glow transition-all cursor-pointer ${
            isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isActive ? 'Pause Timer' : 'Start Timer'}</span>
        </button>

        <button
          onClick={() => resetTimer()}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all cursor-pointer border border-slate-200/60"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Distraction Count Tracker */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" /> Distraction Counter:
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-800">{distractionCount} Logged</span>
          <button
            onClick={() => setDistractionCount(prev => prev + 1)}
            className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
          >
            + Distraction
          </button>
        </div>
      </div>

    </div>
  );
};

export default FocusTimer;
