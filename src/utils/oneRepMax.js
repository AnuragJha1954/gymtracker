// 1RM and PR tracking utilities using standard Epley formulation
export function calculate1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps, 10) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return Math.round(w * 10) / 10;
  // Epley formula: w * (1 + r / 30)
  return Math.round(w * (1 + r / 30) * 10) / 10;
}

/**
 * Checks if a set achieves a PR compared to historical workouts
 * @param {string} exerciseName
 * @param {number} weight
 * @param {number} reps
 * @param {Array} pastWorkouts
 * @returns {{ isWeightPR: boolean, isRepPR: boolean, is1RMPR: boolean }}
 */
export function checkPersonalRecords(exerciseName, weight, reps, pastWorkouts = []) {
  const currentW = parseFloat(weight) || 0;
  const currentR = parseInt(reps, 10) || 0;
  const current1RM = calculate1RM(currentW, currentR);

  if (currentW <= 0 || currentR <= 0) {
    return { isWeightPR: false, isRepPR: false, is1RMPR: false };
  }

  let maxHistoricalW = 0;
  let maxHistoricalR = 0;
  let maxHistorical1RM = 0;

  for (const wo of pastWorkouts) {
    if (!wo.exercises) continue;
    for (const ex of wo.exercises) {
      if (ex.name?.toLowerCase().trim() === exerciseName?.toLowerCase().trim()) {
        for (const s of (ex.sets || [])) {
          if (s.completed && s.weight > 0 && s.reps > 0) {
            if (s.weight > maxHistoricalW) maxHistoricalW = s.weight;
            if (s.reps > maxHistoricalR) maxHistoricalR = s.reps;
            const oneRM = calculate1RM(s.weight, s.reps);
            if (oneRM > maxHistorical1RM) maxHistorical1RM = oneRM;
          }
        }
      }
    }
  }

  return {
    isWeightPR: maxHistoricalW > 0 && currentW > maxHistoricalW,
    isRepPR: maxHistoricalR > 0 && currentR > maxHistoricalR,
    is1RMPR: maxHistorical1RM > 0 && current1RM > maxHistorical1RM
  };
}

/**
 * Finds the previous session's performance for a given exercise
 */
export function getLastSessionPerformance(exerciseName, pastWorkouts = []) {
  if (!exerciseName || !pastWorkouts.length) return null;
  const targetName = exerciseName.toLowerCase().trim();

  // Find the most recent workout containing this exercise
  for (const wo of pastWorkouts) {
    if (!wo.exercises) continue;
    const foundEx = wo.exercises.find(e => e.name?.toLowerCase().trim() === targetName);
    if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
      const completedSets = foundEx.sets.filter(s => s.completed || s.weight > 0);
      if (completedSets.length > 0) {
        return {
          date: wo.date,
          sets: completedSets
        };
      }
    }
  }
  return null;
}
