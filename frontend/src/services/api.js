

import axios from 'axios';


// =========================
// BASE API URL
// =========================
const API_URL = 'http://localhost:8000/api/';


// =========================
// AXIOS INSTANCE
// =========================
const api = axios.create({
  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});


// =========================
// REQUEST INTERCEPTOR
// Add JWT Token Automatically
// =========================
api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =========================
// RESPONSE INTERCEPTOR
// Refresh Token Automatically
// =========================
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // Prevent crash if no response
    if (!error.response) {
      return Promise.reject(error);
    }

    // Access token expired
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem('refresh_token');

        // Get new access token
        const response = await axios.post(
          `${API_URL}token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        // Save new token
        localStorage.setItem(
          'access_token',
          newAccessToken
        );

        // Update request header
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {

        // Logout if refresh token invalid
        localStorage.clear();

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// =========================
// AUTH SERVICES
// =========================
export const authService = {

  // Register User
  register: (userData) =>
    api.post('register/', userData),

  // Login User
  login: (credentials) =>
    api.post('token/', credentials),

  // Logout User
  logout: () => {
    localStorage.clear();
  },

  // Google OAuth Login
  googleLogin: () => {
    window.location.href =
      'http://localhost:8000/api/auth/google/';
  },

  // GitHub OAuth Login
  githubLogin: () => {
    window.location.href =
      'http://localhost:8000/api/auth/github/';
  },
};


// =========================
// DASHBOARD SERVICES
// =========================
export const dashboardService = {

  // Dashboard Stats
  getStats: () =>
    api.get('dashboard/stats/'),
};


// =========================
// PROJECT SERVICES
// =========================
export const projectService = {

  // Get All Projects
  getAll: () =>
    api.get('projects/'),

  // Get Single Project
  getOne: (id) =>
    api.get(`projects/${id}/`),

  // Create Project
  create: (data) =>
    api.post('projects/', data),

  // Update Project
  update: (id, data) =>
    api.put(`projects/${id}/`, data),

  // Delete Project
  delete: (id) =>
    api.delete(`projects/${id}/`),
};


// =========================
// TASK SERVICES
// =========================
export const taskService = {

  // Get All Tasks
  getAll: (params) =>
    api.get('tasks/', { params }),

  // Create Task
  create: (data) =>
    api.post('tasks/', data),

  // Update Task
  update: (id, data) =>
    api.put(`tasks/${id}/`, data),

  // Delete Task
  delete: (id) =>
    api.delete(`tasks/${id}/`),
};


// =========================
// DEFAULT EXPORT
// =========================
export default api;