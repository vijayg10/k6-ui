const API_BASE = '/api';

export const k6Api = {
  async getStatus() {
    const response = await fetch(`${API_BASE}/v1/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }
    return response.json();
  },

  async getMetrics() {
    const response = await fetch(`${API_BASE}/v1/metrics`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`);
    }
    return response.json();
  },

  async updateStatus(data) {
    const response = await fetch(`${API_BASE}/v1/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'status',
          id: 'default',
          attributes: data
        }
      }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to update status (${response.status}): ${errorBody || response.statusText}`);
    }
    return response.json();
  },

  async pauseTest() {
    return this.updateStatus({ paused: true });
  },

  async resumeTest() {
    return this.updateStatus({ paused: false });
  },

  async stopTest() {
    return this.updateStatus({ stopped: true });
  },

  async setVUs(vus, vusMax = null) {
    const attributes = { vus };
    if (vusMax !== null) {
      attributes['vus-max'] = vusMax;
    }
    return this.updateStatus(attributes);
  },

  async getGroups() {
    const response = await fetch(`${API_BASE}/v1/groups`);
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }
    return response.json();
  },

  async getGroup(id) {
    const response = await fetch(`${API_BASE}/v1/groups/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch group: ${response.statusText}`);
    }
    return response.json();
  }
};
