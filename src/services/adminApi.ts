import axios from 'axios';

const adminApiClient = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Admin JWT Token automatically
adminApiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('c2c_admin_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to unwrap or catch 401
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        // If not on login page, clear token and redirect
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('c2c_admin_token');
          localStorage.removeItem('c2c_admin_session');
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Profile
  getProfile: async () => {
    const res = await adminApiClient.get('/profile');
    return res.data.data;
  },
  updateProfile: async (data: any) => {
    const res = await adminApiClient.put('/profile', data);
    return res.data.data;
  },

  // Dashboard
  getDashboardAnalytics: async () => {
    const res = await adminApiClient.get('/dashboard');
    return res.data.data;
  },

  // Students
  getStudents: async (params?: { page?: number; limit?: number; q?: string; status?: string; college?: string; branch?: string }) => {
    const res = await adminApiClient.get('/students', { params });
    return res.data.data;
  },
  getStudentById: async (id: string) => {
    const res = await adminApiClient.get(`/students/${id}`);
    return res.data.data;
  },
  updateStudent: async (id: string, data: any) => {
    const res = await adminApiClient.put(`/students/${id}`, data);
    return res.data.data;
  },
  updateStudentStatus: async (id: string, status: 'Active' | 'Inactive') => {
    const res = await adminApiClient.patch(`/students/${id}/status`, { status });
    return res.data.data;
  },
  deleteStudent: async (id: string) => {
    const res = await adminApiClient.delete(`/students/${id}`);
    return res.data;
  },

  // Colleges
  getColleges: async (params?: { page?: number; limit?: number; q?: string; status?: string; verificationStatus?: string }) => {
    const res = await adminApiClient.get('/colleges', { params });
    return res.data.data;
  },
  getCollegeById: async (id: string) => {
    const res = await adminApiClient.get(`/colleges/${id}`);
    return res.data.data;
  },
  createCollege: async (data: any) => {
    const res = await adminApiClient.post('/colleges', data);
    return res.data.data;
  },
  updateCollege: async (id: string, data: any) => {
    const res = await adminApiClient.put(`/colleges/${id}`, data);
    return res.data.data;
  },
  updateCollegeStatus: async (id: string, status: 'Active' | 'Inactive') => {
    const res = await adminApiClient.patch(`/colleges/${id}/status`, { status });
    return res.data.data;
  },
  deleteCollege: async (id: string) => {
    const res = await adminApiClient.delete(`/colleges/${id}`);
    return res.data;
  },

  // Recruiters & Companies
  getRecruiters: async (params?: { page?: number; limit?: number; q?: string; status?: string; verificationStatus?: string }) => {
    const res = await adminApiClient.get('/recruiters', { params });
    return res.data.data;
  },
  getRecruiterById: async (id: string) => {
    const res = await adminApiClient.get(`/recruiters/${id}`);
    return res.data.data;
  },
  createRecruiter: async (data: any) => {
    const res = await adminApiClient.post('/recruiters', data);
    return res.data.data;
  },
  updateRecruiter: async (id: string, data: any) => {
    const res = await adminApiClient.put(`/recruiters/${id}`, data);
    return res.data.data;
  },
  updateRecruiterStatus: async (id: string, status: 'Active' | 'Inactive') => {
    const res = await adminApiClient.patch(`/recruiters/${id}/status`, { status });
    return res.data.data;
  },
  deleteRecruiter: async (id: string) => {
    const res = await adminApiClient.delete(`/recruiters/${id}`);
    return res.data;
  },
  getCompanies: async () => {
    const res = await adminApiClient.get('/companies');
    return res.data.data;
  },

  // Projects & Moderation
  getProjects: async (params?: { page?: number; limit?: number; q?: string; status?: string; approvalStatus?: string }) => {
    const res = await adminApiClient.get('/projects', { params });
    return res.data.data;
  },
  getProjectById: async (id: string) => {
    const res = await adminApiClient.get(`/projects/${id}`);
    return res.data.data;
  },
  createProject: async (data: any) => {
    const res = await adminApiClient.post('/projects', data);
    return res.data.data;
  },
  updateProject: async (id: string, data: any) => {
    const res = await adminApiClient.put(`/projects/${id}`, data);
    return res.data.data;
  },
  approveProject: async (id: string) => {
    const res = await adminApiClient.put(`/projects/${id}/approve`);
    return res.data.data;
  },
  rejectProject: async (id: string) => {
    const res = await adminApiClient.put(`/projects/${id}/reject`);
    return res.data.data;
  },
  deleteProject: async (id: string) => {
    const res = await adminApiClient.delete(`/projects/${id}`);
    return res.data;
  },

  // Verification Queue
  getVerificationQueue: async () => {
    const res = await adminApiClient.get('/verifications');
    return res.data.data;
  },
  verifyCollege: async (id: string, status: 'Verified' | 'Rejected', note?: string) => {
    const res = await adminApiClient.put(`/verifications/colleges/${id}`, { status, note });
    return res.data.data;
  },
  verifyRecruiter: async (id: string, status: 'Verified' | 'Rejected', note?: string) => {
    const res = await adminApiClient.put(`/verifications/recruiters/${id}`, { status, note });
    return res.data.data;
  },

  // Placement Oversight
  getPlacementOversight: async () => {
    const res = await adminApiClient.get('/placements/overview');
    return res.data.data;
  },

  // Broadcasts
  getBroadcasts: async (params?: { page?: number; limit?: number }) => {
    const res = await adminApiClient.get('/broadcasts', { params });
    return res.data.data;
  },
  createBroadcast: async (data: { title: string; message: string; targetAudience?: string; priority?: string; status?: string }) => {
    const res = await adminApiClient.post('/broadcasts', data);
    return res.data.data;
  },
  deleteBroadcast: async (id: string) => {
    const res = await adminApiClient.delete(`/broadcasts/${id}`);
    return res.data;
  },

  // Content Roadmaps
  getContentRoadmaps: async (params?: { category?: string; status?: string }) => {
    const res = await adminApiClient.get('/content/roadmaps', { params });
    return res.data.data;
  },
  createContentRoadmap: async (data: { title: string; category?: string; description?: string; status?: string }) => {
    const res = await adminApiClient.post('/content/roadmaps', data);
    return res.data.data;
  },
  updateContentRoadmap: async (id: string, data: any) => {
    const res = await adminApiClient.put(`/content/roadmaps/${id}`, data);
    return res.data.data;
  },
  deleteContentRoadmap: async (id: string) => {
    const res = await adminApiClient.delete(`/content/roadmaps/${id}`);
    return res.data;
  },

  // Support Tickets
  getSupportTickets: async (params?: { status?: string; priority?: string; type?: string; q?: string }) => {
    const res = await adminApiClient.get('/support/tickets', { params });
    return res.data.data;
  },
  getSupportTicketById: async (id: string) => {
    const res = await adminApiClient.get(`/support/tickets/${id}`);
    return res.data.data;
  },
  createSupportTicket: async (data: any) => {
    const res = await adminApiClient.post('/support/tickets', data);
    return res.data.data;
  },
  replySupportTicket: async (id: string, text: string, isInternalNote: boolean = false) => {
    const res = await adminApiClient.post(`/support/tickets/${id}/reply`, { text, isInternalNote });
    return res.data.data;
  },
  updateSupportTicketStatus: async (id: string, status: string) => {
    const res = await adminApiClient.put(`/support/tickets/${id}/status`, { status });
    return res.data.data;
  },

  // Analytics
  getPlatformAnalytics: async () => {
    const res = await adminApiClient.get('/analytics');
    return res.data.data;
  },

  // Settings
  getSystemSettings: async () => {
    const res = await adminApiClient.get('/settings');
    return res.data.data;
  },
  updateSystemSettings: async (data: any) => {
    const res = await adminApiClient.put('/settings', data);
    return res.data.data;
  },

  // Activity Log
  getAdminActivities: async (params?: { page?: number; limit?: number; action?: string; targetModel?: string }) => {
    const res = await adminApiClient.get('/activity', { params });
    return res.data.data;
  },
};

export default adminApi;
