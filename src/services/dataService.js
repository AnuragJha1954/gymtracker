class DataService {
  constructor() {
    this.syncInProgress = false;
    // Auto-sync when coming back online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.sync());
      // Initial sync
      setTimeout(() => this.sync(), 1000);
    }
  }

  getToken() {
    return localStorage.getItem('gymtracker_token');
  }

  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async fetchApi(payload) {
    if (!navigator.onLine) {
      throw new Error('Offline');
    }
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('gymtracker_token');
        localStorage.removeItem('gymtracker_user');
        window.location.reload();
      }
      throw new Error(result.error || 'API Error');
    }
    return result;
  }

  // ---- Offline queue & Cache ----
  getLocalWorkouts() {
    try {
      const cached = localStorage.getItem('gymtracker_cache_workouts');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }

  setLocalWorkouts(workouts) {
    localStorage.setItem('gymtracker_cache_workouts', JSON.stringify(workouts));
  }

  getQueue() {
    try {
      const q = localStorage.getItem('gymtracker_sync_queue');
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  }

  setQueue(queue) {
    localStorage.setItem('gymtracker_sync_queue', JSON.stringify(queue));
  }

  async sync() {
    if (this.syncInProgress || !navigator.onLine || !this.getToken()) return;
    this.syncInProgress = true;

    try {
      const queue = this.getQueue();
      let hasChanges = false;
      
      // Process pending mutations
      const failedQueue = [];
      for (const item of queue) {
        try {
          if (item.action === 'insert') {
            await this.fetchApi({ action: 'insert', collection: 'workouts', data: item.data });
          } else if (item.action === 'delete') {
            await this.fetchApi({ action: 'delete', collection: 'workouts', id: item.id });
          }
          hasChanges = true;
        } catch (e) {
          if (e.message !== 'Offline') {
            // Keep in queue if it failed for network reasons, otherwise discard on hard error? 
            // For safety we'll keep it unless it's a 4xx.
            failedQueue.push(item);
          }
        }
      }
      this.setQueue(failedQueue);

      // Now pull fresh data from server
      const res = await this.fetchApi({ action: 'readAll' });
      if (res && res.data && res.data.workouts) {
        this.setLocalWorkouts(res.data.workouts);
        // Only emit if we successfully fetched the latest remote state
        window.dispatchEvent(new Event('unitrack-data-updated'));
      }
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      this.syncInProgress = false;
    }
  }

  // ---- Workouts ----
  async getWorkouts() {
    // Return cached immediately, trigger sync in background
    this.sync();
    
    // Mix local cache with pending queue items for optimistic UI
    let workouts = this.getLocalWorkouts();
    const queue = this.getQueue();
    
    // Apply pending local deletes
    const pendingDeletes = new Set(queue.filter(q => q.action === 'delete').map(q => q.id));
    workouts = workouts.filter(w => !pendingDeletes.has(w.id));
    
    // Apply pending local inserts (or updates if they override)
    const pendingInserts = queue.filter(q => q.action === 'insert').map(q => q.data);
    for (const insert of pendingInserts) {
      const idx = workouts.findIndex(w => w.id === insert.id);
      if (idx > -1) {
        workouts[idx] = insert;
      } else {
        workouts.push(insert);
      }
    }
    
    return workouts;
  }

  async saveWorkout(workout) {
    // Queue it
    const queue = this.getQueue();
    // Remove any existing insert for same ID
    const newQueue = queue.filter(q => !(q.action === 'insert' && q.data.id === workout.id));
    newQueue.push({ action: 'insert', data: workout, timestamp: Date.now() });
    this.setQueue(newQueue);
    
    // Attempt background sync
    this.sync();
    window.dispatchEvent(new Event('unitrack-data-updated'));
  }

  async deleteWorkout(id) {
    const queue = this.getQueue();
    // Remove any pending insert for this ID so we don't insert then delete unnecessarily
    const newQueue = queue.filter(q => !(q.action === 'insert' && q.data.id === id));
    newQueue.push({ action: 'delete', id, timestamp: Date.now() });
    this.setQueue(newQueue);

    // Attempt background sync
    this.sync();
    window.dispatchEvent(new Event('unitrack-data-updated'));
  }
}

export const dataService = new DataService();
