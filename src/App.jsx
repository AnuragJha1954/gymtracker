import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import PlansScreen from './screens/PlansScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import InstallPrompt from './components/InstallPrompt';
import { dataService } from './services/dataService';
import { getLastSessionPerformance } from './utils/oneRepMax';
import { haptics } from './utils/haptics';
import { Home, Layers, TrendingUp, User, Plus } from 'lucide-react';

export default function App() {
  const { user, settings, updateSettings, updateUserPlan, logout } = useAuth();
  
  // Navigation tabs: 'home' | 'plans' | 'progress' | 'profile'
  const [tab, setTab] = useState('home');
  const [workouts, setWorkouts] = useState([]);
  
  // In-progress workout state
  const [activeWorkout, setActiveWorkout] = useState(() => {
    try {
      const saved = localStorage.getItem('gymtracker_in_progress_workout');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isWorkoutViewOpen, setIsWorkoutViewOpen] = useState(false);

  // Fetch all workouts
  const refreshWorkouts = async () => {
    try {
      const list = await dataService.getWorkouts();
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setWorkouts(list || []);
    } catch (err) {
      console.error('Failed to load workouts:', err);
    }
  };

  useEffect(() => {
    refreshWorkouts();
    const handleUpdate = () => refreshWorkouts();
    window.addEventListener('unitrack-data-updated', handleUpdate);
    return () => window.removeEventListener('unitrack-data-updated', handleUpdate);
  }, []);

  // Launch a new workout (from Plan Day, Repeat Past, or Empty)
  const handleStartWorkout = (planDayOrPastWorkout = null) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const dateFormatted = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    let workoutName = `Session · ${dateFormatted}`;
    let initialExercises = [];

    if (planDayOrPastWorkout) {
      // Starting from a plan day
      if (planDayOrPastWorkout.dayOfWeek) {
        workoutName = `${planDayOrPastWorkout.name} · ${dateFormatted}`;
        initialExercises = (planDayOrPastWorkout.exercises || []).map((ex, i) => {
          // Look up last session weight for this exercise
          const lastSession = getLastSessionPerformance(ex.name, workouts);
          const setsCount = ex.targetSets || 3;

          const sets = [];
          for (let sIdx = 0; sIdx < setsCount; sIdx++) {
            const previousSet = lastSession?.sets?.[sIdx] || lastSession?.sets?.[0];
            const weightVal = previousSet ? previousSet.weight : (ex.defaultWeight || 20);
            const repsVal = previousSet ? previousSet.reps : (ex.minReps || 10);

            sets.push({
              id: `s_${Date.now()}_${i}_${sIdx}`,
              setNumber: sIdx + 1,
              weight: weightVal,
              reps: repsVal,
              completed: false,
              type: 'working'
            });
          }

          return {
            id: `ex_${Date.now()}_${i}`,
            name: ex.name,
            restSeconds: ex.restSeconds || settings.defaultRestSeconds || 90,
            backNote: ex.backNote || null,
            physioCheck: ex.physioCheck || false,
            swap: ex.swap || null,
            sets
          };
        });
      } 
      // Repeating a past workout
      else if (planDayOrPastWorkout.exercises) {
        workoutName = `${planDayOrPastWorkout.name || 'Workout'} · ${dateFormatted}`;
        initialExercises = (planDayOrPastWorkout.exercises || []).map((ex, i) => ({
          id: `ex_${Date.now()}_${i}`,
          name: ex.name,
          sets: (ex.sets || []).map((s, sIdx) => ({
            id: `s_${Date.now()}_${i}_${sIdx}`,
            setNumber: sIdx + 1,
            weight: s.weight || 20,
            reps: s.reps || 10,
            completed: false,
            type: 'working'
          }))
        }));
      }
    }

    const newWorkout = {
      id: 'wo_' + Date.now().toString(),
      name: workoutName,
      date: todayStr,
      startTime: now.toISOString(),
      exercises: initialExercises
    };

    setActiveWorkout(newWorkout);
    setIsWorkoutViewOpen(true);
    haptics.success();
  };

  // Resume current workout
  const handleResumeWorkout = () => {
    setIsWorkoutViewOpen(true);
    haptics.light();
  };

  // Complete workout and save to dataService
  const handleFinishWorkout = async (completedWorkout) => {
    try {
      await dataService.saveWorkout({
        ...completedWorkout,
        userId: user.id
      });
      setActiveWorkout(null);
      setIsWorkoutViewOpen(false);
      localStorage.removeItem('gymtracker_in_progress_workout');
      haptics.celebratePR();
      await refreshWorkouts();
    } catch (e) {
      console.error('Failed to save workout:', e);
    }
  };

  // Cancel / discard workout
  const handleCancelWorkout = () => {
    if (window.confirm('Discard current workout in progress? All unsaved sets will be lost.')) {
      setActiveWorkout(null);
      setIsWorkoutViewOpen(false);
      localStorage.removeItem('gymtracker_in_progress_workout');
      haptics.light();
    }
  };

  // Delete history item
  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Delete this workout from history?')) {
      await dataService.deleteWorkout(id);
      await refreshWorkouts();
      haptics.light();
    }
  };

  if (!user) {
    return (
      <>
        <InstallPrompt />
        <AuthScreen />
      </>
    );
  }

  // Active workout full-screen view
  if (isWorkoutViewOpen && activeWorkout) {
    return (
      <ActiveWorkoutScreen
        activeWorkout={activeWorkout}
        setActiveWorkout={setActiveWorkout}
        pastWorkouts={workouts}
        onFinishWorkout={handleFinishWorkout}
        onCancelWorkout={handleCancelWorkout}
        defaultRestSeconds={settings.defaultRestSeconds || 90}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text)]">
      <InstallPrompt />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-md mx-auto px-4 pt-3">
        {tab === 'home' && (
          <HomeScreen
            user={user}
            workouts={workouts}
            activeWorkout={activeWorkout}
            onStartWorkout={handleStartWorkout}
            onResumeWorkout={handleResumeWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onNavigateToTab={setTab}
          />
        )}

        {tab === 'plans' && (
          <PlansScreen
            user={user}
            onStartPlanDay={handleStartWorkout}
            onSwitchPlan={updateUserPlan}
          />
        )}

        {tab === 'progress' && (
          <ProgressScreen
            workouts={workouts}
          />
        )}

        {tab === 'profile' && (
          <ProfileScreen
            user={user}
            settings={settings}
            updateSettings={updateSettings}
            onLogout={logout}
            workouts={workouts}
          />
        )}
      </div>

      {/* 4-Tab Bottom Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(7, 9, 14, 0.94)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="max-w-md mx-auto flex items-center justify-around px-2 pt-2 pb-5">
          {/* HOME */}
          <button
            type="button"
            onClick={() => { setTab('home'); haptics.light(); }}
            className={`flex-1 flex flex-col items-center gap-1 tap-target transition-colors cursor-pointer ${
              tab === 'home' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* PLANS */}
          <button
            type="button"
            onClick={() => { setTab('plans'); haptics.light(); }}
            className={`flex-1 flex flex-col items-center gap-1 tap-target transition-colors cursor-pointer ${
              tab === 'plans' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-bold">Plans</span>
          </button>

          {/* FLOATING QUICK START BUTTON */}
          <div className="px-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                if (activeWorkout) {
                  handleResumeWorkout();
                } else {
                  handleStartWorkout(null);
                }
              }}
              title="Quick Start Session"
              className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* PROGRESS */}
          <button
            type="button"
            onClick={() => { setTab('progress'); haptics.light(); }}
            className={`flex-1 flex flex-col items-center gap-1 tap-target transition-colors cursor-pointer ${
              tab === 'progress' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-bold">Progress</span>
          </button>

          {/* PROFILE */}
          <button
            type="button"
            onClick={() => { setTab('profile'); haptics.light(); }}
            className={`flex-1 flex flex-col items-center gap-1 tap-target transition-colors cursor-pointer ${
              tab === 'profile' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
