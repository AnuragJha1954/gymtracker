// Pre-configured workout plans structured for one-tap workout logging
export const SEED_PLANS = [
  {
    id: 'plan1',
    userTarget: 'anurag',
    name: '12-Week Body Recomposition',
    subtitle: 'Push / Pull / Legs • 6 Days • 97kg → 85kg Target',
    level: 'Intermediate (1–3 yrs)',
    targetCalories: '2,800 kcal baseline (adjust based on weekly average)',
    targetProtein: '180–200 g/day (4 meals, ~2g/kg target BW)',
    cardioNote: 'Daily 25m Incline Walk before sessions (10-12% @ 4.5-5.5 km/h)',
    summary: 'Optimized double progression protocol hitting each muscle 2x/week with progressive overload & week 6 deload.',
    days: [
      {
        id: 'p1_d1',
        dayOfWeek: 'Monday',
        name: 'Push A',
        focus: 'Chest, Front/Side Delts, Triceps',
        cardio: '25 min Incline Walk First',
        exercises: [
          { name: 'Incline Dumbbell Press', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 26 },
          { name: 'Barbell Bench Press', targetSets: 3, minReps: 6, maxReps: 8, restSeconds: 150, rir: 2, defaultWeight: 75 },
          { name: 'Low-to-High Cable Fly', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 90, rir: 1, defaultWeight: 15 },
          { name: 'Seated Dumbbell Shoulder Press', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 22 },
          { name: 'Cable Lateral Raise', targetSets: 5, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 10 },
          { name: 'Overhead Rope Triceps Extension', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 25 },
          { name: 'Rope Pushdown', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 27.5 },
        ]
      },
      {
        id: 'p1_d2',
        dayOfWeek: 'Tuesday',
        name: 'Pull A',
        focus: 'Lats, Upper Back, Rear Delts, Biceps',
        cardio: '25 min Incline Walk First',
        exercises: [
          { name: 'Wide-Grip Lat Pulldown', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 60 },
          { name: 'Chest-Supported Dumbbell Row', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 24 },
          { name: 'Straight-Arm Cable Pulldown', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 25 },
          { name: 'Face Pull', targetSets: 4, minReps: 15, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 22.5 },
          { name: 'Incline Dumbbell Curl', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 75, rir: 1, defaultWeight: 14 },
          { name: 'Hammer Curl', targetSets: 2, minReps: 12, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 16 },
          { name: 'Cable Crunch', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 35 },
        ]
      },
      {
        id: 'p1_d3',
        dayOfWeek: 'Wednesday',
        name: 'Legs A',
        focus: 'Quads, Hamstrings, Calves, Abs',
        cardio: '15 min Lower Incline (Light)',
        exercises: [
          { name: 'Barbell Back Squat', targetSets: 4, minReps: 6, maxReps: 8, restSeconds: 180, rir: 2, defaultWeight: 90 },
          { name: 'Romanian Deadlift', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 150, rir: 2, defaultWeight: 80 },
          { name: 'Leg Press', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 120, rir: 2, defaultWeight: 160 },
          { name: 'Leg Extension', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 90, rir: 1, defaultWeight: 55 },
          { name: 'Seated Leg Curl', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 50 },
          { name: 'Standing Calf Raise', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 65 },
          { name: 'Hanging Knee Raise', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 0 },
        ]
      },
      {
        id: 'p1_d4',
        dayOfWeek: 'Thursday',
        name: 'Push B',
        focus: 'Chest (Different Angles), Side Delts, Triceps',
        cardio: '25 min Incline Walk First',
        exercises: [
          { name: 'Flat Dumbbell Press', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 28 },
          { name: 'Incline Barbell Press', targetSets: 3, minReps: 6, maxReps: 8, restSeconds: 150, rir: 2, defaultWeight: 65 },
          { name: 'Pec Deck Fly', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 50 },
          { name: 'Arnold Press', targetSets: 3, minReps: 10, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 18 },
          { name: 'Cable Lateral Raise', targetSets: 5, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 10 },
          { name: 'Skull Crusher (EZ Bar)', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 90, rir: 1, defaultWeight: 30 },
          { name: 'Close-Grip Bench Press', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 60 },
        ]
      },
      {
        id: 'p1_d5',
        dayOfWeek: 'Friday',
        name: 'Pull B',
        focus: 'Back Thickness, Traps, Biceps',
        cardio: '25 min Incline Walk First',
        exercises: [
          { name: 'Pull-up', targetSets: 4, minReps: 6, maxReps: 10, restSeconds: 150, rir: 2, defaultWeight: 0 },
          { name: 'One-Arm Dumbbell Row', targetSets: 3, minReps: 10, maxReps: 10, restSeconds: 90, rir: 2, defaultWeight: 28 },
          { name: 'T-Bar Row', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 50 },
          { name: 'Close-Grip Lat Pulldown', targetSets: 2, minReps: 10, maxReps: 12, restSeconds: 75, rir: 1, defaultWeight: 55 },
          { name: 'Reverse Pec Deck', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 45 },
          { name: 'Barbell Curl', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 90, rir: 1, defaultWeight: 30 },
          { name: 'Cable Curl', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 25 },
          { name: 'Barbell Shrug', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 80 },
          { name: 'Ab Wheel Rollout', targetSets: 3, minReps: 8, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 0 },
        ]
      },
      {
        id: 'p1_d6',
        dayOfWeek: 'Saturday',
        name: 'Legs B',
        focus: 'Glutes, Hamstrings, Quads, Calves',
        cardio: '15 min Lower Incline (Light)',
        exercises: [
          { name: 'Barbell Hip Thrust', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 150, rir: 2, defaultWeight: 100 },
          { name: 'Bulgarian Split Squat', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 18 },
          { name: 'Hack Squat', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 120, rir: 2, defaultWeight: 110 },
          { name: 'Lying Leg Curl', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 45 },
          { name: 'Single-Leg Romanian Deadlift', targetSets: 3, minReps: 10, maxReps: 10, restSeconds: 90, rir: 2, defaultWeight: 16 },
          { name: 'Leg Extension', targetSets: 2, minReps: 15, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 50 },
          { name: 'Standing Calf Raise', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 60 },
          { name: 'Seated Calf Raise', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 40 },
          { name: 'Cable Crunch', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 35 },
        ]
      },
      {
        id: 'p1_d7',
        dayOfWeek: 'Sunday',
        name: 'Cardio & Active Recovery',
        focus: 'Full Rest from Lifting',
        cardio: '20 to 25 min easy incline walk',
        exercises: []
      }
    ]
  },
  {
    id: 'plan2',
    userTarget: 'aman',
    name: '12-Week Lean Bulk (L4–L5 Safe)',
    subtitle: 'Push / Pull / Legs • 6 Days • L4-L5 Physio Checks & Swaps',
    level: 'Intermediate (1–3 yrs)',
    targetCalories: '2,800 to 2,900 kcal/day (250–300 kcal surplus)',
    targetProtein: '120–135 g/day (4 meals)',
    cardioNote: 'Pre-workout 10-15m Incline Walk (6-8% @ 4.5-5 km/h) or recumbent bike',
    summary: 'Identical volume and movement patterns as Recomp plan with L4-L5 spinal precautions, physio checks, and spine-friendly substitutions.',
    safetyNotes: [
      'Brace before each lift: breathe into belly, tighten core, and hold through the rep.',
      'Maintain neutral spine: keep lower back flat on pad in leg press, no lumbar rounding.',
      'Control tempo: 2-3s lowering with zero bouncing.',
      'Reassess immediately if pain radiates down leg or persists past the next morning.'
    ],
    days: [
      {
        id: 'p2_d1',
        dayOfWeek: 'Monday',
        name: 'Push A',
        focus: 'Chest, Front/Side Delts, Triceps',
        cardio: '10–15m Incline Walk (6–8% @ 4.5–5 km/h)',
        exercises: [
          { name: 'Incline Dumbbell Press', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 22, backNote: 'Safe' },
          { name: 'Flat Barbell Bench Press', targetSets: 3, minReps: 6, maxReps: 8, restSeconds: 150, rir: 2, defaultWeight: 65, backNote: 'Feet flat, back on bench. Safe' },
          { name: 'Low-to-High Cable Fly', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 90, rir: 1, defaultWeight: 12.5, backNote: 'Safe' },
          { name: 'Seated Dumbbell Shoulder Press', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 18, backNote: 'Use a back-supported bench' },
          { name: 'Cable Lateral Raise', targetSets: 5, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 10, backNote: 'Safe' },
          { name: 'Overhead Rope Triceps Extension', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 22.5, backNote: 'Safe' },
          { name: 'Rope Pushdown', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 25, backNote: 'Safe' },
        ]
      },
      {
        id: 'p2_d2',
        dayOfWeek: 'Tuesday',
        name: 'Pull A',
        focus: 'Lats, Upper Back, Rear Delts, Biceps',
        cardio: '10–15m Incline Walk First',
        exercises: [
          { name: 'Wide-Grip Lat Pulldown', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 55, backNote: 'Safe' },
          { name: 'Chest-Supported Dumbbell Row', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 22, backNote: 'Safe, back is supported' },
          { name: 'Straight-Arm Cable Pulldown', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 22.5, backNote: 'Safe' },
          { name: 'Face Pull', targetSets: 4, minReps: 15, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 20, backNote: 'Safe' },
          { name: 'Incline Dumbbell Curl', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 75, rir: 1, defaultWeight: 12, backNote: 'Safe' },
          { name: 'Hammer Curl', targetSets: 2, minReps: 12, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 14, backNote: 'Safe' },
          { 
            name: 'Cable Crunch', 
            targetSets: 3, 
            minReps: 12, 
            maxReps: 15, 
            restSeconds: 60, 
            rir: 1, 
            defaultWeight: 30,
            physioCheck: true,
            backNote: 'Spinal flexion under load', 
            swap: 'Dead bug (3 x 8 each side)' 
          },
        ]
      },
      {
        id: 'p2_d3',
        dayOfWeek: 'Wednesday',
        name: 'Legs A',
        focus: 'Quads, Hamstrings, Calves, Abs',
        cardio: '10–15m Lower Incline (or recumbent bike)',
        exercises: [
          { 
            name: 'Barbell Back Squat', 
            targetSets: 4, 
            minReps: 6, 
            maxReps: 8, 
            restSeconds: 180, 
            rir: 2, 
            defaultWeight: 75,
            physioCheck: true,
            backNote: 'High spinal compression', 
            swap: 'Hack squat (4 x 8 to 10)' 
          },
          { 
            name: 'Romanian Deadlift', 
            targetSets: 4, 
            minReps: 8, 
            maxReps: 10, 
            restSeconds: 150, 
            rir: 2, 
            defaultWeight: 65,
            physioCheck: true,
            backNote: 'Hinge loads lower back', 
            swap: 'Cable pull-through (4 x 10 to 12)' 
          },
          { name: 'Leg Press', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 120, rir: 2, defaultWeight: 140, backNote: 'Keep lower back flat on pad' },
          { name: 'Leg Extension', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 90, rir: 1, defaultWeight: 45, backNote: 'Safe' },
          { name: 'Seated Leg Curl', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 45, backNote: 'Safe' },
          { name: 'Standing Calf Raise', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 55, backNote: 'Safe' },
          { 
            name: 'Hanging Knee Raise', 
            targetSets: 3, 
            minReps: 10, 
            maxReps: 12, 
            restSeconds: 60, 
            rir: 1, 
            defaultWeight: 0,
            physioCheck: true,
            backNote: 'Spinal flexion check', 
            swap: 'Dead bug (3 x 8 each side)' 
          },
        ]
      },
      {
        id: 'p2_d4',
        dayOfWeek: 'Thursday',
        name: 'Push B',
        focus: 'Chest (Different Angles), Side Delts, Triceps',
        cardio: '10–15m Incline Walk First',
        exercises: [
          { name: 'Flat Dumbbell Press', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 24, backNote: 'Safe' },
          { name: 'Incline Barbell Press', targetSets: 3, minReps: 6, maxReps: 8, restSeconds: 150, rir: 2, defaultWeight: 55, backNote: 'Back on incline bench. Safe' },
          { name: 'Pec Deck Fly', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 45, backNote: 'Safe' },
          { name: 'Arnold Press', targetSets: 3, minReps: 10, maxReps: 10, restSeconds: 120, rir: 2, defaultWeight: 16, backNote: 'Seated, back-supported' },
          { name: 'Cable Lateral Raise', targetSets: 5, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 10, backNote: 'Safe' },
          { name: 'Skull Crusher (EZ Bar)', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 90, rir: 1, defaultWeight: 25, backNote: 'Lie on bench, back flat. Safe' },
          { 
            name: 'Close-Grip Bench Press', 
            targetSets: 3, 
            minReps: 8, 
            maxReps: 10, 
            restSeconds: 120, 
            rir: 2, 
            defaultWeight: 50,
            physioCheck: true,
            backNote: 'Physio check for bodyweight dips', 
            swap: 'Close-grip bench/machine press (3 x 8 to 10)' 
          },
        ]
      },
      {
        id: 'p2_d5',
        dayOfWeek: 'Friday',
        name: 'Pull B',
        focus: 'Back Thickness, Traps, Biceps',
        cardio: '10–15m Incline Walk First',
        exercises: [
          { name: 'Pull-up', targetSets: 4, minReps: 6, maxReps: 10, restSeconds: 150, rir: 2, defaultWeight: 0, backNote: 'Safe if pain-free. Use assistance if needed' },
          { name: 'One-Arm Dumbbell Row', targetSets: 3, minReps: 10, maxReps: 10, restSeconds: 90, rir: 2, defaultWeight: 24, backNote: 'Support free hand and knee on bench' },
          { 
            name: 'T-Bar Row', 
            targetSets: 3, 
            minReps: 8, 
            maxReps: 10, 
            restSeconds: 120, 
            rir: 2, 
            defaultWeight: 40,
            physioCheck: true,
            backNote: 'Use chest-supported version only', 
            swap: 'Chest-supported row (3 x 8 to 10)' 
          },
          { name: 'Close-Grip Lat Pulldown', targetSets: 2, minReps: 10, maxReps: 12, restSeconds: 75, rir: 1, defaultWeight: 50, backNote: 'Safe' },
          { name: 'Reverse Pec Deck', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 40, backNote: 'Safe' },
          { name: 'Barbell Curl', targetSets: 3, minReps: 8, maxReps: 10, restSeconds: 90, rir: 1, defaultWeight: 25, backNote: 'Stand tall, do not lean back. Safe' },
          { name: 'Cable Curl', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 22.5, backNote: 'Safe' },
          { 
            name: 'Barbell Shrug', 
            targetSets: 4, 
            minReps: 10, 
            maxReps: 12, 
            restSeconds: 90, 
            rir: 1, 
            defaultWeight: 60,
            physioCheck: true,
            backNote: 'Heavy shrugs load spine', 
            swap: 'Light DB shrug with neutral spine (4 x 10 to 12)' 
          },
          { 
            name: 'Ab Wheel Rollout', 
            targetSets: 3, 
            minReps: 8, 
            maxReps: 12, 
            restSeconds: 60, 
            rir: 1, 
            defaultWeight: 0,
            physioCheck: true,
            backNote: 'Loads lower back', 
            swap: 'Side plank (3 x 30 sec each side)' 
          },
        ]
      },
      {
        id: 'p2_d6',
        dayOfWeek: 'Saturday',
        name: 'Legs B',
        focus: 'Glutes, Hamstrings, Quads, Calves',
        cardio: '10–15m Lower Incline (or recumbent bike)',
        exercises: [
          { name: 'Barbell Hip Thrust', targetSets: 4, minReps: 8, maxReps: 10, restSeconds: 150, rir: 2, defaultWeight: 80, backNote: 'Back on bench, spine neutral. Safe' },
          { 
            name: 'Bulgarian Split Squat', 
            targetSets: 3, 
            minReps: 8, 
            maxReps: 10, 
            restSeconds: 120, 
            rir: 2, 
            defaultWeight: 14,
            physioCheck: true,
            backNote: 'Unilateral spine loading', 
            swap: 'Single-leg leg press (3 x 10 to 12 each leg)' 
          },
          { name: 'Hack Squat', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 120, rir: 2, defaultWeight: 90, backNote: 'Safe with controlled range' },
          { name: 'Lying Leg Curl', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 1, defaultWeight: 40, backNote: 'Safe' },
          { 
            name: 'Single-Leg Romanian Deadlift', 
            targetSets: 3, 
            minReps: 10, 
            maxReps: 10, 
            restSeconds: 90, 
            rir: 2, 
            defaultWeight: 14,
            physioCheck: true,
            backNote: 'Hinge loading check', 
            swap: 'Cable pull-through (3 x 12)' 
          },
          { name: 'Leg Extension', targetSets: 2, minReps: 15, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 45, backNote: 'Safe' },
          { name: 'Standing Calf Raise', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60, rir: 1, defaultWeight: 50, backNote: 'Safe' },
          { name: 'Seated Calf Raise', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 35, backNote: 'Safe' },
          { 
            name: 'Cable Crunch', 
            targetSets: 3, 
            minReps: 12, 
            maxReps: 15, 
            restSeconds: 60, 
            rir: 1, 
            defaultWeight: 30,
            physioCheck: true,
            backNote: 'Spinal flexion under load', 
            swap: 'Pallof press (3 x 10 each side)' 
          },
        ]
      },
      {
        id: 'p2_d7',
        dayOfWeek: 'Sunday',
        name: 'Rest or Active Walk',
        focus: 'Full Rest or 20 to 30 min easy walk',
        cardio: '20 to 30 min easy walk',
        exercises: []
      }
    ]
  }
];

export const getPlanById = (id) => {
  return SEED_PLANS.find(p => p.id === id) || SEED_PLANS[0];
};

export const getPlansForUser = (user) => {
  if (!user) return SEED_PLANS;
  const username = user.username?.toLowerCase() || user.name?.toLowerCase() || '';
  if (username === 'anurag' || user.plan === 'plan1') {
    return SEED_PLANS.filter(p => p.id === 'plan1');
  }
  if (username === 'aman' || user.plan === 'plan2') {
    return SEED_PLANS.filter(p => p.id === 'plan2');
  }
  return SEED_PLANS;
};

export const getTodayPlanDay = (plan) => {
  if (!plan || !plan.days || plan.days.length === 0) return null;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const match = plan.days.find(d => d.dayOfWeek === todayName);
  return match || plan.days[0];
};
