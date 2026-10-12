// Safe haptic feedback triggers for mobile devices
export const haptics = {
  light() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch (_) {}
  },
  medium() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    } catch (_) {}
  },
  success() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([15, 40, 30]);
      }
    } catch (_) {}
  },
  celebratePR() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 40, 50, 40, 100]);
      }
    } catch (_) {}
  }
};
