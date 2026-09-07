class DataService {
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

  async getAllData() {
    try {
      const res = await this.fetchApi({ action: 'readAll' });
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // ---- Workouts ----
  async getWorkouts() {
    const data = await this.getAllData();
    return data?.workouts || [];
  }
  async saveWorkout(workout) {
    await this.fetchApi({ action: 'insert', collection: 'workouts', data: workout });
  }
  async deleteWorkout(id) {
    await this.fetchApi({ action: 'delete', collection: 'workouts', id });
  }
}

export const dataService = new DataService();
