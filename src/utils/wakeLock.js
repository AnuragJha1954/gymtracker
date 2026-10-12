// Screen Wake Lock API wrapper to prevent screen sleep on the gym floor
class ScreenWakeLock {
  constructor() {
    this.wakeLock = null;
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  async request() {
    try {
      if ('wakeLock' in navigator && !this.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
      }
    } catch (err) {
      // Browser might deny if battery is critically low or tab is in background
      console.warn('Wake Lock request failed:', err?.message || err);
    }
  }

  async release() {
    try {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      if (this.wakeLock) {
        await this.wakeLock.release();
        this.wakeLock = null;
      }
    } catch (_) {}
  }

  async handleVisibilityChange() {
    if (this.wakeLock !== null && document.visibilityState === 'visible') {
      await this.request();
    }
  }
}

export const wakeLockService = new ScreenWakeLock();
