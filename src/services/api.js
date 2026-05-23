import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://qwh.com.sa/backend/public/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            //window.location.href = '#/dashboard/login';
            //window.location.reload();
        }
        return Promise.reject(error);
    }
);

// API Service
export const apiService = {
    // ==================== AUTHENTICATION ====================
    login: (credentials) => api.post('/api/login', credentials),
    register: (userData) => api.post('/api/register', userData),
    logout: () => api.post('/api/logout'),
    getUser: () => api.get('/api/admin/user'),
    
    // ==================== HERO SLIDES ====================
    getHeroSlides: () => api.get('/api/hero'),
    getHeroSlide: (id) => api.get(`/api/hero/1`),
    createHeroSlide: (data) => api.post('/api/admin/hero-slides', data),
    updateHeroSlide: (id, data) => api.put(`/api/admin/hero-slides/${id}`, data),
    deleteHeroSlide: (id) => api.delete(`/api/admin/hero-slides/${id}`),
    toggleHeroSlideStatus: (id) => api.patch(`/api/admin/hero-slides/${id}/toggle-status`),
    
    // ==================== SERVICES ====================
    getServices: () => api.get('/api/services'),
    getFeaturedServices: () => api.get('/api/services/featured'),
    getHomeFeaturedServices: () => api.get('/api/services/home-featured'),
    getService: (id) => api.get(`/api/services/${id}`),
    createService: (data) => api.post('/api/admin/services', data),
    updateService: (id, data) => api.put(`/api/admin/services/${id}`, data),
    deleteService: (id) => api.delete(`/api/admin/services/${id}`),
    toggleServiceFeatured: (id) => api.patch(`/api/admin/services/${id}/toggle-featured`),
    toggleServiceStatus: (id) => api.patch(`/api/admin/services/${id}/toggle-status`),
    reorderServices: (data) => api.post('/api/admin/services/reorder', data),
    
    // ==================== STATISTICS ====================
    getActiveStats: () => api.get('/api/stats/active'),
    getAllStats: () => api.get('/api/stats'),
    getStat: (id) => api.get(`/api/stats/${id}`),
    createStat: (data) => api.post('/api/admin/stats', data),
    updateStat: (id, data) => api.put(`/api/admin/stats/${id}`, data),
    deleteStat: (id) => api.delete(`/api/admin/stats/${id}`),
    toggleStatStatus: (id) => api.patch(`/api/admin/stats/${id}/toggle-status`),
    
    // ==================== CONTACT ====================
    sendContactMessage: (data) => api.post('/api/contact', data),
    getContactMessages: (params) => api.get('/api/admin/contact-messages', { params }),
    getContactMessage: (id) => api.get(`/api/admin/contact-messages/${id}`),
    markMessageAsRead: (id) => api.patch(`/api/admin/contact-messages/${id}/mark-read`),
    replyToMessage: (id, reply) => api.post(`/api/admin/contact-messages/${id}/reply`, { reply }),
    deleteContactMessage: (id) => api.delete(`/api/admin/contact-messages/${id}`),
    bulkDeleteContactMessages: (data) => api.post('/api/admin/contact-messages/bulk-delete', data),
    
    // ==================== SETTINGS ====================
    getAllSettings: () => api.get('/api/settings'),
    updateSettings: (data) => api.post('/api/admin/settings/update', data),
    getPublicSettings: () => api.get('/api/settings/public'),
    getSettings: () => api.get('/api/admin/settings'),
    getSetting: (key) => api.get(`/api/admin/settings/${key}`),
    createSetting: (data) => api.post('/api/admin/settings', data),
    updateSetting: (key, data) => api.put(`/api/admin/settings/${key}`, data),
    deleteSetting: (key) => api.delete(`/api/admin/settings/${key}`),
    bulkUpdateSettings: (settings) => api.post('/api/admin/settings/bulk-update', { settings }),
    // ==================== ABOUT CONTENT ====================
    getAboutContent: () => api.get('/api/about'),
    getAllAboutContents: () => api.get('/api/admin/about'),
    getAboutContentById: (id) => api.get(`/api/admin/about/${id}`),
    createAboutContent: (data) => api.post('/api/admin/about', data),
    updateAboutContent: (id, data) => api.put(`/api/admin/about/${id}`, data),
    deleteAboutContent: (id) => api.delete(`/api/admin/about/${id}`),
    toggleAboutContentStatus: (id) => api.patch(`/api/admin/about/${id}/toggle-status`),
    
    // ==================== CORE VALUES ====================
    getCoreValues: () => api.get('/api/core-values'),
    getAllCoreValues: () => api.get('/api/admin/core-values'),
    getCoreValue: (id) => api.get(`/api/admin/core-values/${id}`),
    createCoreValue: (data) => api.post('/api/admin/core-values', data),
    updateCoreValue: (id, data) => api.put(`/api/admin/core-values/${id}`, data),
    deleteCoreValue: (id) => api.delete(`/api/admin/core-values/${id}`),
    toggleCoreValueStatus: (id) => api.patch(`/api/admin/core-values/${id}/toggle-status`),
    reorderCoreValues: (data) => api.post('/api/admin/core-values/reorder', data),
    bulkDeleteCoreValues: (data) => api.post('/api/admin/core-values/bulk-delete', data),

    // ==================== TEAM MEMBERS ====================
    getTeamMembers: () => api.get('/api/team-members'),
    getAllTeamMembers: () => api.get('/api/admin/team-members'),
    getTeamMember: (id) => api.get(`/api/admin/team-members/${id}`),
    createTeamMember: (data) => {
        const config = data instanceof FormData 
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } };
        
        return api.post('/api/admin/team-members', data, config);
        },
      
   // updateTeamMember: (id, data) => api.put(`/api/admin/team-members/${id}`, data),
    updateTeamMember: (id, data) => {
    return api.put(`/api/admin/team-members/${id}`, data);
    },
    deleteTeamMember: (id) => api.delete(`/api/admin/team-members/${id}`),
    toggleTeamMemberStatus: (id) => api.patch(`/api/admin/team-members/${id}/toggle-status`),
    uploadTeamMemberImage: (id, file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post(`/api/admin/team-members/${id}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    reorderTeamMembers: (orders) => api.post('/api/admin/team-members/reorder', { orders }),
    bulkDeleteTeamMembers: (ids) => api.post('/api/admin/team-members/bulk-delete', { ids }),

    // ==================== DASHBOARD ====================
    getDashboardStats: () => api.get('/api/admin/dashboard/stats'),
    getDashboardChartData: (days = 30) => api.get(`/api/admin/dashboard/chart-data?days=${days}`),
};

export default api;