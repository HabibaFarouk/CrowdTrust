const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
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
