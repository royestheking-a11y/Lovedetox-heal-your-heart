const express = require('express');
const router = express.Router();
const MindCanvasImage = require('../models/MindCanvasImage');
const User = require('../models/User'); // Assuming you have a User model
const SystemSettings = require('../models/SystemSettings'); // Assuming you have SystemSettings

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

        // Construct Pollinations.ai URL
        // Pollinations.ai format: https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&seed={seed}&nologo=true
        const encodedPrompt = encodeURIComponent(`${prompt} ${style || ''}`);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true`;

        // Save metadata to database
        const newImage = new MindCanvasImage({
            user_id,
            text_note: prompt,
            image_url: imageUrl,
            is_pro_generated: is_pro || false,
            style: style || 'default'
        });

        await newImage.save();

        res.json({
            success: true,
            imageUrl: imageUrl,
            imageId: newImage._id
        });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: 'Server error generating image' });
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
