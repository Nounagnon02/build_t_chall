import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://build-t-chall-1.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        );
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ---------------------------------------------------------------------------
// API service functions
// ---------------------------------------------------------------------------

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (data) => api.post('/auth/refresh', data),
  me: () => api.get('/auth/me'),
};

export const galleryAPI = {
  list: (params) => api.get('/gallery', { params }),
  getTags: () => api.get('/gallery/tags'),
  get: (id) => api.get(`/gallery/${id}`),
};

export const servicesAPI = {
  list: () => api.get('/services'),
  get: (slug) => api.get(`/services/${slug}`),
};

export const testimonialsAPI = {
  list: (params) => api.get('/testimonials', { params }),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const budgetAPI = {
  estimate: (params) => api.get('/budget/estimate', { params }),
};

export const rdvAPI = {
  disponibilites: (params) => api.get('/rdv/disponibilites', { params }),
  reserver: (data) => api.post('/rdv/reserver', data),
};

export const blogAPI = {
  list: (params) => api.get('/blog/posts', { params }),
  get: (slug) => api.get(`/blog/posts/${slug}`),
  categories: () => api.get('/blog/categories'),
};

export const faqAPI = {
  list: (params) => api.get('/faq', { params }),
  categories: () => api.get('/faq/categories'),
};

export const partnersAPI = {
  list: (params) => api.get('/partners', { params }),
};

export const newsletterAPI = {
  subscribe: (data) => api.post('/newsletter/subscribe', data),
};

export const clientAPI = {
  dashboard: () => api.get('/client/dashboard'),
  checklist: {
    list: (params) => api.get('/client/checklist', { params }),
    create: (data) => api.post('/client/checklist', data),
    update: (id, data) => api.put(`/client/checklist/${id}`, data),
    delete: (id) => api.delete(`/client/checklist/${id}`),
  },
  documents: {
    list: () => api.get('/client/documents'),
    upload: (formData) => api.post('/client/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/client/documents/${id}`),
  },
  guests: {
    list: () => api.get('/client/guests'),
    create: (data) => api.post('/client/guests', data),
    update: (id, data) => api.put(`/client/guests/${id}`, data),
    delete: (id) => api.delete(`/client/guests/${id}`),
  },
  messages: {
    list: () => api.get('/client/messages'),
    send: (data) => api.post('/client/messages', data),
    markRead: (id) => api.put(`/client/messages/${id}/read`),
  },
  payments: {
    list: () => api.get('/client/payments'),
  },
  moodboard: {
    list: () => api.get('/client/moodboard'),
    create: (data) => api.post('/client/moodboard', data),
    update: (id, data) => api.put(`/client/moodboard/${id}`, data),
    delete: (id) => api.delete(`/client/moodboard/${id}`),
  },
};

export const projectAPI = {
  submit: (data) => api.post('/project-leads', data),
};

export const adminAPI = {
  users: {
    list: (params) => api.get('/admin/users', { params }),
    toggleStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  },
  analytics: {
    overview: () => api.get('/admin/analytics/overview'),
    charts: () => api.get('/admin/analytics/charts'),
  },
  content: {
    createGalleryPhoto: (data) => api.post('/admin/content/gallery', data),
    deleteGalleryPhoto: (id) => api.delete(`/admin/content/gallery/${id}`),
    createBlogPost: (data) => api.post('/admin/content/blog', data),
    updateBlogPost: (id, data) => api.put(`/admin/content/blog/${id}`, data),
    createService: (data) => api.post('/admin/content/services', data),
    createTestimonial: (data) => api.post('/admin/content/testimonials', data),
  },
  projectLeads: {
    list: () => api.get('/admin/content/project-leads'),
    updateStatus: (id, data) => api.put(`/admin/content/project-leads/${id}/status`, data),
  },
};
