import React, { useState, useEffect } from 'react';
import { Timer, X, Plus, Minus, RotateCcw } from 'lucide-react';
import { haptics } from '../../utils/haptics';

export default function RestTimerBar({
  initialSeconds = 90,
  onFinish,
  onDismiss
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setTotalSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      haptics.celebratePR();
      if (onFinish) onFinish();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          haptics.celebratePR();
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onFinish]);

  const addTime = (delta) => {
    haptics.light();
    setSecondsLeft((prev) => Math.max(0, prev + delta));
    setTotalSeconds((prev) => Math.max(prev, prev + delta));
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  if (secondsLeft <= 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto animate-slide-up">
      <div 
        className="rounded-2xl p-3 shadow-2xl border flex flex-col gap-2 overflow-hidden backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(14, 19, 31, 0.92)',
          borderColor: 'var(--color-border)'
        }}
      >
        {/* Progress Fill Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Timer className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rest Timer</span>
              <div className="text-xl font-black font-mono tabular-nums text-white leading-none">
                {mins}:{secs}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={() => addTime(-15)}
              className="px-2.5 py-1.5 rounded-lg border text-xs font-bold font-mono text-slate-300 hover:text-white bg-slate-800/80 active:scale-95 transition-transform"
              style={{ borderColor: 'var(--color-border)' }}
            >
              -15s
            </button>
            
            <button 
              type="button"
              onClick={() => addTime(15)}
              className="px-2.5 py-1.5 rounded-lg border text-xs font-bold font-mono text-slate-300 hover:text-white bg-slate-800/80 active:scale-95 transition-transform"
              style={{ borderColor: 'var(--color-border)' }}
            >
              +15s
            </button>

            <button 
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
