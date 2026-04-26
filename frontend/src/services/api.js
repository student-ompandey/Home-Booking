import axios from 'axios';

/**
 * Axios API instance configured for the Settel Inn backend.
 * - Base URL from env or falls back to proxy
 * - Auto-attaches JWT from localStorage
 * - Handles 401 responses globally
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ─── Request Interceptor: Attach Token ─────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: Handle 401 ──────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refreshing the token
      try {
        const { data } = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.data.accessToken);
        error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api.request(error.config);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// ─── Room API ──────────────────────────────────────────────
export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  getMyRooms: (params) => api.get('/rooms/my-rooms', { params }),
};

// ─── User API ──────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// ─── Review API ────────────────────────────────────────────
export const reviewAPI = {
  getRoomReviews: (roomId, params) => api.get(`/reviews/${roomId}`, { params }),
  addReview: (data) => api.post('/reviews', data),
};

// ─── Notification API ──────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// ─── Chat API ──────────────────────────────────────────────
export const chatAPI = {
  getChats: () => api.get('/chats'),
  createChat: (data) => api.post('/chats', data),
};

// ─── Message API ───────────────────────────────────────────
export const messageAPI = {
  getMessages: (chatId) => api.get(`/messages/${chatId}`),
  sendMessage: (data) => api.post('/messages', data),
  markMessageSeen: (id) => api.put(`/messages/${id}/seen`),
  markChatMessagesSeen: (chatId) => api.put(`/messages/chat/${chatId}/seen`),
};

// ─── Admin API ─────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRooms: (params) => api.get('/admin/rooms', { params }),
  approveRoom: (id) => api.put(`/admin/rooms/${id}/approve`),
  rejectRoom: (id, reason) => api.put(`/admin/rooms/${id}/reject`, { reason }),
  deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),
  getUsers: (params) => api.get('/admin/users', { params }),
};

export default api;
