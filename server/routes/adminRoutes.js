const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SystemSettings = require('../models/SystemSettings');
const { protect, admin } = require('../middleware/authMiddleware');

const SupportMessage = require('../models/SupportMessage');
const GlobalTask = require('../models/GlobalTask');
const SuccessStory = require('../models/SuccessStory');
const Payment = require('../models/Payment');
const Task = require('../models/Task');
const Mood = require('../models/Mood');
const Chat = require('../models/Chat');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const proUsers = await User.countDocuments({ isPro: true, isAdmin: false });
    const freeUsers = totalUsers - proUsers;

    // Active users (logged in last 7 days) - approximation using createdAt or updatedAt if available
    // For now, let's use updatedAt > 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({ isAdmin: false, updatedAt: { $gt: sevenDaysAgo } });

    // Revenue
    // Calculate total revenue from Payments collection
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // Monthly Revenue (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyPayments = payments.filter(p => new Date(p.date) >= startOfMonth);
    const monthlyRevenue = monthlyPayments.reduce((acc, curr) => acc + curr.amount, 0);

    // Engagement Stats
    const tasksCompleted = await Task.countDocuments({ completed: true });
    const moodEntries = await Mood.countDocuments({});

    // AI Usage
    const chats = await Chat.find({});
    let totalMessages = 0;
    chats.forEach(chat => {
        totalMessages += chat.messages.length;
    });
    const aiUsageRate = totalUsers > 0 ? Math.round((totalMessages / totalUsers) * 100) / 100 : 0;

    res.json({
        totalUsers,
        activeUsers,
        freeUsers,
        proUsers,
        revenueToday: monthlyRevenue, // Using monthly revenue as "revenue today" placeholder or just revenue
        totalRevenue,
        aiUsageRate,
        tasksCompleted,
        moodEntries
    });
});

// --- USERS ---
// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

router.put('/users/:id', protect, admin, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.isPro = req.body.isPro !== undefined ? req.body.isPro : user.isPro;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
        // user.suspended = req.body.suspended !== undefined ? req.body.suspended : user.suspended; // Add suspended field to User model if needed

        // Reset progress logic if requested
        if (req.body.resetProgress) {
            user.noContactDays = 0;
            user.streak = 0;
            user.recoveryProgress = 0;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.delete('/users/:id', protect, admin, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// --- SUPPORT MESSAGES ---
router.get('/support', protect, admin, async (req, res) => {
    const messages = await SupportMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

router.put('/support/:id', protect, admin, async (req, res) => {
    const message = await SupportMessage.findById(req.params.id);
    if (message) {
        message.status = req.body.status || message.status;
        const updatedMessage = await message.save();
        res.json(updatedMessage);
    } else {
        res.status(404).json({ message: 'Message not found' });
    }
});

router.delete('/support/:id', protect, admin, async (req, res) => {
    const message = await SupportMessage.findById(req.params.id);
    if (message) {
        await message.deleteOne();
        res.json({ message: 'Message removed' });
    } else {
        res.status(404).json({ message: 'Message not found' });
    }
});

// --- GLOBAL TASKS ---
router.get('/global-tasks', protect, admin, async (req, res) => {
    const tasks = await GlobalTask.find({});
    res.json(tasks);
});

router.post('/global-tasks', protect, admin, async (req, res) => {
    const { title, phase, timeEstimate, active } = req.body;
    const task = new GlobalTask({ title, phase, timeEstimate, active });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
});

router.put('/global-tasks/:id', protect, admin, async (req, res) => {
    const task = await GlobalTask.findById(req.params.id);
    if (task) {
        task.title = req.body.title || task.title;
        task.phase = req.body.phase || task.phase;
        task.timeEstimate = req.body.timeEstimate || task.timeEstimate;
        task.active = req.body.active !== undefined ? req.body.active : task.active;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

router.delete('/global-tasks/:id', protect, admin, async (req, res) => {
    const task = await GlobalTask.findById(req.params.id);
    if (task) {
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// --- SUCCESS STORIES ---
router.get('/success-stories', protect, admin, async (req, res) => {
    const stories = await SuccessStory.find({}).sort({ createdAt: -1 });
    res.json(stories);
});

router.put('/success-stories/:id', protect, admin, async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (story) {
        story.status = req.body.status || story.status;
        const updatedStory = await story.save();
        res.json(updatedStory);
    } else {
        res.status(404).json({ message: 'Story not found' });
    }
});

router.delete('/success-stories/:id', protect, admin, async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (story) {
        await story.deleteOne();
        res.json({ message: 'Story removed' });
    } else {
        res.status(404).json({ message: 'Story not found' });
    }
});

// --- ACHIEVEMENTS ---
router.get('/achievements', protect, admin, async (req, res) => {
    const users = await User.find({ isAdmin: false });
    const data = [];

    for (const user of users) {
        const tasks = await Task.find({ userId: user._id });
        const moods = await Mood.find({ userId: user._id }).sort({ createdAt: -1 });
        const journals = await Journal.find({ userId: user._id });
        // const communityPosts = await CommunityPost.find({ authorId: user._id }); // Assuming CommunityPost model exists or skipping for now

        const completedTasks = tasks.filter(t => t.completed).length;

        // Calculate streak
        let streak = 0;
        if (moods.length > 0) {
            streak = 1;
            let currentDate = new Date(moods[0].createdAt);
            currentDate.setHours(0, 0, 0, 0);

            for (let i = 1; i < moods.length; i++) {
                const moodDate = new Date(moods[i].createdAt);
                moodDate.setHours(0, 0, 0, 0);
                const dayDiff = Math.floor((currentDate.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    streak++;
                    currentDate = moodDate;
                } else if (dayDiff > 1) {
                    break;
                }
            }
        }

        // Calculate achievements
        const achievementsList = [
            completedTasks >= 1,
            completedTasks >= 10,
            completedTasks >= 50,
            streak >= 3,
            streak >= 7,
            streak >= 30,
            journals.length >= 5,
            // communityPosts.length >= 10
        ];

        const unlocked = achievementsList.filter(a => a).length;
        const total = achievementsList.length;

        data.push({
            email: user.email,
            name: user.name,
            totalAchievements: total,
            unlockedAchievements: unlocked,
            totalPoints: unlocked * 100,
            currentStreak: streak,
            completionRate: Math.round((unlocked / total) * 100),
            lastActivity: moods.length > 0 ? moods[0].createdAt : user.createdAt
        });
    }

    res.json(data);
});

// @desc    Get system settings
// @route   GET /api/admin/settings
router.get('/settings', async (req, res) => {
    const settings = await SystemSettings.findOne();
    if (settings) {
        res.json(settings);
    } else {
        // Return default settings if none exist
        res.json({
            siteName: 'LoveDetox',
            supportEmail: 'support@lovedetox.com',
            freeMessageLimit: 10,
            proPrice: 19,
            maintenanceMode: false,
            allowRegistration: true,
            socialLinks: {
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: ''
            }
        });
    }
});

// @desc    Update system settings
// @route   PUT /api/admin/settings
router.put('/settings', protect, admin, async (req, res) => {
    let settings = await SystemSettings.findOne();

    if (settings) {
        settings.siteName = req.body.siteName || settings.siteName;
        settings.supportEmail = req.body.supportEmail || settings.supportEmail;
        settings.freeMessageLimit = req.body.freeMessageLimit !== undefined ? req.body.freeMessageLimit : settings.freeMessageLimit;
        settings.proPrice = req.body.proPrice !== undefined ? req.body.proPrice : settings.proPrice;
        settings.maintenanceMode = req.body.maintenanceMode !== undefined ? req.body.maintenanceMode : settings.maintenanceMode;
        settings.allowRegistration = req.body.allowRegistration !== undefined ? req.body.allowRegistration : settings.allowRegistration;
        settings.socialLinks = req.body.socialLinks || settings.socialLinks;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = new SystemSettings(req.body);
        const createdSettings = await newSettings.save();
        res.json(createdSettings);
    }
});

// @desc    Get all users with mood data and risk analysis
// @route   GET /api/admin/mood-risks
router.get('/mood-risks', protect, admin, async (req, res) => {
    const users = await User.find({ isAdmin: false });
    const userMoods = [];

    for (const user of users) {
        const moods = await Mood.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);

        if (moods.length === 0) continue;

        // Calculate Risk Level
        let riskLevel = 'low';

        // Count negative emotions with high intensity
        const highRiskCount = moods.filter(m =>
            ['Sad', 'Anxious', 'Angry', 'Lonely'].includes(m.emotion) && m.intensity >= 8
        ).length;

        const moderateRiskCount = moods.filter(m =>
            ['Sad', 'Anxious', 'Angry', 'Lonely'].includes(m.emotion) && m.intensity >= 5
        ).length;

        if (highRiskCount >= 3) {
            riskLevel = 'high';
        } else if (moderateRiskCount >= 3 || highRiskCount >= 1) {
            riskLevel = 'moderate';
        }

        userMoods.push({
            id: user._id,
            name: user.name,
            email: user.email,
            riskLevel,
            recentMood: moods[0],
            moodHistory: moods // Optional: send last 5 moods for detail view
        });
    }

    // Sort by risk level: High > Moderate > Low
    userMoods.sort((a, b) => {
        const riskOrder = { high: 3, moderate: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    });

    res.json(userMoods);
});

// @desc    Get all no-contact messages
// @route   GET /api/admin/no-contact
router.get('/no-contact', protect, admin, async (req, res) => {
    const NoContactMessage = require('../models/NoContactMessage');
    const messages = await NoContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

// @desc    Get all community posts
// @route   GET /api/admin/community
router.get('/community', protect, admin, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const posts = await CommunityPost.find({}).sort({ createdAt: -1 });
    res.json(posts);
});

// @desc    Delete community post (admin)
// @route   DELETE /api/admin/community/:id
router.delete('/community/:id', protect, admin, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const post = await CommunityPost.findById(req.params.id);
    if (post) {
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// @desc    Clear report on community post
// @route   PUT /api/admin/community/:id/clear-report
router.put('/community/:id/clear-report', protect, admin, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const post = await CommunityPost.findById(req.params.id);
    if (post) {
        post.reported = false;
        await post.save();
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

module.exports = router;
