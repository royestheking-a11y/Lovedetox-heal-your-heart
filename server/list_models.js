const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('API_KEY not found in .env');
    process.exit(1);
}

async function listModels() {
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        console.log('Available Models:');
        response.data.models.forEach(model => {
            console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
        });
    } catch (error) {
        console.error('Error listing models:', error.response ? error.response.data : error.message);
    }
}

listModels();
