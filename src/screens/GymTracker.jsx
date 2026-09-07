import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import {
  Dumbbell, Utensils, Plus, Trash2, Calendar, Check, Search, X, Play, StopCircle, ArrowLeft, History, Timer, AlertCircle, ChevronDown, ChevronRight, Save
} from 'lucide-react';

// --- CUSTOM WHEEL PICKER MODAL ---
const WheelPickerModal = ({ isOpen, onClose, onSave, initialValue, min, max, step, title, unit }) => {
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
    if (isOpen && scrollRef.current) {
      const idx = options.findIndex((o) => o === initialValue);
      if (idx !== -1) {
        scrollRef.current.scrollTop = idx * itemHeight;
        setSelectedValue(initialValue);
      }
    }
  }, [isOpen, initialValue, options]);

  const handleScroll = (e) => {
    const st = e.target.scrollTop;
    const idx = Math.max(0, Math.min(options.length - 1, Math.round(st / itemHeight)));
    setSelectedValue(options[idx]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-sm bg-[#0c0c0e] border border-[#27272a] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#121214] rounded-t-3xl">
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] rounded-lg border border-[#27272a]">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full">
            {/* Selected Highlight Box */}
            <div className="absolute top-1/2 left-0 right-0 h-12 -mt-6 bg-emerald-500/10 border-y border-emerald-500/30 rounded-lg pointer-events-none z-10"></div>
            
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
                    className="h-12 snap-center flex items-center justify-center text-center transition-all duration-150 cursor-pointer"
                    onClick={() => {
                      scrollRef.current.scrollTop = options.indexOf(opt) * itemHeight;
                    }}
                  >
                    <span className={`font-mono transition-all ${
                      isSelected ? 'text-3xl font-black text-emerald-400' : 'text-xl font-bold text-zinc-500 opacity-50'
                    }`}>
                      {opt} {unit}
                    </span>
                  </div>
                );
              })}
              <div style={{ height: '96px' }} className="shrink-0" />
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-6 gap-3">
            <button
              onClick={() => {
                const idx = Math.max(0, options.indexOf(selectedValue) - 1);
                scrollRef.current.scrollTop = idx * itemHeight;
              }}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#18181b] border border-[#27272a] text-zinc-300 active:scale-95 transition-transform"
            >
              <span className="text-2xl font-mono">−</span>
            </button>
            <button
              onClick={() => {
                onSave(selectedValue);
                onClose();
              }}
              className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-2xl tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Check className="w-5 h-5 stroke-[3]" /> Save Weight
            </button>
            <button
              onClick={() => {
                const idx = Math.min(options.length - 1, options.indexOf(selectedValue) + 1);
                scrollRef.current.scrollTop = idx * itemHeight;
              }}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#18181b] border border-[#27272a] text-zinc-300 active:scale-95 transition-transform"
            >
              <span className="text-2xl font-mono">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- EXERCISE SEARCH MODAL ---
const ExerciseSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  
  const popular = [
    'Bench Press', 'Incline Dumbbell Press', 'Squat', 'Leg Press', 'Deadlift', 
    'Lat Pulldown', 'Barbell Row', 'Overhead Press', 'Lateral Raises', 
    'Bicep Curl', 'Tricep Pushdown', 'Leg Curl', 'Leg Extension'
  ];

  const filtered = query.length > 0 
    ? popular.filter(p => p.toLowerCase().includes(query.toLowerCase()))
    : popular;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-[#0c0c0e] border border-[#27272a] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col h-[70vh] animate-scale-in">
        <div className="p-4 border-b border-[#27272a] flex gap-3 items-center bg-[#121214] rounded-t-3xl">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search exercises..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <button onClick={onClose} className="p-2.5 text-zinc-400 hover:text-white bg-[#18181b] rounded-xl border border-[#27272a]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {query.length > 0 && !filtered.includes(query) && (
            <button 
              onClick={() => onSelect(query)}
              className="w-full p-3 text-left flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold active:bg-emerald-500/20"
            >
              <span>+ Add "{query}"</span>
            </button>
          )}
          <div className="pt-2 pb-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider ml-1">Popular & Recent</span>
          </div>
          {filtered.map(ex => (
            <button 
              key={ex}
              onClick={() => onSelect(ex)}
              className="w-full p-3.5 text-left flex items-center justify-between rounded-xl hover:bg-[#18181b] active:bg-[#27272a] text-zinc-200 font-bold transition-all"
            >
              {ex}
              <Plus className="w-4 h-4 text-zinc-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- MAIN GYM TRACKER ---
export default function GymTracker() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  
  // App States: 'idle', 'active', 'summary'
  const [viewState, setViewState] = useState('idle');
  
  // Active Workout State
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timerStr, setTimerStr] = useState('00:00');
  
  // Modals
  const [showExSearch, setShowExSearch] = useState(false);
  const [pickerConfig, setPickerConfig] = useState(null); // { isOpen, type: 'weight'|'reps', exId, setId, initial }

  const refreshAll = async () => {
    try {
      const allWorkouts = await dataService.getWorkouts();
      // Sort newest first based on date & startTime if available
      allWorkouts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setWorkouts(allWorkouts || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshAll();
    window.addEventListener('unitrack-data-updated', refreshAll);
    return () => window.removeEventListener('unitrack-data-updated', refreshAll);
  }, []);

  // Timer logic for active workout
  useEffect(() => {
    let interval;
    if (viewState === 'active' && activeWorkout?.startTime) {
      interval = setInterval(() => {
        const diff = Math.floor((new Date() - new Date(activeWorkout.startTime)) / 1000);
        const m = Math.floor(diff / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setTimerStr(`${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, activeWorkout?.startTime]);

  const startWorkout = (name = "New Workout") => {
    setActiveWorkout({
      id: 'wo_' + Date.now().toString(),
      name,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      exercises: []
    });
    setViewState('active');
  };

  const addExercise = (name) => {
    setActiveWorkout(prev => {
      const newEx = {
        id: 'ex_' + Date.now().toString(),
        name,
        sets: [
          { id: 'set_' + Date.now().toString(), setNumber: 1, weight: 0, reps: 10, completed: false }
        ]
      };
      return { ...prev, exercises: [...prev.exercises, newEx] };
    });
    setShowExSearch(false);
  };

  const addSet = (exId) => {
    setActiveWorkout(prev => {
      const exIndex = prev.exercises.findIndex(e => e.id === exId);
      if (exIndex === -1) return prev;
      const ex = prev.exercises[exIndex];
      const lastSet = ex.sets[ex.sets.length - 1];
      
      const newSet = {
        id: 'set_' + Date.now().toString(),
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : 0,
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      };
      
      const updatedExercises = [...prev.exercises];
      updatedExercises[exIndex] = { ...ex, sets: [...ex.sets, newSet] };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const removeSet = (exId, setId) => {
    setActiveWorkout(prev => {
      const exIndex = prev.exercises.findIndex(e => e.id === exId);
      if (exIndex === -1) return prev;
      const ex = prev.exercises[exIndex];
      const filteredSets = ex.sets.filter(s => s.id !== setId).map((s, i) => ({ ...s, setNumber: i + 1 }));
      
      const updatedExercises = [...prev.exercises];
      updatedExercises[exIndex] = { ...ex, sets: filteredSets };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const toggleSetComplete = (exId, setId) => {
    setActiveWorkout(prev => {
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
        };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const updateSetData = (exId, setId, field, value) => {
    setActiveWorkout(prev => {
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const finishWorkout = () => {
    if (activeWorkout.exercises.length === 0) {
      setViewState('idle');
      setActiveWorkout(null);
      return;
    }
    const endTime = new Date();
    const durationMins = Math.round((endTime - new Date(activeWorkout.startTime)) / 60000);
    setActiveWorkout(prev => ({ ...prev, endTime: endTime.toISOString(), duration: durationMins }));
    setViewState('summary');
  };

  const saveWorkout = async () => {
    if (!user) return;
    await dataService.saveWorkout({
      ...activeWorkout,
      userId: user.id
    });
    setViewState('idle');
    setActiveWorkout(null);
    await refreshAll();
  };

  const deleteWorkoutHistory = async (id) => {
    if (window.confirm("Delete this workout from history?")) {
      await dataService.deleteWorkout(id);
      await refreshAll();
    }
  };

  // -------------------------------------------------------------
  // IDLE VIEW (Hero + History)
  // -------------------------------------------------------------
  if (viewState === 'idle') {
    return (
      <div className="space-y-6 pb-28 px-4 max-w-4xl mx-auto pt-2 animate-fade-in font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-xl font-black font-['Outfit'] text-white uppercase tracking-wider">Gym Tracker</h1>
        </div>

        {/* Hero Card */}
        <div className="glass-card bg-[#111827] rounded-3xl p-6 sm:p-8 border border-[#1f2937] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mb-2">Ready to train?</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Start a new session, track your sets, and log your progressive overload instantly.</p>
          
          <button
            onClick={() => startWorkout("New Workout")}
            className="w-full max-w-xs py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] interactive-element flex items-center justify-center space-x-2 text-base tracking-wider uppercase font-mono transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 stroke-[3]" />
            <span>Start Workout</span>
          </button>
        </div>

        {/* History List */}
        <div className="pt-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-emerald-400" /> Past Workout Sessions
          </h3>

          {workouts.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-zinc-500 text-sm font-mono border border-white/[0.02]">
              No workouts logged yet. Start one above!
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map(wo => {
                // Determine if it's the new complex format or legacy format
                const isLegacy = !wo.exercises && !!wo.exercise_name;
                
                let title = wo.name || wo.exercise_name || "Workout";
                let exerciseCount = isLegacy ? 1 : (wo.exercises?.length || 0);
                let totalSets = isLegacy 
                  ? (wo.sets?.length || 0) 
                  : (wo.exercises?.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0) || 0);
                
                return (
                  <div key={wo.id} className="glass-card glass-card-hover rounded-2xl p-5 border border-white/[0.04]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white text-lg font-['Outfit']">{title}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {wo.date}</span>
                          {wo.duration && <span className="flex items-center gap-1 text-emerald-400"><Timer className="w-3 h-3" /> {wo.duration} min</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteWorkoutHistory(wo.id)} className="p-1.5 text-zinc-500 hover:text-rose-400 bg-white/[0.02] hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-zinc-300 font-medium">
                      {exerciseCount} Exercises · {totalSets} Sets
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE WORKOUT VIEW
  // -------------------------------------------------------------
  if (viewState === 'active') {
    return (
      <div className="fixed inset-0 z-40 bg-[#09090b] flex flex-col font-sans overflow-hidden">
        {/* Sticky Header */}
        <div className="bg-[#121214] border-b border-[#27272a] px-4 py-3 flex items-center justify-between shrink-0 shadow-md relative z-10">
          <div className="flex flex-col">
            <input 
              type="text" 
              value={activeWorkout.name} 
              onChange={(e) => setActiveWorkout({...activeWorkout, name: e.target.value})}
              className="bg-transparent text-white font-black font-['Outfit'] text-xl focus:outline-none focus:text-emerald-400 placeholder:text-zinc-600 w-full"
            />
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {timerStr}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">{activeWorkout.exercises.length} Exercises</span>
            </div>
          </div>
          <button 
            onClick={finishWorkout}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-4 py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-sm interactive-element flex items-center gap-1"
          >
            Finish <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-32">
          {activeWorkout.exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
              <Dumbbell className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-bold text-white font-['Outfit']">Empty Workout</h3>
              <p className="text-sm text-zinc-400 max-w-[200px] mt-2">Add your first exercise to start tracking sets.</p>
            </div>
          ) : (
            activeWorkout.exercises.map((ex, exIdx) => (
              <div key={ex.id} className="glass-card rounded-2xl bg-[#121214] border border-[#27272a] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
                  <h3 className="font-bold text-white text-base font-['Outfit'] text-emerald-400">{ex.name}</h3>
                </div>
                
                <div className="p-2 sm:p-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono uppercase font-bold text-zinc-500 mb-2 px-2">
                    <div className="col-span-2 text-center">Set</div>
                    <div className="col-span-3 text-center">kg</div>
                    <div className="col-span-3 text-center">Reps</div>
                    <div className="col-span-4 text-center">Done</div>
                  </div>

                  {/* Sets */}
                  <div className="space-y-1.5">
                    {ex.sets.map((set, setIdx) => {
                      const isCompleted = set.completed;
                      return (
                        <div key={set.id} className={`grid grid-cols-12 gap-2 items-center px-2 py-1 rounded-xl transition-all ${isCompleted ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-[#18181b] border border-transparent hover:border-[#27272a]'}`}>
                          <div className="col-span-2 text-center text-xs font-mono font-bold text-zinc-400">
                            {set.setNumber}
                          </div>
                          
                          {/* Weight Button */}
                          <div className="col-span-3 flex justify-center">
                            <button 
                              onClick={() => setPickerConfig({ isOpen: true, type: 'weight', exId: ex.id, setId: set.id, initial: set.weight })}
                              className={`w-full py-1.5 rounded-lg text-sm font-mono font-bold transition-colors ${isCompleted ? 'text-emerald-200' : 'text-white bg-[#27272a] hover:bg-[#3f3f46]'}`}
                            >
                              {set.weight}
                            </button>
                          </div>

                          {/* Reps Button */}
                          <div className="col-span-3 flex justify-center">
                            <button 
                              onClick={() => setPickerConfig({ isOpen: true, type: 'reps', exId: ex.id, setId: set.id, initial: set.reps })}
                              className={`w-full py-1.5 rounded-lg text-sm font-mono font-bold transition-colors ${isCompleted ? 'text-emerald-200' : 'text-white bg-[#27272a] hover:bg-[#3f3f46]'}`}
                            >
                              {set.reps}
                            </button>
                          </div>

                          {/* Action / Checkbox */}
                          <div className="col-span-4 flex justify-center items-center gap-1.5">
                            {!isCompleted && ex.sets.length > 1 && (
                              <button onClick={() => removeSet(ex.id, set.id)} className="p-1.5 text-zinc-600 hover:text-rose-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => toggleSetComplete(ex.id, set.id)}
                              className={`w-10 py-1.5 rounded-lg flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#27272a] text-zinc-400 hover:bg-[#3f3f46]'}`}
                            >
                              <Check className={`w-4 h-4 ${isCompleted ? 'stroke-[3]' : 'stroke-[2]'}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => addSet(ex.id)}
                    className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-[#27272a] text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Set
                  </button>
                </div>
              </div>
            ))
          )}

          <button 
            onClick={() => setShowExSearch(true)}
            className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider font-mono interactive-element flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add Exercise
          </button>
        </div>

        {/* Modals placed inside active view */}
        <ExerciseSearchModal 
          isOpen={showExSearch} 
          onClose={() => setShowExSearch(false)} 
          onSelect={addExercise} 
        />

        {pickerConfig?.isOpen && (
          <WheelPickerModal
            isOpen={true}
            onClose={() => setPickerConfig(null)}
            initialValue={pickerConfig.initial}
            min={0}
            max={pickerConfig.type === 'weight' ? 200 : 50}
            step={pickerConfig.type === 'weight' ? 2.5 : 1}
            title={`Select ${pickerConfig.type}`}
            unit={pickerConfig.type === 'weight' ? 'kg' : 'reps'}
            onSave={(val) => updateSetData(pickerConfig.exId, pickerConfig.setId, pickerConfig.type, val)}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // SUMMARY VIEW
  // -------------------------------------------------------------
  if (viewState === 'summary') {
    const totalSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
    const totalVolume = activeWorkout.exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(s => s.completed).reduce((vol, s) => vol + (s.weight * s.reps), 0)
    , 0);

    return (
      <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans overflow-y-auto">
        <div className="p-6 sm:p-8 flex-1 max-w-lg mx-auto w-full flex flex-col items-center text-center justify-center min-h-screen space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-scale-in">
            <Check className="w-10 h-10 text-zinc-950 stroke-[3]" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black font-['Outfit'] text-white">Workout Complete!</h1>
            <p className="text-zinc-400 mt-2 font-mono">{activeWorkout.name}</p>
          </div>

          <div className="w-full glass-card bg-[#121214] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-[#27272a] pb-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Duration</p>
                <p className="text-xl font-black text-emerald-400 font-mono mt-1">{activeWorkout.duration} min</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Volume</p>
                <p className="text-xl font-black text-emerald-400 font-mono mt-1">{totalVolume} kg</p>
              </div>
            </div>
            
            <div className="text-left space-y-2">
              <p className="text-xs text-zinc-300 font-bold mb-3">{activeWorkout.exercises.length} Exercises · {completedSets}/{totalSets} Sets Completed</p>
              {activeWorkout.exercises.map(ex => (
                <div key={ex.id} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold">{ex.name}</span>
                  <span className="text-zinc-500 font-mono">{ex.sets.filter(s => s.completed).length} sets</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full space-y-3 pt-4">
            <button 
              onClick={saveWorkout}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-2xl shadow-lg interactive-element flex items-center justify-center gap-2 uppercase tracking-wider font-mono text-sm"
            >
              <Save className="w-5 h-5 stroke-[2.5]" /> Save to History
            </button>
            <button 
              onClick={() => setViewState('active')}
              className="w-full py-4 bg-transparent border border-[#27272a] text-zinc-400 hover:text-white font-bold rounded-2xl interactive-element uppercase tracking-wider font-mono text-xs"
            >
              Keep Editing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
