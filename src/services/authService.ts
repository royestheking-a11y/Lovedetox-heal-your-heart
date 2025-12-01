import api from './api';

const login = async (userData: any) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }
    return response.data;
};

const register = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }
    return response.data;
};

const googleLogin = async (googleData: any) => {
    const response = await api.post('/auth/google', googleData);
    if (response.data) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('currentUser');
};

const deleteAccount = async () => {
    const response = await api.delete('/users/profile');
    localStorage.removeItem('currentUser');
    return response.data;
};

const changePassword = async (passwordData: any) => {
    const response = await api.put('/users/profile', passwordData);
    return response.data;
};

const authService = {
    login,
    register,
    googleLogin,
    logout,
    deleteAccount,
    changePassword
};

export default authService;
