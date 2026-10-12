import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { haptics } from '../../utils/haptics';

export default function WheelPickerModal({
  isOpen,
  onClose,
  onSave,
  initialValue = 0,
  min = 0,
  max = 250,
  step = 2.5,
  title = 'Select Value',
  unit = 'kg'
}) {
  const options = useMemo(() => {
    const opts = [];
    for (let i = min; i <= max; i += step) {
      opts.push(Number(i.toFixed(2)));
    }
    return opts;
  }, [min, max, step]);

  const [selectedValue, setSelectedValue] = useState(initialValue);
  const scrollRef = useRef(null);
  const itemHeight = 48; // px

  useEffect(() => {
    if (isOpen) {
      setSelectedValue(initialValue);
      setTimeout(() => {
        if (scrollRef.current) {
          const idx = options.findIndex((o) => Math.abs(o - initialValue) < 0.01);
          if (idx !== -1) {
            scrollRef.current.scrollTop = idx * itemHeight;
          }
        }
      }, 50);
    }
  }, [isOpen, initialValue, options]);

  const handleScroll = (e) => {
    const st = e.target.scrollTop;
    const idx = Math.max(0, Math.min(options.length - 1, Math.round(st / itemHeight)));
    if (options[idx] !== selectedValue) {
      setSelectedValue(options[idx]);
      haptics.light();
    }
  };

  const adjustStep = (direction) => {
    const currentIndex = options.indexOf(selectedValue);
    const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction));
    const newVal = options[newIndex];
    setSelectedValue(newVal);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = newIndex * itemHeight;
    }
    haptics.light();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-[24px] shadow-2xl flex flex-col animate-scale-in border overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-4 flex justify-between items-center border-b"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h3 className="font-bold text-sm tracking-wide uppercase font-mono">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-lg border transition-colors tap-target flex items-center justify-center"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Wheel Body */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full">
            {/* Highlight selection band */}
            <div 
              className="absolute top-1/2 left-0 right-0 h-12 -mt-6 rounded-xl pointer-events-none z-10 border"
              style={{
                backgroundColor: 'var(--color-accent-subtle)',
                borderColor: 'var(--color-accent-border)'
              }}
            />
            
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-[240px] w-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div style={{ height: '96px' }} className="shrink-0" />
              {options.map((opt) => {
                const isSelected = opt === selectedValue;
                return (
                  <div 
                    key={opt}
                    className="h-12 snap-center flex items-center justify-center text-center transition-all cursor-pointer select-none"
                    onClick={() => {
                      setSelectedValue(opt);
                      if (scrollRef.current) {
                        scrollRef.current.scrollTop = options.indexOf(opt) * itemHeight;
                      }
                      haptics.light();
                    }}
                  >
                    <span 
                      className={`font-mono tabular-nums transition-all ${
                        isSelected 
                          ? 'text-3xl font-black text-blue-500 scale-110' 
                          : 'text-lg font-semibold text-slate-500 opacity-40'
                      }`}
                    >
                      {opt} {unit}
                    </span>
                  </div>
                );
              })}
              <div style={{ height: '96px' }} className="shrink-0" />
            </div>
          </div>

          {/* Stepper buttons & Save button */}
          <div className="w-full flex items-center justify-between mt-6 gap-3">
            <button
              type="button"
              onClick={() => adjustStep(-1)}
              className="w-14 h-14 flex items-center justify-center rounded-[20px] border active:scale-95 transition-transform tap-target text-slate-200"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Minus className="w-6 h-6 stroke-[2.5]" />
            </button>
            
            <button
              type="button"
              onClick={() => {
                haptics.success();
                onSave(selectedValue);
                onClose();
              }}
              className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-[20px] tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-blue-500/20"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Confirm</span>
            </button>
            
            <button
              type="button"
              onClick={() => adjustStep(1)}
              className="w-14 h-14 flex items-center justify-center rounded-[20px] border active:scale-95 transition-transform tap-target text-slate-200"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
