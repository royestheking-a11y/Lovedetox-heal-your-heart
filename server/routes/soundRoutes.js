const express = require('express');
const router = express.Router();
const SoundTrack = require('../models/SoundTrack');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all sound tracks
// @route   GET /api/sounds
// @access  Public/User
router.get('/', async (req, res) => {
    try {
        const sounds = await SoundTrack.find({}).sort({ createdAt: -1 });
        res.json(sounds);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a sound track
// @route   POST /api/sounds
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, url, category, isPremium, duration, imageUrl } = req.body;

        const sound = new SoundTrack({
            title,
            url,
            category,
            isPremium,
            duration,
            imageUrl
        });

        const createdSound = await sound.save();
        res.status(201).json(createdSound);
    } catch (error) {
        res.status(400).json({ message: 'Invalid sound data', error: error.message });
    }
});

// @desc    Update a sound track
// @route   PUT /api/sounds/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const sound = await SoundTrack.findById(req.params.id);

        if (sound) {
            sound.title = req.body.title || sound.title;
            sound.url = req.body.url || sound.url;
            sound.category = req.body.category || sound.category;
            sound.isPremium = req.body.isPremium !== undefined ? req.body.isPremium : sound.isPremium;
            sound.duration = req.body.duration || sound.duration;
            sound.imageUrl = req.body.imageUrl || sound.imageUrl;

            const updatedSound = await sound.save();
            res.json(updatedSound);
        } else {
            res.status(404).json({ message: 'Sound track not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a sound track
// @route   DELETE /api/sounds/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const sound = await SoundTrack.findById(req.params.id);

        if (sound) {
            await sound.deleteOne();
            res.json({ message: 'Sound track removed' });
        } else {
            res.status(404).json({ message: 'Sound track not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
