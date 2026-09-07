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
      <div className="w-full max-w-sm bg-[#141A25] border border-[#263143] rounded-[24px] shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-[#263143] flex justify-between items-center bg-[#1C2433] rounded-t-3xl">
          <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-[#141A25] rounded-lg border border-[#263143]">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full">
            {/* Selected Highlight Box */}
            <div className="absolute top-1/2 left-0 right-0 h-12 -mt-6 bg-[#3B82F6]/10 border-y border-[#3B82F6]/20 rounded-lg pointer-events-none z-10"></div>
            
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
                      isSelected ? 'text-3xl font-black text-[#3B82F6]' : 'text-xl font-bold text-slate-500 opacity-50'
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
              className="w-14 h-14 flex items-center justify-center rounded-[20px] bg-[#141A25] border border-[#263143] text-slate-300 active:scale-95 transition-transform"
            >
              <span className="text-2xl font-mono">−</span>
            </button>
            <button
              onClick={() => {
                onSave(selectedValue);
                onClose();
              }}
              className="flex-1 h-14 bg-[#3B82F6] hover:bg-[#2563EB] text-[#0B111A] font-black rounded-[20px] tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <Check className="w-5 h-5 stroke-[3]" /> Save Weight
            </button>
            <button
              onClick={() => {
                const idx = Math.min(options.length - 1, options.indexOf(selectedValue) + 1);
                scrollRef.current.scrollTop = idx * itemHeight;
              }}
              className="w-14 h-14 flex items-center justify-center rounded-[20px] bg-[#141A25] border border-[#263143] text-slate-300 active:scale-95 transition-transform"
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
      <div className="w-full max-w-md bg-[#141A25] border border-[#263143] rounded-[24px] shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col h-[70vh] animate-scale-in">
        <div className="p-4 border-b border-[#263143] flex gap-3 items-center bg-[#1C2433] rounded-t-3xl">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search exercises..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#141A25] border border-[#263143] rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-[#3B82F6] transition-all"
            />
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-white bg-[#141A25] rounded-xl border border-[#263143]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {query.length > 0 && !filtered.includes(query) && (
            <button 
              onClick={() => onSelect(query)}
              className="w-full p-3 text-left flex items-center justify-between rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-slate-200 font-bold active:bg-[#3B82F6]/20"
            >
              <span>+ Add "{query}"</span>
            </button>
          )}
          <div className="pt-2 pb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider ml-1">Popular & Recent</span>
          </div>
          {filtered.map(ex => (
            <button 
              key={ex}
              onClick={() => onSelect(ex)}
              className="w-full p-3.5 text-left flex items-center justify-between rounded-xl hover:bg-[#141A25] active:bg-[#27272a] text-slate-200 font-bold transition-all"
            >
              {ex}
              <Plus className="w-4 h-4 text-slate-500" />
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
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });
    const totalSessions = workouts.length;

    return (
      <div className="flex flex-col h-full animate-fade-in pb-8">
        <div className="pt-[22px] px-[22px] flex justify-between items-baseline">
          <div className="font-display text-[16px] text-[#F5F1EA] tracking-tight">
            GYM<span className="text-[#3B82F6]">TRACKER</span>
          </div>
          <div className="text-[11px] text-[#5A5A62] font-medium">{todayStr}</div>
        </div>

        <div className="flex mt-5 mx-[22px] border-y border-[#1c1c1f]">
          <div className="flex-1 py-3.5 text-left pr-2">
            <div className="font-display text-[22px] text-[#F5F1EA] leading-none">0</div>
            <div className="text-[10px] text-[#5A5A62] uppercase tracking-[0.04em] mt-1.5">Day streak</div>
          </div>
          <div className="flex-1 py-3.5 text-left border-l border-[#1c1c1f] pl-[14px]">
            <div className="font-display text-[22px] text-[#F5F1EA] leading-none">—</div>
            <div className="text-[10px] text-[#5A5A62] uppercase tracking-[0.04em] mt-1.5">Last lift</div>
          </div>
          <div className="flex-1 py-3.5 text-left border-l border-[#1c1c1f] pl-[14px]">
            <div className="font-display text-[22px] text-[#F5F1EA] leading-none">{totalSessions}</div>
            <div className="text-[10px] text-[#5A5A62] uppercase tracking-[0.04em] mt-1.5">Total sessions</div>
          </div>
        </div>

        <div className="mt-7 mx-[22px]">
          <div className="text-[12px] text-[#5A5A62] mb-1.5">No session running</div>
          <div className="font-display text-[34px] leading-[1.05] text-[#F5F1EA] tracking-tight">
            Ready to<br/>train.
          </div>
          <div className="mt-2.5 text-[13.5px] text-[#8a8a90] leading-relaxed max-w-[240px]">
            Log sets as you go. Every rep gets timestamped and compared to your last session.
          </div>

          <button
            onClick={() => startWorkout("New Workout")}
            className="mt-7 w-full bg-[#3B82F6] text-[#0A1628] border-none py-[18px] font-sans font-bold text-[15px] rounded-[4px] flex items-center justify-center gap-2 tracking-[0.01em] active:scale-[0.98] transition-transform"
          >
            <Play className="w-[14px] h-[14px] fill-current" />
            START WORKOUT
          </button>
        </div>

        <div className="flex justify-between items-baseline mx-[22px] mt-[34px] mb-3">
          <div className="text-[12px] text-[#F5F1EA] font-semibold tracking-[0.02em]">RECENT SESSIONS</div>
          <div className="text-[11px] text-[#5A5A62] cursor-pointer hover:text-white">View all</div>
        </div>

        {workouts.length === 0 ? (
          <div className="mx-[22px] border border-dashed border-[#2a2a2e] rounded-[4px] p-[22px_18px] text-left">
            <div className="text-[13px] text-[#cfcfd2] font-medium mb-1">Nothing logged yet</div>
            <div className="text-[12px] text-[#5A5A62] leading-relaxed">
              Start a workout above and it'll show up here with sets, weight, and duration.
            </div>
          </div>
        ) : (
          <div className="mx-[22px] space-y-3">
            {workouts.map(wo => {
              const isLegacy = !wo.exercises && !!wo.exercise_name;
              let title = wo.name || wo.exercise_name || "Workout";
              let exerciseCount = isLegacy ? 1 : (wo.exercises?.length || 0);
              let totalSets = isLegacy 
                ? (wo.sets?.length || 0) 
                : (wo.exercises?.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0) || 0);
              
              return (
                <div key={wo.id} className="border border-[#1c1c1f] bg-[#0A0A0B] rounded-[4px] p-4 flex justify-between items-center group">
                  <div>
                    <h4 className="font-bold text-[#F5F1EA] text-[15px]">{title}</h4>
                    <div className="text-[11px] text-[#5A5A62] mt-1 flex gap-2">
                      <span>{wo.date}</span>
                      {wo.duration && <span>· {wo.duration} min</span>}
                      <span>· {exerciseCount} exercises</span>
                    </div>
                  </div>
                  <button onClick={() => deleteWorkoutHistory(wo.id)} className="p-2 text-[#5A5A62] hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE WORKOUT VIEW
  // -------------------------------------------------------------
  if (viewState === 'active') {
    return (
      <div className="fixed inset-0 z-40 bg-[#0B111A] flex flex-col font-sans overflow-hidden">
        {/* Sticky Header */}
        <div className="bg-[#1C2433] border-b border-[#263143] px-4 py-3 flex items-center justify-between shrink-0 shadow-md relative z-10">
          <div className="flex flex-col">
            <input 
              type="text" 
              value={activeWorkout.name} 
              onChange={(e) => setActiveWorkout({...activeWorkout, name: e.target.value})}
              className="bg-transparent text-white font-black font-['Outfit'] text-xl focus:outline-none focus:text-white placeholder:text-slate-600 w-full"
            />
            <div className="flex items-center gap-2 text-xs font-mono text-white font-bold">
              <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {timerStr}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{activeWorkout.exercises.length} Exercises</span>
            </div>
          </div>
          <button 
            onClick={finishWorkout}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0B111A] font-black px-4 py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-sm interactive-element flex items-center gap-1"
          >
            Finish <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-32">
          {activeWorkout.exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
              <Dumbbell className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white font-['Outfit']">Empty Workout</h3>
              <p className="text-sm text-slate-400 max-w-[200px] mt-2">Add your first exercise to start tracking sets.</p>
            </div>
          ) : (
            activeWorkout.exercises.map((ex, exIdx) => (
              <div key={ex.id} className="glass-card rounded-[20px] bg-[#1C2433] border border-[#263143] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#263143] flex justify-between items-center bg-[#141A25]">
                  <h3 className="font-bold text-white text-base font-['Outfit'] text-white">{ex.name}</h3>
                </div>
                
                <div className="p-2 sm:p-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 px-2">
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
                        <div key={set.id} className={`grid grid-cols-12 gap-2 items-center px-2 py-1 rounded-xl transition-all ${isCompleted ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/20' : 'bg-[#141A25] border border-transparent hover:border-[#263143]'}`}>
                          <div className="col-span-2 text-center text-xs font-mono font-bold text-slate-400">
                            {set.setNumber}
                          </div>
                          
                          {/* Weight Button */}
                          <div className="col-span-3 flex justify-center">
                            <button 
                              onClick={() => setPickerConfig({ isOpen: true, type: 'weight', exId: ex.id, setId: set.id, initial: set.weight })}
                              className={`w-full py-1.5 rounded-lg text-sm font-mono font-bold transition-colors ${isCompleted ? 'text-slate-300' : 'text-slate-200 bg-[#263143] hover:bg-[#3f3f46]'}`}
                            >
                              {set.weight}
                            </button>
                          </div>

                          {/* Reps Button */}
                          <div className="col-span-3 flex justify-center">
                            <button 
                              onClick={() => setPickerConfig({ isOpen: true, type: 'reps', exId: ex.id, setId: set.id, initial: set.reps })}
                              className={`w-full py-1.5 rounded-lg text-sm font-mono font-bold transition-colors ${isCompleted ? 'text-slate-300' : 'text-slate-200 bg-[#263143] hover:bg-[#3f3f46]'}`}
                            >
                              {set.reps}
                            </button>
                          </div>

                          {/* Action / Checkbox */}
                          <div className="col-span-4 flex justify-center items-center gap-1.5">
                            {!isCompleted && ex.sets.length > 1 && (
                              <button onClick={() => removeSet(ex.id, set.id)} className="p-1.5 text-slate-600 hover:text-rose-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => toggleSetComplete(ex.id, set.id)}
                              className={`w-10 py-1.5 rounded-lg flex items-center justify-center transition-all ${isCompleted ? 'bg-[#3B82F6] text-[#0B111A] shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[#27272a] text-slate-400 hover:bg-[#3f3f46]'}`}
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
                    className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-[#263143] text-xs font-bold text-white uppercase tracking-wider font-mono hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/20 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Set
                  </button>
                </div>
              </div>
            ))
          )}

          <button 
            onClick={() => setShowExSearch(true)}
            className="w-full py-4 rounded-[20px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-white font-bold uppercase tracking-wider font-mono interactive-element flex items-center justify-center gap-2 shadow-sm"
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
      <div className="fixed inset-0 z-50 bg-[#0B111A] flex flex-col font-sans overflow-y-auto">
        <div className="p-6 sm:p-8 flex-1 max-w-lg mx-auto w-full flex flex-col items-center text-center justify-center min-h-screen space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-scale-in">
            <Check className="w-10 h-10 text-[#0B111A] stroke-[3]" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black font-['Outfit'] text-white">Workout Complete!</h1>
            <p className="text-slate-400 mt-2 font-mono">{activeWorkout.name}</p>
          </div>

          <div className="w-full glass-card bg-[#1C2433] border border-[#263143] rounded-[24px] p-6 shadow-xl space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-[#263143] pb-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Duration</p>
                <p className="text-xl font-black text-white font-mono mt-1">{activeWorkout.duration} min</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Volume</p>
                <p className="text-xl font-black text-white font-mono mt-1">{totalVolume} kg</p>
              </div>
            </div>
            
            <div className="text-left space-y-2">
              <p className="text-xs text-slate-300 font-bold mb-3">{activeWorkout.exercises.length} Exercises · {completedSets}/{totalSets} Sets Completed</p>
              {activeWorkout.exercises.map(ex => (
                <div key={ex.id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">{ex.name}</span>
                  <span className="text-slate-500 font-mono">{ex.sets.filter(s => s.completed).length} sets</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full space-y-3 pt-4">
            <button 
              onClick={saveWorkout}
              className="w-full py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-[#0B111A] font-black rounded-full shadow-lg interactive-element flex items-center justify-center gap-2 uppercase tracking-wider font-mono text-sm"
            >
              <Save className="w-5 h-5 stroke-[2.5]" /> Save to History
            </button>
            <button 
              onClick={() => setViewState('active')}
              className="w-full py-4 bg-transparent border border-[#263143] text-slate-400 hover:text-white font-bold rounded-[20px] interactive-element uppercase tracking-wider font-mono text-xs"
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
