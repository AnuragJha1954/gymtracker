import React, { useState, useMemo } from 'react';
import { 
  Play, Calendar, Clock, Flame, ChevronRight, ChevronDown, 
  Trash2, RotateCcw, Dumbbell, Award, Plus, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { Card, Button, StatTile } from '../components/common/UIElements';
import { getPlanById, getTodayPlanDay } from '../data/seedPlans';
import { haptics } from '../utils/haptics';

export default function HomeScreen({
  user,
  workouts = [],
  activeWorkout,
  onStartWorkout,
  onResumeWorkout,
  onDeleteWorkout,
  onNavigateToTab
}) {
  const [expandedId, setExpandedId] = useState(null);

  const activePlan = useMemo(() => {
    return getPlanById(user?.plan || 'plan1');
  }, [user?.plan]);

  const todayPlanDay = useMemo(() => {
    return getTodayPlanDay(activePlan);
  }, [activePlan]);

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

  // Compute stats: Weekly consistency (Mon to Sun)
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sun, 1 is Mon...
    // Start of week: Monday
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const activeDatesThisWeek = new Set();

    workouts.forEach(w => {
      const wDate = new Date(w.date || w.startTime);
      if (wDate >= monday) {
        activeDatesThisWeek.add(wDate.toISOString().split('T')[0]);
      }
    });

    const targetDays = 6;
    const completedDays = activeDatesThisWeek.size;

    // Last Lift calculation
    let lastLiftStr = '—';
    if (workouts.length > 0) {
      const sorted = [...workouts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      const lastDate = new Date(sorted[0].date);
      const diffDays = Math.round((new Date().setHours(0,0,0,0) - lastDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) lastLiftStr = 'Today';
      else if (diffDays === 1) lastLiftStr = 'Yest.';
      else lastLiftStr = `${diffDays}d ago`;
    }

    return {
      completedDays,
      targetDays,
      lastLiftStr,
      totalSessions: workouts.length,
      weekDaysList: [0, 1, 2, 3, 4, 5, 6].map((offset, idx) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + offset);
        const iso = d.toISOString().split('T')[0];
        const isToday = iso === new Date().toISOString().split('T')[0];
        const hasWorkout = workouts.some(w => (w.date || '').startsWith(iso));
        return {
          label: weekDays[idx],
          isToday,
          hasWorkout,
          dateStr: iso
        };
      })
    };
  }, [workouts]);

  return (
    <div className="space-y-6 pb-28 pt-2 animate-fade-in select-none">
      {/* Top Greeting & User Avatar */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
            {todayFormatted}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
            {greeting}, <span className="text-blue-500">{user?.name || 'Athlete'}</span>
          </h1>
        </div>
        
        <button
          type="button"
          onClick={() => onNavigateToTab('profile')}
          className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400 text-sm shadow-md active:scale-95 transition-transform"
        >
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </button>
      </div>

      {/* Active Workout Resume Banner (if workout is in progress) */}
      {activeWorkout && (
        <div 
          onClick={onResumeWorkout}
          className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 flex items-center justify-between cursor-pointer border border-blue-400/50 animate-pulse active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Session in progress</span>
              <h3 className="font-extrabold text-base leading-tight">{activeWorkout.name}</h3>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-wider bg-white text-blue-600 px-3 py-1.5 rounded-lg">
            Resume →
          </span>
        </div>
      )}

      {/* Weekly Consistency & Calendar Strip */}
      <Card className="p-4.5 space-y-3.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-400" /> Weekly Consistency
          </span>
          <span className="font-mono font-bold text-blue-400">
            {weeklyStats.completedDays} / {weeklyStats.targetDays} Days
          </span>
        </div>

        {/* 7-Day Bubble Strip */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {weeklyStats.weekDaysList.map((day, i) => (
            <div 
              key={i}
              className={`flex flex-col items-center py-2 rounded-xl text-center border transition-all ${
                day.hasWorkout 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20' 
                  : day.isToday 
                  ? 'bg-slate-800 text-blue-400 border-blue-500/50' 
                  : 'bg-slate-900/60 text-slate-500 border-slate-800/80'
              }`}
            >
              <span className="text-[10px] font-bold">{day.label}</span>
              <div className="mt-1">
                {day.hasWorkout ? (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${day.isToday ? 'bg-blue-400 animate-ping' : 'bg-slate-700'}`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Metric Tiles Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile 
          label="Last Lift" 
          value={weeklyStats.lastLiftStr} 
          icon={Clock} 
        />
        <StatTile 
          label="Total Logs" 
          value={weeklyStats.totalSessions} 
          icon={Dumbbell} 
        />
        <StatTile 
          label="Goal" 
          value={user?.goal ? (user.goal.toLowerCase().includes('hypertrophy') || user.goal.toLowerCase().includes('bulk') ? 'BULK' : user.goal.toUpperCase()) : 'RECOMP'} 
          icon={Flame} 
        />
      </div>

      {/* "TODAY'S WORKOUT" HERO CARD (Pre-loaded from user's plan!) */}
      {todayPlanDay && (
        <Card className="p-5 relative overflow-hidden border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 font-mono">
                Scheduled for Today • {todayPlanDay.dayOfWeek}
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5 tracking-tight">
                {todayPlanDay.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {todayPlanDay.focus}
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Dumbbell className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          <div className="py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {todayPlanDay.exercises.length} Exercises (~50-60 min)
            </span>
            <span className="text-[11px] text-blue-400 font-semibold">
              Auto-prefilled
            </span>
          </div>

          <div className="flex gap-2.5">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 text-sm uppercase tracking-wider"
              onClick={() => onStartWorkout(todayPlanDay)}
              icon={Play}
            >
              Start Workout
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="px-3"
              onClick={() => onNavigateToTab('plans')}
            >
              Change
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Start Empty Workout Action */}
      <div className="flex justify-between items-center pt-1">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-mono">
          Recent Sessions
        </h3>
        <button
          type="button"
          onClick={() => onStartWorkout(null)}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 tap-target"
        >
          <Plus className="w-3.5 h-3.5" /> Empty Workout
        </button>
      </div>

      {/* Recent Workouts Accordion List */}
      {workouts.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 text-xs border-dashed">
          <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          No workout history found yet. Tap "Start Workout" above to begin your first session!
        </Card>
      ) : (
        <div className="space-y-3">
          {workouts.slice(0, 10).map((wo) => {
            const isExpanded = expandedId === wo.id;
            const exercisesCount = wo.exercises?.length || (wo.exercise_name ? 1 : 0);
            const totalSets = wo.exercises 
              ? wo.exercises.reduce((sum, e) => sum + (e.sets?.length || 0), 0)
              : (wo.sets?.length || 0);

            return (
              <Card 
                key={wo.id}
                className="overflow-hidden transition-all duration-200"
              >
                {/* Header row */}
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : wo.id);
                    haptics.light();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 font-black text-xs shrink-0">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                        {wo.name || 'Workout Session'}
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                        <span>{wo.date}</span>
                        {wo.duration && <span>• {wo.duration}m</span>}
                        <span>• {exercisesCount} exercises ({totalSets} sets)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Repeat workout"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptics.light();
                        onStartWorkout(wo);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors tap-target flex items-center justify-center"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete workout"
                      onClick={(e) => {
                        e.stopPropagation();
                        haptics.light();
                        onDeleteWorkout(wo.id);
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors tap-target flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Exercise Details */}
                {isExpanded && (
                  <div 
                    className="px-4 pb-4 pt-2 border-t space-y-3"
                    style={{
                      backgroundColor: 'var(--color-surface-2)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    {wo.exercises?.map((ex, exIdx) => (
                      <div key={ex.id || exIdx} className="text-xs">
                        <div className="font-bold text-slate-200 mb-1 flex justify-between">
                          <span>{ex.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">
                            {ex.sets?.length || 0} sets
                          </span>
                        </div>
                        <div className="space-y-1 pl-2 border-l-2 border-blue-500/30">
                          {ex.sets?.map((s, sIdx) => (
                            <div key={s.id || sIdx} className="flex gap-4 text-slate-400 font-mono text-[11px]">
                              <span className="w-8">Set {s.setNumber || sIdx + 1}</span>
                              <span className="text-white font-bold">{s.weight} kg</span>
                              <span>× {s.reps} reps</span>
                              {s.completed && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 ml-auto" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
