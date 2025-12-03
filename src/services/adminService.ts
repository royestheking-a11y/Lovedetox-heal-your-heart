import api from './api';

export const adminService = {
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    updateUser: async (userId: string, data: any) => {
        const response = await api.put(`/admin/users/${userId}`, data);
        return response.data;
    },

    deleteUser: async (userId: string) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    getSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    updateSettings: async (settings: any) => {
        const response = await api.put('/admin/settings', settings);
        return response.data;
    },

    // Support Messages
    getSupportMessages: async () => {
        const response = await api.get('/admin/support');
        return response.data;
    },

    resolveSupportMessage: async (id: string) => {
        const response = await api.put(`/admin/support/${id}`, { status: 'resolved' });
        return response.data;
    },

    deleteSupportMessage: async (id: string) => {
        const response = await api.delete(`/admin/support/${id}`);
        return response.data;
    },

    // Global Tasks
    getGlobalTasks: async () => {
        const response = await api.get('/admin/global-tasks');
        return response.data;
    },

    createGlobalTask: async (task: any) => {
        const response = await api.post('/admin/global-tasks', task);
        return response.data;
    },

    updateGlobalTask: async (id: string, task: any) => {
        const response = await api.put(`/admin/global-tasks/${id}`, task);
        return response.data;
    },

    deleteGlobalTask: async (id: string) => {
        const response = await api.delete(`/admin/global-tasks/${id}`);
        return response.data;
    },

    // Success Stories
    getSuccessStories: async () => {
        const response = await api.get('/admin/success-stories');
        return response.data;
    },

    updateSuccessStoryStatus: async (id: string, status: 'approved' | 'rejected') => {
        const response = await api.put(`/admin/success-stories/${id}`, { status });
        return response.data;
    },

    deleteSuccessStory: async (id: string) => {
        const response = await api.delete(`/admin/success-stories/${id}`);
        return response.data;
    },

    // Payments
    getPayments: async () => {
        const res = await api.get('/payments');
        return res.data;
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getRevenueStats: async () => {
        const response = await api.get('/admin/revenue-stats');
        return response.data;
    },

    // Achievements
    getAchievements: async () => {
        const response = await api.get('/admin/achievements');
        return response.data;
    },

    // Mood Risks
    getMoodRisks: async () => {
        const response = await api.get('/admin/mood-risks');
        return response.data;
    },

    // No Contact Monitor
    getAllNoContactMessages: async () => {
        const response = await api.get('/admin/no-contact');
        return response.data;
    },

    // Community Moderation
    getAllCommunityPosts: async () => {
        const response = await api.get('/admin/community');
        return response.data;
    },

    deleteCommunityPost: async (id: string) => {
        const response = await api.delete(`/admin/community/${id}`);
        return response.data;
    },

    clearCommunityReport: async (id: string) => {
        const response = await api.put(`/admin/community/${id}/clear-report`);
        return response.data;
    }
};

export default adminService;
