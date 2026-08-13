import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "c2c_student_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// =======================
// Request Interceptor
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// Response Interceptor
// =======================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("c2c_student_user");
    }

    return Promise.reject(error);
  }
);

// =======================
// Types
// =======================

export interface StudentProfile {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: string;

  college?: string;
  branch?: string;
  semester?: number;

  skills?: any[];
  skillDetails?: any[];
  interests?: any[];
  education?: any[];

  resume?: string;
  resumeUrl?: string;

  bio?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;

  status?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export const unwrapData = <T>(
  response: { data: any },
  key?: string
): T => {
  const payload = response.data?.data ?? response.data;
  return key ? payload[key] : payload;
};

// =======================
// Authentication
// =======================

const auth = {
  register: (data: any) => api.post("/auth/register", data),

  login: (data: any) => api.post("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

// =======================
// Profile
// =======================

const profile = {
  get: () => api.get("/student/profile"),

  update: (data: any) =>
    api.put("/student/profile", data),
};

// =======================
// Dashboard
// =======================

const dashboard = {
  get: () => api.get("/student/dashboard"),
};

// =======================
// Skills
// =======================

const skills = {
  get: () => api.get("/student/skills"),

  add: (data: any) =>
    api.post("/student/skills", data),

  update: (id: string, data: any) =>
    api.put(`/student/skills/${id}`, data),

  delete: (id: string) =>
    api.delete(`/student/skills/${id}`),
};

// =======================
// Projects
// =======================

const projects = {
  get: () => api.get("/student/projects"),

  apply: (projectId: string, data: any = {}) =>
    api.post(`/student/projects/${projectId}/apply`, data),

  applications: () =>
    api.get("/student/applications"),
};

// =======================
// Notifications
// =======================

const notifications = {
  get: () => api.get("/student/notifications"),

  markRead: (id: string) =>
    api.patch(`/student/notifications/${id}/read`),

  markAllRead: () =>
    api.patch("/student/notifications/all/read"),

  delete: (id: string) =>
    api.delete(`/student/notifications/${id}`),
};

// =======================
// Certificates
// =======================

const certificates = {
  get: () =>
    api.get("/student/certificates"),
};

// =======================
// Settings
// =======================

const settings = {
  get: () =>
    api.get("/student/settings"),

  update: (data: any) =>
    api.put("/student/settings", data),
};

// =======================
// Resume Builder
// =======================

const resume = {
  get: () =>
    api.get("/student/resume-builder"),

  save: (data: any) =>
    api.put("/student/resume-builder", data),
};

// =======================
// Hiring
// =======================

const hiring = {
  get: () =>
    api.get("/student/hiring/drives"),

  start: (projectId: string, data: any = {}) =>
    api.post(
      `/student/hiring/drives/${projectId}/start`,
      data
    ),
};

// =======================
// Export Combined API
// =======================

export const studentApi = {
  ...auth,

  getProfile: profile.get,
  updateProfile: profile.update,

  getDashboard: dashboard.get,

  getSkills: skills.get,
  addSkill: skills.add,
  updateSkill: skills.update,
  deleteSkill: skills.delete,

  getProjects: projects.get,
  applyToProject: projects.apply,
  getApplications: projects.applications,

  getNotifications: notifications.get,
  markNotificationRead: notifications.markRead,
  markAllNotificationsRead: notifications.markAllRead,
  deleteNotification: notifications.delete,

  getCertificates: certificates.get,

  getSettings: settings.get,
  updateSettings: settings.update,

  getResumeBuilder: resume.get,
  saveResumeBuilder: resume.save,

  getHiringDrives: hiring.get,
  startHiringDrive: hiring.start,
};

// =======================
// Error Helper
// =======================

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong"
    );
  }

  return "Something went wrong";
};

export default api;