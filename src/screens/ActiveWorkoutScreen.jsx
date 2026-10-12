import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Check, Plus, Trash2, Timer, X, ArrowLeft, 
  Dumbbell, Flame, Award, ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';
import WheelPickerModal from '../components/common/WheelPickerModal';
import ExerciseSearchModal from '../components/common/ExerciseSearchModal';
import RestTimerBar from '../components/common/RestTimerBar';
import { Button, Card } from '../components/common/UIElements';
import { haptics } from '../utils/haptics';
import { wakeLockService } from '../utils/wakeLock';
import { calculate1RM, checkPersonalRecords, getLastSessionPerformance } from '../utils/oneRepMax';

export default function ActiveWorkoutScreen({
  activeWorkout,
  setActiveWorkout,
  pastWorkouts = [],
  onFinishWorkout,
  onCancelWorkout,
  defaultRestSeconds = 90
}) {
  const [timerStr, setTimerStr] = useState('00:00');
  const [pickerConfig, setPickerConfig] = useState(null); // { isOpen, type: 'weight'|'reps', exId, setId, initial }
  const [showExSearch, setShowExSearch] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [activeRestTimer, setActiveRestTimer] = useState(null); // { seconds }

  // Screen Wake Lock
  useEffect(() => {
    wakeLockService.request();
    return () => {
      wakeLockService.release();
    };
  }, []);

  // Running workout timer
  useEffect(() => {
    if (!activeWorkout?.startTime) return;
    const interval = setInterval(() => {
      const diff = Math.floor((new Date() - new Date(activeWorkout.startTime)) / 1000);
      const m = Math.floor(diff / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setTimerStr(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout?.startTime]);

  // Auto-persist active workout to localStorage
  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem('gymtracker_in_progress_workout', JSON.stringify(activeWorkout));
    }
  }, [activeWorkout]);

  // Add a new set to an exercise
  const handleAddSet = (exId) => {
    setActiveWorkout(prev => {
      const exercises = [...prev.exercises];
      const exIndex = exercises.findIndex(e => e.id === exId);
      if (exIndex === -1) return prev;
      const ex = exercises[exIndex];
      const lastSet = ex.sets[ex.sets.length - 1];

      const newSet = {
        id: 's_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : (ex.defaultWeight || 20),
        reps: lastSet ? lastSet.reps : (ex.targetReps || 10),
        completed: false,
        type: 'working'
      };

      exercises[exIndex] = { ...ex, sets: [...ex.sets, newSet] };
      return { ...prev, exercises };
    });
    haptics.light();
  };

  // Remove set
  const handleRemoveSet = (exId, setId) => {
    setActiveWorkout(prev => {
      const exercises = [...prev.exercises];
      const exIndex = exercises.findIndex(e => e.id === exId);
      if (exIndex === -1) return prev;
      const ex = exercises[exIndex];
      const filtered = ex.sets.filter(s => s.id !== setId).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      exercises[exIndex] = { ...ex, sets: filtered };
      return { ...prev, exercises };
    });
    haptics.light();
  };

  // Toggle set completed with auto rest timer
  const handleToggleComplete = (exId, setId, exRestSeconds = defaultRestSeconds) => {
    setActiveWorkout(prev => {
      const exercises = prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id !== setId) return s;
            const willBeCompleted = !s.completed;
            
            if (willBeCompleted) {
              // Trigger rest timer
              setActiveRestTimer({ seconds: ex.restSeconds || exRestSeconds || 90 });
              // Check if PR hit
              const pr = checkPersonalRecords(ex.name, s.weight, s.reps, pastWorkouts);
              if (pr.isWeightPR || pr.isRepPR || pr.is1RMPR) {
                haptics.celebratePR();
              } else {
                haptics.success();
              }
            } else {
              haptics.light();
            }

            return { ...s, completed: willBeCompleted };
          })
        };
      });
      return { ...prev, exercises };
    });
  };

  // Update set values
  const handleUpdateSet = (exId, setId, field, value) => {
    setActiveWorkout(prev => {
      const exercises = prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      });
      return { ...prev, exercises };
    });
  };

  // Add exercise from search
  const handleAddExercise = (exerciseName) => {
    const lastPerf = getLastSessionPerformance(exerciseName, pastWorkouts);
    const defaultW = lastPerf?.sets?.[0]?.weight || 20;
    const defaultR = lastPerf?.sets?.[0]?.reps || 10;

    const newEx = {
      id: 'ex_' + Date.now().toString(36),
      name: exerciseName,
      sets: [
        { id: 's_1_' + Date.now().toString(36), setNumber: 1, weight: defaultW, reps: defaultR, completed: false }
      ]
    };

    setActiveWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newEx]
    }));
    setShowExSearch(false);
    haptics.success();
  };

  // Remove exercise from workout
  const handleRemoveExercise = (exId) => {
    if (window.confirm('Remove this exercise from session?')) {
      setActiveWorkout(prev => ({
        ...prev,
        exercises: prev.exercises.filter(e => e.id !== exId)
      }));
      haptics.light();
    }
  };

  // Prepare workout completion
  const handleInitiateFinish = () => {
    haptics.success();
    setShowSummaryModal(true);
  };

  // Complete workout calculation
  const totalVolume = activeWorkout.exercises.reduce((vol, ex) => {
    return vol + ex.sets.filter(s => s.completed).reduce((sVol, s) => sVol + (s.weight * s.reps), 0);
  }, 0);

  const completedSetsCount = activeWorkout.exercises.reduce((count, ex) => {
    return count + ex.sets.filter(s => s.completed).length;
  }, 0);

  const totalSetsCount = activeWorkout.exercises.reduce((count, ex) => {
    return count + ex.sets.length;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] pb-32 animate-fade-in select-none">
      {/* Sticky Workout Top Bar */}
      <header 
        className="sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-xl flex items-center justify-between shadow-lg"
        style={{
          backgroundColor: 'rgba(7, 9, 14, 0.94)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="flex-1 min-w-0 pr-3">
          <input 
            type="text" 
            value={activeWorkout.name} 
            onChange={(e) => setActiveWorkout(prev => ({ ...prev, name: e.target.value }))}
            className="text-lg font-black text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 truncate w-full"
            placeholder="Workout Name"
          />
          <div className="flex items-center gap-2 text-xs font-mono font-bold mt-0.5">
            <span className="text-blue-400 flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" /> {timerStr}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              {completedSetsCount}/{totalSetsCount} Sets Done
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelWorkout}
            className="text-slate-400 hover:text-red-400 px-2.5"
          >
            Discard
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleInitiateFinish}
            className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider"
            icon={Check}
          >
            Finish
          </Button>
        </div>
      </header>

      {/* Main Exercise Cards Feed */}
      <main className="px-3.5 pt-4 space-y-4 max-w-xl mx-auto w-full">
        {activeWorkout.exercises.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 my-8">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No exercises in this session</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Tap below to add exercises from the library or create custom ones.</p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowExSearch(true)}
              icon={Plus}
            >
              Add Exercise
            </Button>
          </Card>
        ) : (
          activeWorkout.exercises.map((ex, exIdx) => {
            const lastSession = getLastSessionPerformance(ex.name, pastWorkouts);

            return (
              <Card 
                key={ex.id || exIdx}
                className="overflow-hidden border-slate-800 shadow-md"
              >
                {/* Exercise Title Header */}
                <div 
                  className="px-4 py-3 border-b flex justify-between items-center"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {ex.name}
                      </h3>
                      {ex.physioCheck && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] font-bold">
                          ⚠️ Physio Check
                        </span>
                      )}
                    </div>
                    {ex.backNote && (
                      <p className={`text-[10px] font-mono mt-0.5 ${ex.physioCheck ? 'text-amber-300/90 font-medium' : 'text-slate-400'}`}>
                        {ex.backNote} {ex.swap && <span className="text-amber-400 font-bold block sm:inline">⚡ Swap: {ex.swap}</span>}
                      </p>
                    )}
                    {lastSession && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Last ({lastSession.date}):{' '}
                        <span className="text-blue-300 font-bold">
                          {lastSession.sets.map(s => `${s.weight}kg×${s.reps}`).join(', ')}
                        </span>
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sets Table */}
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-mono uppercase font-bold text-slate-500 px-2">
                    <div className="col-span-2 text-center">Set</div>
                    <div className="col-span-4 text-center">Weight (kg)</div>
                    <div className="col-span-3 text-center">Reps</div>
                    <div className="col-span-3 text-center">Check</div>
                  </div>

                  {ex.sets.map((s, sIdx) => {
                    const isCompleted = s.completed;
                    const pr = checkPersonalRecords(ex.name, s.weight, s.reps, pastWorkouts);
                    const isPR = isCompleted && (pr.isWeightPR || pr.isRepPR || pr.is1RMPR);

                    return (
                      <div 
                        key={s.id || sIdx}
                        className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-xl transition-all border ${
                          isCompleted 
                            ? 'bg-blue-600/10 border-blue-500/30' 
                            : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Set index */}
                        <div className="col-span-2 text-center font-mono font-bold text-xs text-slate-400">
                          {s.setNumber || sIdx + 1}
                        </div>

                        {/* WEIGHT RECORDING BUTTON (User's preferred WheelPickerModal process!) */}
                        <div className="col-span-4">
                          <button
                            type="button"
                            onClick={() => {
                              haptics.light();
                              setPickerConfig({
                                isOpen: true,
                                type: 'weight',
                                exId: ex.id,
                                setId: s.id,
                                initial: s.weight || 0,
                                min: 0,
                                max: 250,
                                step: 2.5,
                                title: `${ex.name} - Weight`,
                                unit: 'kg'
                              });
                            }}
                            className={`w-full py-2.5 px-1 rounded-xl text-center font-mono font-black text-sm tracking-tight transition-all border ${
                              isCompleted 
                                ? 'bg-blue-600/20 text-blue-200 border-blue-500/30' 
                                : 'bg-slate-800 text-white border-slate-700 hover:border-blue-500/50 active:scale-95'
                            }`}
                          >
                            {s.weight} <span className="text-[10px] font-normal text-slate-400">kg</span>
                          </button>
                        </div>

                        {/* REPS RECORDING BUTTON */}
                        <div className="col-span-3">
                          <button
                            type="button"
                            onClick={() => {
                              haptics.light();
                              setPickerConfig({
                                isOpen: true,
                                type: 'reps',
                                exId: ex.id,
                                setId: s.id,
                                initial: s.reps || 10,
                                min: 1,
                                max: 60,
                                step: 1,
                                title: `${ex.name} - Reps`,
                                unit: 'reps'
                              });
                            }}
                            className={`w-full py-2.5 px-1 rounded-xl text-center font-mono font-black text-sm tracking-tight transition-all border ${
                              isCompleted 
                                ? 'bg-blue-600/20 text-blue-200 border-blue-500/30' 
                                : 'bg-slate-800 text-white border-slate-700 hover:border-blue-500/50 active:scale-95'
                            }`}
                          >
                            {s.reps}
                          </button>
                        </div>

                        {/* COMPLETE TOGGLE & PR BADGE */}
                        <div className="col-span-3 flex items-center justify-center gap-1.5">
                          {ex.sets.length > 1 && !isCompleted && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(ex.id, s.id)}
                              className="p-1 text-slate-600 hover:text-red-400 tap-target flex items-center justify-center"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleComplete(ex.id, s.id, ex.restSeconds)}
                            className={`w-11 h-10 rounded-xl flex items-center justify-center transition-all tap-target ${
                              isCompleted 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            <Check className={`w-5 h-5 ${isCompleted ? 'stroke-[3]' : 'stroke-[2]'}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add set button */}
                  <button
                    type="button"
                    onClick={() => handleAddSet(ex.id)}
                    className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-400 hover:text-blue-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all tap-target"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Set
                  </button>
                </div>
              </Card>
            );
          })
        )}

        {/* Add exercise floating/bottom button */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowExSearch(true)}
          className="w-full py-4 text-xs font-black uppercase tracking-wider border-dashed"
          icon={Plus}
        >
          Add Another Exercise
        </Button>
      </main>

      {/* DOCKED REST TIMER */}
      {activeRestTimer && (
        <RestTimerBar 
          initialSeconds={activeRestTimer.seconds}
          onDismiss={() => setActiveRestTimer(null)}
          onFinish={() => setActiveRestTimer(null)}
        />
      )}

      {/* WHEEL PICKER MODAL (Preserving user's preferred weight recording!) */}
      {pickerConfig?.isOpen && (
        <WheelPickerModal
          isOpen={true}
          onClose={() => setPickerConfig(null)}
          onSave={(val) => handleUpdateSet(pickerConfig.exId, pickerConfig.setId, pickerConfig.type, val)}
          initialValue={pickerConfig.initial}
          min={pickerConfig.min}
          max={pickerConfig.max}
          step={pickerConfig.step}
          title={pickerConfig.title}
          unit={pickerConfig.unit}
        />
      )}

      {/* EXERCISE SEARCH MODAL */}
      <ExerciseSearchModal
        isOpen={showExSearch}
        onClose={() => setShowExSearch(false)}
        onSelect={handleAddExercise}
      />

      {/* WORKOUT COMPLETION SUMMARY MODAL */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-sm rounded-[28px] border shadow-2xl p-6 flex flex-col items-center text-center animate-scale-in"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-4">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">Session Finished!</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">{activeWorkout.name}</p>

            {/* Volume Stats */}
            <div className="grid grid-cols-2 gap-3 w-full my-5">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Duration</span>
                <div className="text-xl font-black font-mono text-white mt-0.5">{timerStr}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Total Volume</span>
                <div className="text-xl font-black font-mono text-blue-400 mt-0.5">{totalVolume} kg</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 font-mono">
              {completedSetsCount} / {totalSetsCount} Sets Completed Across {activeWorkout.exercises.length} Exercises.
            </p>

            <div className="w-full space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-xs font-black uppercase tracking-wider"
                onClick={() => {
                  localStorage.removeItem('gymtracker_in_progress_workout');
                  onFinishWorkout({
                    ...activeWorkout,
                    duration: Math.max(1, Math.round((new Date() - new Date(activeWorkout.startTime)) / 60000)),
                    endTime: new Date().toISOString(),
                    volume: totalVolume
                  });
                }}
              >
                Save To History
              </Button>

              <Button
                variant="ghost"
                size="md"
                className="w-full text-xs"
                onClick={() => setShowSummaryModal(false)}
              >
                Keep Editing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
