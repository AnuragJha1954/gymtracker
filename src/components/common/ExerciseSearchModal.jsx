import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Dumbbell, Filter } from 'lucide-react';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '../../data/exerciseLibrary';
import { Chip } from './UIElements';
import { haptics } from '../../utils/haptics';

export default function ExerciseSearchModal({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  const filteredExercises = useMemo(() => {
    let list = EXERCISE_LIBRARY;
    if (selectedMuscle !== 'All') {
      list = list.filter(e => e.muscle.toLowerCase() === selectedMuscle.toLowerCase());
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q));
    }
    return list;
  }, [query, selectedMuscle]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-[24px] border shadow-2xl flex flex-col h-[75vh] max-h-[680px] overflow-hidden animate-scale-in"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input */}
        <div 
          className="p-4 border-b flex gap-3 items-center shrink-0"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search 150+ exercises or muscles..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border transition-all"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)'
              }}
            />
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-white rounded-xl border transition-colors tap-target flex items-center justify-center"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Muscle group filter chips */}
        <div 
          className="px-4 py-2.5 border-b overflow-x-auto flex gap-1.5 no-scrollbar shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {MUSCLE_GROUPS.map((m) => (
            <Chip 
              key={m}
              label={m}
              active={selectedMuscle === m}
              onClick={() => {
                setSelectedMuscle(m);
                haptics.light();
              }}
            />
          ))}
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {/* Custom add prompt if query typed and doesn't match */}
          {query.trim().length > 0 && !filteredExercises.some(e => e.name.toLowerCase() === query.toLowerCase().trim()) && (
            <button 
              type="button"
              onClick={() => {
                haptics.success();
                onSelect(query.trim());
              }}
              className="w-full p-3.5 text-left flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold active:scale-[0.98] transition-transform"
            >
              <span>+ Add custom: "{query.trim()}"</span>
              <Plus className="w-4 h-4" />
            </button>
          )}

          {filteredExercises.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No exercises found for "{query}". Tap above to add it as custom!
            </div>
          )}

          {filteredExercises.map((ex) => (
            <button 
              key={ex.id}
              type="button"
              onClick={() => {
                haptics.light();
                onSelect(ex.name);
              }}
              className="w-full p-3.5 text-left flex items-center justify-between rounded-xl hover:bg-slate-800/60 active:scale-[0.99] transition-all border border-transparent hover:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{ex.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="text-blue-400 font-medium">{ex.muscle}</span>
                    <span>•</span>
                    <span>{ex.equipment}</span>
                  </div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500 hover:text-white shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
