const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function debugUpdate() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@lovedetox.com',
            password: 'lovedetox009'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 2. Update Profile
        console.log('Attempting to update profile...');
        try {
            const updateRes = await axios.put(
                `${API_URL}/users/profile`,
                {
                    isPro: true,
                    // Sending other fields to see if they cause issues
                    name: 'Admin User',
                    email: 'admin@lovedetox.com'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Update successful:', updateRes.data);
        } catch (err) {
            console.error('Update Failed!');
            console.error('Status:', err.response?.status);
            console.error('Data:', err.response?.data);
        }

    } catch (error) {
        console.error('Script error:', error.message);
    }
}

debugUpdate();
