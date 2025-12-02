import api from './api';

// Tasks
const getTasks = async () => {
    const response = await api.get('/data/tasks');
    return response.data;
};

const createTask = async (taskData: any) => {
    const response = await api.post('/data/tasks', taskData);
    return response.data;
};

const updateTask = async (id: string, taskData: any) => {
    const response = await api.put(`/data/tasks/${id}`, taskData);
    return response.data;
};

// Moods
const getMoods = async () => {
    const response = await api.get('/data/moods');
    return response.data;
};

const createMood = async (moodData: any) => {
    const response = await api.post('/data/moods', moodData);
    return response.data;
};

// Journal
const getJournalEntries = async () => {
    const response = await api.get('/data/journal');
    return response.data;
};

const createJournalEntry = async (entryData: any) => {
    const response = await api.post('/data/journal', entryData);
    return response.data;
};

const deleteJournalEntry = async (id: string) => {
    const response = await api.delete(`/data/journal/${id}`);
    return response.data;
};

// Chat
const getChatHistory = async (mode: string = 'comfort') => {
    const response = await api.get(`/data/chat?mode=${mode}`);
    return response.data;
};

const sendMessage = async (messageData: any) => {
    const response = await api.post('/data/chat', messageData);
    return response.data;
};

// Notifications
const getNotifications = async () => {
    const response = await api.get('/data/notifications');
    return response.data;
};

const createNotification = async (notificationData: any) => {
    const response = await api.post('/data/notifications', notificationData);
    return response.data;
};

const markNotificationRead = async (id: string) => {
    const response = await api.put(`/data/notifications/${id}/read`);
    return response.data;
};

const deleteNotification = async (id: string) => {
    const response = await api.delete(`/data/notifications/${id}`);
    return response.data;
};

// Support
const sendSupportMessage = async (data: any) => {
    const response = await api.post('/data/support', data);
    return response.data;
};

// Success Stories
const getSuccessStories = async () => {
    const response = await api.get('/data/success-stories');
    return response.data;
};

const submitSuccessStory = async (data: any) => {
    const response = await api.post('/data/success-stories', data);
    return response.data;
};

// User Profile
const updateProfile = async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    if (response.data) {
        // Update local storage with new user data but keep token
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...response.data }));
    }
    return response.data;
};

const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

const migrateData = async (data: any) => {
    const response = await api.post('/data/migrate', data);
    return response.data;
};

const dataService = {
    getTasks,
    createTask,
    updateTask,
    getMoods,
    createMood,
    getJournalEntries,
    createJournalEntry,
    deleteJournalEntry,
    getChatHistory,
    sendMessage,
    getNotifications,
    createNotification,
    markNotificationRead,
    deleteNotification,
    sendSupportMessage,
    getSuccessStories,
    submitSuccessStory,
    updateProfile,
    getProfile,
    migrateData,
    createPayment: async (paymentData: any) => {
        const response = await api.post('/payments', paymentData);
        return response.data;
    },

    // No Contact
    getNoContactMessages: async () => {
        const response = await api.get('/data/no-contact');
        return response.data;
    },

    createNoContactMessage: async (data: any) => {
        const response = await api.post('/data/no-contact', data);
        return response.data;
    },

    // Community
    getCommunityPosts: async () => {
        const response = await api.get('/data/community');
        return response.data;
    },

    createCommunityPost: async (data: any) => {
        const response = await api.post('/data/community', data);
        return response.data;
    },

    likeCommunityPost: async (id: string) => {
        const response = await api.put(`/data/community/${id}/like`);
        return response.data;
    },

    reportCommunityPost: async (id: string) => {
        const response = await api.post(`/data/community/${id}/report`);
        return response.data;
    },

    deleteCommunityPost: async (id: string) => {
        const response = await api.delete(`/data/community/${id}`);
        return response.data;
    }
};

export default dataService;
