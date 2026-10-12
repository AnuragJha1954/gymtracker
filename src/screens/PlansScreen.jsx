import React, { useState } from 'react';
import { 
  Dumbbell, Flame, Beef, HeartPulse, ChevronDown, 
  Play, Calendar, Check, Compass, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { SEED_PLANS, getPlansForUser } from '../data/seedPlans';
import { Card, Button } from '../components/common/UIElements';
import { haptics } from '../utils/haptics';

export default function PlansScreen({
  user,
  onStartPlanDay,
  onSwitchPlan
}) {
  const userPlans = getPlansForUser(user);
  const currentPlanId = user?.plan || (userPlans[0]?.id || 'plan1');
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId);
  const [expandedDayId, setExpandedDayId] = useState(() => {
    const plan = SEED_PLANS.find(p => p.id === currentPlanId) || SEED_PLANS[0];
    return plan.days[0]?.id || null;
  });

  const activePlan = SEED_PLANS.find(p => p.id === selectedPlanId) || userPlans[0] || SEED_PLANS[0];
  const isUserActivePlan = activePlan.id === (user?.plan || 'plan1');

  return (
    <div className="space-y-6 pb-28 pt-2 animate-fade-in select-none">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
          Training Systems • {user?.name || 'Athlete'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
          Assigned <span className="text-blue-500">Plan</span>
        </h1>
      </div>

      {/* Plan Selector Pills (If multiple plans match user) */}
      {userPlans.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {userPlans.map(plan => {
            const isSelected = plan.id === selectedPlanId;
            const isCurrent = plan.id === (user?.plan || 'plan1');

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setExpandedDayId(plan.days[0]?.id || null);
                  haptics.light();
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-2 tap-target ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{plan.name}</span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 bg-blue-400/30 text-blue-200 text-[10px] rounded-md font-mono">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Plan Detail Hero Card */}
      <Card className="p-5 border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-transparent space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider">
                {activePlan.level}
              </span>
              {activePlan.userTarget && (
                <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded text-[10px] font-mono font-bold uppercase">
                  For {activePlan.userTarget}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
              {activePlan.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {activePlan.subtitle}
            </p>
          </div>

          {!isUserActivePlan && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSwitchPlan(activePlan.id);
                haptics.success();
              }}
              className="text-xs whitespace-nowrap"
            >
              Set as Active
            </Button>
          )}
        </div>

        {/* Nutritional & Cardio Guidelines Strip */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-blue-400" /> Target Calories
            </span>
            <div className="font-bold text-slate-200 mt-1">{activePlan.targetCalories}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono flex items-center gap-1.5">
              <Beef className="w-3.5 h-3.5 text-emerald-400" /> Target Protein
            </span>
            <div className="font-bold text-slate-200 mt-1">{activePlan.targetProtein}</div>
          </div>
        </div>

        {/* Cardio Note */}
        {activePlan.cardioNote && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{activePlan.cardioNote}</span>
          </div>
        )}

        {/* Special Safety & Physio Guidance for Aman (L4-L5) */}
        {activePlan.safetyNotes && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0" /> L4–L5 Lumbar & Spinal Safety Rules
            </div>
            <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-300">
              {activePlan.safetyNotes.map((note, nIdx) => (
                <li key={nIdx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Daily Routines List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
          Weekly Split & Movements
        </h3>

        {activePlan.days.map((day) => {
          const isExpanded = expandedDayId === day.id;

          return (
            <Card
              key={day.id}
              className="overflow-hidden border-slate-800/90"
            >
              {/* Day Header Bar */}
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => {
                  setExpandedDayId(isExpanded ? null : day.id);
                  haptics.light();
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 font-mono uppercase">
                      {day.dayOfWeek}
                    </span>
                    <span className="text-slate-600">•</span>
                    <h4 className="font-extrabold text-sm text-white">{day.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{day.focus}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
                    {day.exercises.length} exercises
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Day Exercises List */}
              {isExpanded && (
                <div 
                  className="px-4 pb-4 pt-3 border-t space-y-3"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  {day.exercises.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500 font-mono">
                      Rest & active recovery. No lifting scheduled.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {day.exercises.map((ex, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl border flex flex-col gap-1 text-xs ${
                            ex.physioCheck 
                              ? 'bg-amber-950/20 border-amber-500/30' 
                              : 'bg-slate-900 border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-200">{ex.name}</span>
                              {ex.physioCheck && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Physio Check
                                </span>
                              )}
                            </div>

                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono font-bold text-xs whitespace-nowrap ml-2">
                              {ex.targetSets} × {ex.minReps}{ex.minReps !== ex.maxReps ? `–${ex.maxReps}` : ''}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>Rest: {ex.restSeconds}s</span>
                            <span>•</span>
                            <span>RIR: {ex.rir}</span>
                            {ex.backNote && (
                              <>
                                <span>•</span>
                                <span className={ex.physioCheck ? 'text-amber-300 font-medium' : 'text-slate-400'}>
                                  {ex.backNote}
                                </span>
                              </>
                            )}
                          </div>

                          {ex.swap && (
                            <div className="mt-1 text-[11px] text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                              ⚡ Swap option: <strong>{ex.swap}</strong>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 1-TAP START FROM PLAN BUTTON */}
                  {day.exercises.length > 0 && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onStartPlanDay(day)}
                      className="w-full text-xs font-black uppercase tracking-wider mt-3"
                      icon={Play}
                    >
                      Start {day.name} Session
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
