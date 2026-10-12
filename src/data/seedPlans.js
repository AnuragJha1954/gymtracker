// Pre-configured workout plans structured for one-tap workout logging
export const SEED_PLANS = [
  {
    id: 'plan1',
    name: '12-Week Body Recomposition',
    subtitle: 'Push / Pull / Legs • 6 Days • 97kg → 85kg',
    level: 'Intermediate (1–3 yrs)',
    targetCalories: '2,800 kcal baseline',
    targetProtein: '180–200 g/day (4 meals)',
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
    name: 'Plan B: Aesthetic Build (Spinal Safe)',
    subtitle: 'L4–L5 Lumbar Safe • Hypertrophy Focused • 64kg Bulk',
    level: 'Intermediate',
    targetCalories: '2,600 kcal clean surplus',
    targetProtein: '140–160 g/day',
    cardioNote: 'Post-workout 15–20 min cycling or low incline walk',
    summary: 'Chest-supported and machine movements eliminating heavy spinal axial compression while maximizing muscle tension.',
    days: [
      {
        id: 'p2_d1',
        dayOfWeek: 'Monday',
        name: 'Push A (Spinal Safe)',
        focus: 'Chest, Front/Side Delts, Triceps',
        cardio: '15m incline walk',
        exercises: [
          { name: 'Flat Dumbbell Press', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 2, defaultWeight: 22 },
          { name: 'Incline Machine Chest Press', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 45 },
          { name: 'Seated Dumbbell Shoulder Press', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 90, rir: 2, defaultWeight: 16 },
          { name: 'Low-to-High Cable Fly', targetSets: 3, minReps: 15, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 12.5 },
          { name: 'Cable Lateral Raise', targetSets: 4, minReps: 15, maxReps: 20, restSeconds: 60, rir: 1, defaultWeight: 7.5 },
          { name: 'Rope Pushdown', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 22.5 },
        ]
      },
      {
        id: 'p2_d2',
        dayOfWeek: 'Tuesday',
        name: 'Pull A (Chest Supported)',
        focus: 'Lats, Upper Back, Rear Delts, Biceps',
        cardio: '15m incline walk',
        exercises: [
          { name: 'Wide-Grip Lat Pulldown', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 2, defaultWeight: 50 },
          { name: 'Chest-Supported Dumbbell Row', targetSets: 4, minReps: 10, maxReps: 12, restSeconds: 90, rir: 2, defaultWeight: 20 },
          { name: 'Seated Cable Row', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 45 },
          { name: 'Face Pull', targetSets: 3, minReps: 15, maxReps: 20, restSeconds: 60, rir: 1, defaultWeight: 20 },
          { name: 'Incline Dumbbell Curl', targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 12 },
          { name: 'Hammer Curl', targetSets: 2, minReps: 15, maxReps: 15, restSeconds: 60, rir: 1, defaultWeight: 12 },
        ]
      },
      {
        id: 'p2_d3',
        dayOfWeek: 'Wednesday',
        name: 'Legs A (No Heavy Squats)',
        focus: 'Quads, Calves, Supported Hamstrings',
        cardio: '15m stationary bike',
        exercises: [
          { name: 'Leg Press', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 120, rir: 2, defaultWeight: 140 },
          { name: 'Bulgarian Split Squat', targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 90, rir: 2, defaultWeight: 14 },
          { name: 'Leg Extension', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 45 },
          { name: 'Seated Leg Curl', targetSets: 4, minReps: 12, maxReps: 15, restSeconds: 75, rir: 1, defaultWeight: 40 },
          { name: 'Seated Calf Raise', targetSets: 4, minReps: 15, maxReps: 20, restSeconds: 60, rir: 1, defaultWeight: 35 },
        ]
      }
    ]
  }
];

export const getPlanById = (id) => {
  return SEED_PLANS.find(p => p.id === id) || SEED_PLANS[0];
};

export const getTodayPlanDay = (plan) => {
  if (!plan || !plan.days || plan.days.length === 0) return null;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const match = plan.days.find(d => d.dayOfWeek === todayName);
  return match || plan.days[0];
};
