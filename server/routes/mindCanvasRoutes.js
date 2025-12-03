const express = require('express');
const router = express.Router();
const MindCanvasImage = require('../models/MindCanvasImage');
const User = require('../models/User'); // Assuming you have a User model
const SystemSettings = require('../models/SystemSettings'); // Assuming you have SystemSettings
const axios = require('axios');

// Helper function to get system settings
const getSystemSettings = async () => {
    let settings = await SystemSettings.findOne();
    if (!settings) {
        settings = new SystemSettings();
        await settings.save();
    }
    return settings;
};

// Generate Image (Proxy to Pollinations.ai and save metadata)
router.post('/generate', async (req, res) => {
    try {
        const { user_id, prompt, style, is_pro } = req.body;

        if (!user_id || !prompt) {
            return res.status(400).json({ message: 'User ID and prompt are required' });
        }

        // Check daily limits for free users
        if (!is_pro) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const count = await MindCanvasImage.countDocuments({
                user_id,
                date: { $gte: today },
                is_pro_generated: false
            });

            const settings = await getSystemSettings();
            const limit = settings.mindCanvasDailyLimit || 5; // Default limit

            if (count >= limit) {
                return res.status(403).json({ message: 'Daily limit reached for free users' });
            }
        }

        // Logic: If style is 'Magic', use Hugging Face. Otherwise, use Pollinations.ai.
        let finalImageUrl = '';

        if (style === 'Magic') {
            console.log('✨ Magic style selected, using Hugging Face...');
            const hfToken = process.env.HUGGING_FACE_API_KEY || process.env.VITE_HUGGING_FACE_API_KEY;

            if (!hfToken) {
                throw new Error('Hugging Face API Key missing for Magic style');
            }

            try {
                const makeRequest = async (retries = 3, delay = 3000) => {
                    try {
                        return await axios.post(
                            "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
                            { inputs: `${prompt} (masterpiece, best quality, magic, fantasy, ethereal)` },
                            {
                                headers: {
                                    Authorization: `Bearer ${hfToken}`,
                                    Accept: 'image/jpeg',
                                    'Content-Type': 'application/json'
                                },
                                responseType: 'arraybuffer'
                            }
                        );
                    } catch (err) {
                        // If model is loading (503), retry
                        if (err.response && err.response.status === 503 && retries > 0) {
                            console.log(`⏳ Model loading, retrying in ${delay / 1000}s... (${retries} retries left)`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            return makeRequest(retries - 1, delay * 2); // Exponential backoff
                        }
                        throw err;
                    }
                };

                const hfResponse = await makeRequest();

                if (hfResponse.status === 200) {
                    const buffer = Buffer.from(hfResponse.data);
                    finalImageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
                    console.log('✅ Generated Magic image using Hugging Face');
                } else {
                    throw new Error(`Hugging Face API returned status ${hfResponse.status}`);
                }
            } catch (hfError) {
                console.error('❌ Hugging Face generation failed:', hfError.message);
                if (hfError.response) {
                    console.error('HF Response Data:', hfError.response.data.toString());
                    console.error('HF Status:', hfError.response.status);
                }
                throw new Error(`Failed to generate Magic image: ${hfError.response?.data?.toString() || hfError.message}`);
            }
        } else {
            // Use Pollinations.ai for all other styles
            // We removed the strict axios.head() check as it was causing false negatives
            const encodedPrompt = encodeURIComponent(`${prompt} ${style || ''}`);
            finalImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true`;
            console.log(`🎨 Using Pollinations.ai for style: ${style}`);
        }

        // Save metadata to database
        const newImage = new MindCanvasImage({
            user_id,
            text_note: prompt,
            image_url: finalImageUrl,
            is_pro_generated: is_pro || false,
            style: style || 'default'
        });

        await newImage.save();

        res.json({
            success: true,
            imageUrl: finalImageUrl,
            imageId: newImage._id
        });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: error.message || 'Server error generating image' });
    }
});

// Get User's Art
router.get('/my-art/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const images = await MindCanvasImage.find({ user_id: userId }).sort({ date: -1 });
        res.json(images);
    } catch (error) {
        console.error('Error fetching user art:', error);
        res.status(500).json({ message: 'Server error fetching art' });
    }
});

// Admin Stats
router.get('/admin/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const todayCount = await MindCanvasImage.countDocuments({ date: { $gte: today } });
        const weekCount = await MindCanvasImage.countDocuments({ date: { $gte: weekAgo } });
        const monthCount = await MindCanvasImage.countDocuments({ date: { $gte: monthAgo } });
        const totalCount = await MindCanvasImage.countDocuments();

        res.json({
            today: todayCount,
            week: weekCount,
            month: monthCount,
            total: totalCount
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// Update System Settings (Admin)
router.post('/admin/settings', async (req, res) => {
    try {
        const { dailyLimit, stylesEnabled, unsafePromptsDisabled } = req.body;
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }

        if (dailyLimit !== undefined) settings.mindCanvasDailyLimit = dailyLimit;
        // Add other settings as needed to SystemSettings model

        await settings.save();
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error updating settings' });
    }
});

module.exports = router;
