import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Award, Scale, Ruler, Calendar, 
  Dumbbell, ChevronRight, Plus, Check 
} from 'lucide-react';
import { Card, Button, StatTile } from '../components/common/UIElements';
import { calculate1RM } from '../utils/oneRepMax';
import { haptics } from '../utils/haptics';

export default function ProgressScreen({ workouts = [] }) {
  const [selectedExercise, setSelectedExercise] = useState('Incline Dumbbell Press');
  const [bodyMetrics, setBodyMetrics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gymtracker_body_metrics') || '[]');
    } catch {
      return [];
    }
  });

  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  // Extract all distinct exercises performed across past workouts
  const exerciseNames = useMemo(() => {
    const set = new Set();
    workouts.forEach(w => {
      (w.exercises || []).forEach(e => {
        if (e.name) set.add(e.name);
      });
      if (w.exercise_name) set.add(w.exercise_name);
    });
    // Add common fallback if none
    if (set.size === 0) {
      set.add('Incline Dumbbell Press');
      set.add('Barbell Bench Press');
      set.add('Barbell Back Squat');
      set.add('Romanian Deadlift');
    }
    return Array.from(set);
  }, [workouts]);

  // Extract time-series data for selected exercise
  const exerciseHistory = useMemo(() => {
    const points = [];
    const target = selectedExercise.toLowerCase().trim();

    // Workouts oldest to newest for chronological chart
    const chronological = [...workouts].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    chronological.forEach(wo => {
      const ex = (wo.exercises || []).find(e => e.name?.toLowerCase().trim() === target);
      if (ex && ex.sets && ex.sets.length > 0) {
        let maxWeight = 0;
        let max1RM = 0;
        let maxReps = 0;

        ex.sets.forEach(s => {
          if (s.completed || s.weight > 0) {
            const w = parseFloat(s.weight) || 0;
            const r = parseInt(s.reps, 10) || 0;
            if (w > maxWeight) maxWeight = w;
            if (r > maxReps) maxReps = r;
            const e1rm = calculate1RM(w, r);
            if (e1rm > max1RM) max1RM = e1rm;
          }
        });

        if (maxWeight > 0) {
          points.push({
            date: wo.date || 'Session',
            weight: maxWeight,
            estimated1RM: max1RM,
            reps: maxReps
          });
        }
      }
    });

    return points;
  }, [workouts, selectedExercise]);

  // Handle log body metric
  const handleSaveBodyMetric = (e) => {
    e.preventDefault();
    if (!newWeight && !newWaist) return;

    const entry = {
      id: 'bm_' + Date.now().toString(36),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight) || null,
      waist: parseFloat(newWaist) || null
    };

    const updated = [entry, ...bodyMetrics];
    setBodyMetrics(updated);
    localStorage.setItem('gymtracker_body_metrics', JSON.stringify(updated));
    setNewWeight('');
    setNewWaist('');
    setShowLogModal(false);
    haptics.success();
  };

  // Pure SVG Line Chart Renderer
  const renderLineChart = (data, valueKey, strokeColor = '#3B82F6', unit = 'kg') => {
    if (data.length === 0) {
      return (
        <div className="h-44 flex items-center justify-center text-slate-500 text-xs font-mono">
          No logs recorded yet for {selectedExercise}
        </div>
      );
    }

    if (data.length === 1) {
      return (
        <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs">
          <div className="text-2xl font-black font-mono text-white mb-1">
            {data[0][valueKey]} {unit}
          </div>
          <span className="font-mono text-[10px] text-slate-500">1 session logged ({data[0].date})</span>
        </div>
      );
    }

    const values = data.map(d => d[valueKey]);
    const minVal = Math.min(...values) * 0.92;
    const maxVal = Math.max(...values) * 1.08;
    const range = maxVal - minVal || 1;

    const width = 320;
    const height = 140;
    const paddingX = 15;
    const paddingY = 15;

    const points = data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((d[valueKey] - minVal) / range) * (height - paddingY * 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Subtle Grid Lines */}
          <line x1={0} y1={height - paddingY} x2={width} y2={height - paddingY} stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
          <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
          <line x1={0} y1={paddingY} x2={width} y2={paddingY} stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />

          {/* Polyline Chart */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data nodes */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
            const y = height - paddingY - ((d[valueKey] - minVal) / range) * (height - paddingY * 2);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4.5"
                fill="#07090E"
                stroke={strokeColor}
                strokeWidth="2.5"
              />
            );
          })}
        </svg>

        {/* Start / End Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 px-1">
          <span>{data[0].date} ({data[0][valueKey]}{unit})</span>
          <span>{data[data.length - 1].date} ({data[data.length - 1][valueKey]}{unit})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-28 pt-2 animate-fade-in select-none">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
          Analytics & PRs
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
          Performance <span className="text-blue-500">Progress</span>
        </h1>
      </div>

      {/* Exercise Performance Chart Card */}
      <Card className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider">
              Strength Over Time
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">Top Set & Estimated 1RM</h2>
          </div>
          <Award className="w-5 h-5 text-amber-400" />
        </div>

        {/* Exercise Dropdown / Selector */}
        <div>
          <select
            value={selectedExercise}
            onChange={(e) => {
              setSelectedExercise(e.target.value);
              haptics.light();
            }}
            className="w-full rounded-xl px-3.5 py-2.5 text-xs font-bold text-white border bg-slate-900 border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Chart View */}
        <div className="pt-2">
          {renderLineChart(exerciseHistory, 'weight', '#3B82F6', 'kg')}
        </div>
      </Card>

      {/* Body Recomposition Metrics (Weight & Navel Waist Tracker!) */}
      <Card className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
              Recomp Tracking
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">Body Weight & Navel Waist</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogModal(true)}
            icon={Plus}
          >
            Log Entry
          </Button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          As outlined in your plan: measure navel waist every 2 weeks to verify fat loss while keeping muscle.
        </p>

        {bodyMetrics.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl">
            No body metrics logged yet. Tap "Log Entry" to track bodyweight and waist!
          </div>
        ) : (
          <div className="space-y-2">
            {bodyMetrics.slice(0, 5).map(bm => (
              <div 
                key={bm.id} 
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300 font-bold">{bm.date}</span>
                </div>
                <div className="flex gap-4 font-mono font-bold">
                  {bm.weight && <span className="text-blue-400">{bm.weight} kg</span>}
                  {bm.waist && <span className="text-emerald-400">{bm.waist} cm</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Log Body Metrics Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-sm rounded-[24px] border p-6 shadow-2xl animate-scale-in"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <h3 className="text-lg font-black text-white mb-1">Log Recomp Metric</h3>
            <p className="text-xs text-slate-400 mb-4">Record your morning weekly average weight and navel waist.</p>

            <form onSubmit={handleSaveBodyMetric} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 font-mono mb-1">Body Weight (kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 96.5"
                  className="w-full rounded-xl px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 font-mono mb-1">Navel Waist (cm or inches)</label>
                <input 
                  type="number"
                  step="0.5"
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  placeholder="e.g. 94"
                  className="w-full rounded-xl px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowLogModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  Save Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
