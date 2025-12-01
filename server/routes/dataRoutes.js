const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// --- TASKS ---
router.get('/tasks', protect, async (req, res) => {
    const tasks = await Task.find({ userId: req.user._id });
    res.json(tasks);
});

router.post('/tasks', protect, async (req, res) => {
    const { title, description, timeEstimate, date, completed } = req.body;
    const task = new Task({
        userId: req.user._id,
        title,
        description,
        timeEstimate,
        date,
        completed
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
});

router.put('/tasks/:id', protect, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task && task.userId.toString() === req.user._id.toString()) {
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.timeEstimate = req.body.timeEstimate || task.timeEstimate;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// --- MOODS ---
router.get('/moods', protect, async (req, res) => {
    const moods = await Mood.find({ userId: req.user._id });
    res.json(moods);
});

router.post('/moods', protect, async (req, res) => {
    const { emotion, intensity, note, date } = req.body;
    const mood = new Mood({
        userId: req.user._id,
        emotion,
        intensity,
        note,
        date
    });
    const createdMood = await mood.save();
    res.status(201).json(createdMood);
});

// --- JOURNAL ---
router.get('/journal', protect, async (req, res) => {
    const entries = await Journal.find({ userId: req.user._id });
    res.json(entries);
});

router.post('/journal', protect, async (req, res) => {
    const { title, content, mood, date } = req.body;
    const journal = new Journal({
        userId: req.user._id,
        title,
        content,
        mood,
        date
    });
    const createdJournal = await journal.save();
    res.status(201).json(createdJournal);
});

router.delete('/journal/:id', protect, async (req, res) => {
    const entry = await Journal.findById(req.params.id);
    if (entry && entry.userId.toString() === req.user._id.toString()) {
        await entry.deleteOne();
        res.json({ message: 'Entry removed' });
    } else {
        res.status(404).json({ message: 'Entry not found' });
    }
});

// --- CHAT ---
router.get('/chat', protect, async (req, res) => {
    const chat = await Chat.findOne({ userId: req.user._id });
    res.json(chat ? chat.messages : []);
});

router.post('/chat', protect, async (req, res) => {
    try {
        const { role, content } = req.body;
        // console.log(`Saving chat message for user ${req.user._id}: ${role}`);

        const chat = await Chat.findOneAndUpdate(
            { userId: req.user._id },
            { $push: { messages: { role, content } } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(chat.messages);
    } catch (error) {
        console.error('Error in POST /chat:', error);
        res.status(500).json({ message: 'Server error saving chat', error: error.message });
    }
});

// --- NOTIFICATIONS ---
router.get('/notifications', protect, async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json(notifications);
});

router.post('/notifications', protect, async (req, res) => {
    const { type, title, message, timestamp } = req.body;
    const notification = new Notification({
        userId: req.user._id,
        type,
        title,
        message,
        timestamp
    });
    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
});

router.put('/notifications/:id/read', protect, async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification && notification.userId.toString() === req.user._id.toString()) {
        notification.read = true;
        await notification.save();
        res.json(notification);
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
});

router.delete('/notifications/:id', protect, async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification && notification.userId.toString() === req.user._id.toString()) {
        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
});

// --- SUPPORT MESSAGES (Public) ---
router.post('/support', async (req, res) => {
    const { name, email, message } = req.body;
    const SupportMessage = require('../models/SupportMessage');
    const supportMessage = new SupportMessage({ name, email, message });
    const createdMessage = await supportMessage.save();
    res.status(201).json(createdMessage);
});

// --- SUCCESS STORIES (Public) ---
router.get('/success-stories', async (req, res) => {
    const SuccessStory = require('../models/SuccessStory');
    const stories = await SuccessStory.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(stories);
});

router.post('/success-stories', protect, async (req, res) => {
    const { name, age, occupation, gender, role, text, rating, relationshipDuration, timeSinceBreakup } = req.body;
    const SuccessStory = require('../models/SuccessStory');
    const story = new SuccessStory({
        name: req.user.name, // Use authenticated user's name
        age,
        occupation,
        gender,
        role,
        text,
        rating,
        relationshipDuration,
        timeSinceBreakup,
        submittedBy: req.user.name
    });
    const createdStory = await story.save();
    res.status(201).json(createdStory);
});

// --- NO CONTACT MESSAGES ---
router.get('/no-contact', protect, async (req, res) => {
    const NoContactMessage = require('../models/NoContactMessage');
    const messages = await NoContactMessage.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
});

router.post('/no-contact', protect, async (req, res) => {
    const { message, exName, sentiment } = req.body;
    const NoContactMessage = require('../models/NoContactMessage');
    const newMessage = new NoContactMessage({
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        exName,
        message,
        sentiment: sentiment || 'neutral'
    });
    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
});

// --- COMMUNITY ---
router.get('/community', protect, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const posts = await CommunityPost.find({}).sort({ createdAt: -1 });
    res.json(posts);
});

router.post('/community', protect, async (req, res) => {
    const { content } = req.body;
    const CommunityPost = require('../models/CommunityPost');
    const post = new CommunityPost({
        userId: req.user._id,
        userName: req.user.name, // In a real app, might want anonymous or alias
        content
    });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
});

router.put('/community/:id/like', protect, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const post = await CommunityPost.findById(req.params.id);

    if (post) {
        if (post.likedBy.includes(req.user._id)) {
            post.likes--;
            post.likedBy = post.likedBy.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes++;
            post.likedBy.push(req.user._id);
        }
        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

router.post('/community/:id/report', protect, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const post = await CommunityPost.findById(req.params.id);

    if (post) {
        post.reported = true;
        await post.save();
        res.json({ message: 'Post reported' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

router.delete('/community/:id', protect, async (req, res) => {
    const CommunityPost = require('../models/CommunityPost');
    const post = await CommunityPost.findById(req.params.id);

    if (post && post.userId.toString() === req.user._id.toString()) {
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } else {
        res.status(404).json({ message: 'Post not found or unauthorized' });
    }
});

// --- MIGRATION ---
router.post('/migrate', protect, async (req, res) => {
    const { tasks, moods, journal, chat, notifications } = req.body;

    if (tasks && tasks.length > 0) {
        const taskDocs = tasks.map(t => ({ ...t, userId: req.user._id }));
        await Task.insertMany(taskDocs);
    }

    if (moods && moods.length > 0) {
        const moodDocs = moods.map(m => ({ ...m, userId: req.user._id }));
        await Mood.insertMany(moodDocs);
    }

    if (journal && journal.length > 0) {
        const journalDocs = journal.map(j => ({ ...j, userId: req.user._id }));
        await Journal.insertMany(journalDocs);
    }

    if (chat && chat.length > 0) {
        // Chat is a single document per user with messages array
        let chatDoc = await Chat.findOne({ userId: req.user._id });
        if (!chatDoc) {
            chatDoc = new Chat({ userId: req.user._id, messages: [] });
        }
        // Append new messages
        chatDoc.messages.push(...chat);
        await chatDoc.save();
    }

    if (notifications && notifications.length > 0) {
        const notifDocs = notifications.map(n => ({ ...n, userId: req.user._id }));
        await Notification.insertMany(notifDocs);
    }

    res.json({ message: 'Data migrated successfully' });
});

module.exports = router;
