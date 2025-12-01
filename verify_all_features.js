const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let token = '';

async function runTests() {
    console.log('🚀 Starting Comprehensive Feature Verification...\n');

    try {
        // 1. Login (to get token)
        console.log('1. Testing Authentication (Login)...');
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@lovedetox.com',
                password: 'lovedetox009'
            });
            token = loginRes.data.token;
            console.log('   ✅ Login Successful. Token received.');
        } catch (error) {
            console.error('   ❌ Login Failed:', error.response ? error.response.data : error.message);
            return; // Cannot proceed without token
        }

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Public: Support Message
        console.log('\n2. Testing Public Support Message...');
        try {
            await axios.post(`${API_URL}/data/support`, {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test support message.'
            });
            console.log('   ✅ Support Message Sent.');
        } catch (error) {
            console.error('   ❌ Support Message Failed:', error.response ? error.response.data : error.message);
        }

        // 3. User: Success Story
        console.log('\n3. Testing Success Story Submission...');
        try {
            await axios.post(`${API_URL}/data/success-stories`, {
                name: 'Test User',
                age: 25,
                occupation: 'Tester',
                gender: 'female',
                role: 'dumper',
                text: 'I healed successfully!',
                rating: 5
            }, authHeaders);
            console.log('   ✅ Success Story Submitted.');
        } catch (error) {
            console.error('   ❌ Success Story Failed:', error.response ? error.response.data : error.message);
        }

        // 4. User: Chat Message
        console.log('\n4. Testing Chat Message...');
        try {
            await axios.post(`${API_URL}/data/chat`, {
                role: 'user',
                content: 'Hello AI, this is a test.'
            }, authHeaders);
            console.log('   ✅ Chat Message Sent.');
        } catch (error) {
            console.error('   ❌ Chat Message Failed:', error.response ? error.response.data : error.message);
        }

        // 5. User: Journal Entry
        console.log('\n5. Testing Journal Entry...');
        try {
            await axios.post(`${API_URL}/data/journal`, {
                title: 'Test Entry',
                content: 'Testing journal functionality.',
                mood: 'Happy',
                date: new Date()
            }, authHeaders);
            console.log('   ✅ Journal Entry Created.');
        } catch (error) {
            console.error('   ❌ Journal Entry Failed:', error.response ? error.response.data : error.message);
        }

        // 6. User: Task Creation
        console.log('\n6. Testing Task Creation...');
        try {
            await axios.post(`${API_URL}/data/tasks`, {
                title: 'Test Task',
                description: 'Testing task creation',
                timeEstimate: '5 min',
                date: new Date(),
                completed: false
            }, authHeaders);
            console.log('   ✅ Task Created.');
        } catch (error) {
            console.error('   ❌ Task Creation Failed:', error.response ? error.response.data : error.message);
        }

        // 7. User: Mood Logging
        console.log('\n7. Testing Mood Logging...');
        try {
            await axios.post(`${API_URL}/data/moods`, {
                emotion: 'Excited',
                intensity: 9,
                note: 'Testing mood logging',
                date: new Date()
            }, authHeaders);
            console.log('   ✅ Mood Logged.');
        } catch (error) {
            console.error('   ❌ Mood Logging Failed:', error.response ? error.response.data : error.message);
        }

        console.log('\n✨ Verification Complete!');

    } catch (error) {
        console.error('Unexpected Error:', error);
    }
}

runTests();
