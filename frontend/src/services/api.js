import axios from "axios";

// ── Base Axios instance ─────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => API.post("/api/auth/login", credentials),
  logout: () => API.post("/api/auth/logout"),
  me: () => API.get("/api/auth/me"),
};

// ── Tickets ──────────────────────────────────────────────────────
export const ticketsAPI = {
  getAll: (params) => API.get("/api/tickets", { params }),
  getById: (id) => API.get(`/api/tickets/${id}`),
  create: (data) => API.post("/api/tickets", data),
  update: (id, data) => API.put(`/api/tickets/${id}`, data),
  delete: (id) => API.delete(`/api/tickets/${id}`),
};

// ── Dashboard / Stats ────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => API.get("/api/dashboard/stats"),
  getTicketVolume: () => API.get("/api/dashboard/charts/ticket-volume"),
  getCategoryDistribution: () => API.get("/api/dashboard/charts/category-distribution"),
  getPriorityDistribution: () => API.get("/api/dashboard/charts/priority-distribution"),
  getSlaTrend: () => API.get("/api/dashboard/charts/sla-trend"),
  getAgentPerformance: () => API.get("/api/dashboard/charts/agent-performance"),
  getResolutionTime: () => API.get("/api/dashboard/charts/resolution-time"),
};

// ── Agents ───────────────────────────────────────────────────────
export const agentsAPI = {
  getAll: () => API.get("/api/agents"),
  getById: (id) => API.get(`/api/agents/${id}`),
  getPerformance: (id) => API.get(`/api/agents/${id}/performance`),
};

// ── SLA Prediction ───────────────────────────────────────────────
export const slaAPI = {
  predict: (ticketData) => API.post("/predict/sla", ticketData),
};

export default API;
