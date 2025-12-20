const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:3000";

// Global callback for messages
let messageCallback = null;

export function setMessageCallback(callback) {
  messageCallback = callback;
}

async function request(path, options = {}) {
  try {
    const res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    // Handle error responses
    if (!res.ok) {
      const errorMsg = data?.error || data?.message || "An error occurred";
      if (messageCallback) messageCallback({ type: 'error', text: errorMsg });
      return data;
    }
    
    // Show success messages
    if (data?.message && messageCallback) {
      messageCallback({ type: 'success', text: data.message });
    }
    
    return data;
  } catch (error) {
    if (messageCallback) messageCallback({ type: 'error', text: error.message });
    throw error;
  }
}

export const api = {
  getCampaigns: () => request("/campaigns"),
  getCampaign: (id) => request(`/campaigns/${id}`),
  createCampaign: (userId, body) => request(`/campaigns/${userId}`, { method: "POST", body: JSON.stringify(body) }),
  updateCampaign: (id, body) => request(`/campaigns/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCampaign: (id) => request(`/campaigns/${id}`, { method: "DELETE" }),
  getDonations: (campaignId) => request(`/donations/${campaignId}`),
  postDonation: (userId, body) => request(`/donations/${userId}`, { method: "POST", body: JSON.stringify(body) }),
  signup: (body) => request(`/signup`, { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request(`/login`, { method: "POST", body: JSON.stringify(body) }),
  getProfile: (id) => request(`/profile/${id}`),
  updateProfile: (id, body) => request(`/profile/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProfile: (id) => request(`/profile/${id}`, { method: "DELETE" }),
};

export default api;
