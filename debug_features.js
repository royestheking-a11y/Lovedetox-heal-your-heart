const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function debugFeatures() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@lovedetox.com',
            password: 'lovedetox009'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Test Success Story Submission
        console.log('\nTesting Success Story Submission...');
        try {
            const storyPayload = {
                gender: 'male',
                relationshipDuration: '2 years',
                timeSinceBreakup: '3 months',
                text: 'This is a test story from the debug script.',
                rating: 5,
                // Frontend doesn't send these, but schema has them as optional?
                // Schema: name (required), age, occupation, gender (required), role, text (required), rating (required)
                // WAIT! Schema says `name` is REQUIRED.
                // Does frontend send `name`?
                // Let's check SuccessStories.tsx again.
            };

            // Checking if frontend sends 'name'. 
            // In SuccessStories.tsx:
            // const newStory = await dataService.submitSuccessStory({
            //   gender: formData.gender,
            //   text: ...,
            //   rating: 5
            // });
            // It does NOT send 'name'.
            // But the model says `name: { type: String, required: true }`.
            // THIS IS THE BUG.

            // I will try to send it exactly as frontend does to confirm failure.
            await axios.post(`${API_URL}/data/success-stories`, storyPayload, config);
            console.log('✅ Success Story Submitted!');
        } catch (err) {
            console.error('❌ Success Story Failed!');
            console.error('Status:', err.response?.status);
            console.error('Data:', err.response?.data);
        }

        // 3. Test Dashboard Data Update (User Profile)
        console.log('\nTesting Dashboard Data Update...');
        try {
            const updatePayload = {
                streak: 10,
                recoveryProgress: 50,
                noContactDays: 5
            };
            const updateRes = await axios.put(`${API_URL}/users/profile`, updatePayload, config);
            console.log('✅ Dashboard Data Updated:', updateRes.data.streak);
        } catch (err) {
            console.error('❌ Dashboard Update Failed!');
            console.error('Status:', err.response?.status);
            console.error('Data:', err.response?.data);
        }

    } catch (error) {
        console.error('Script error:', error.message);
    }
}

debugFeatures();
