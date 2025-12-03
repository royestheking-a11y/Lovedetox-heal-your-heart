const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isPro: user.isPro,
            plan: user.plan,
            trialStartDate: user.trialStartDate,
            trialEndDate: user.trialEndDate,
            phase: user.phase,
            noContactDays: user.noContactDays,
            streak: user.streak,
            recoveryProgress: user.recoveryProgress,
            hasSeenTutorial: user.hasSeenTutorial,
            profileImage: user.profileImage,
            breakupDate: user.breakupDate,
            noContactStartDate: user.noContactStartDate,
            relapseCount: user.relapseCount,
            relapseHistory: user.relapseHistory,
            noContactActive: user.noContactActive,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.profileImage = req.body.profileImage || user.profileImage;
        user.phase = req.body.phase || user.phase;
        user.noContactDays = req.body.noContactDays !== undefined ? req.body.noContactDays : user.noContactDays;
        user.streak = req.body.streak !== undefined ? req.body.streak : user.streak;
        user.recoveryProgress = req.body.recoveryProgress !== undefined ? req.body.recoveryProgress : user.recoveryProgress;
        user.isPro = req.body.isPro !== undefined ? req.body.isPro : user.isPro;
        user.hasSeenTutorial = req.body.hasSeenTutorial !== undefined ? req.body.hasSeenTutorial : user.hasSeenTutorial;

        // No Contact Healing Engine
        if (req.body.breakupDate) user.breakupDate = req.body.breakupDate;
        if (req.body.noContactStartDate) user.noContactStartDate = req.body.noContactStartDate;
        if (req.body.relapseCount !== undefined) user.relapseCount = req.body.relapseCount;
        if (req.body.relapseHistory) user.relapseHistory = req.body.relapseHistory;
        if (req.body.noContactActive !== undefined) user.noContactActive = req.body.noContactActive;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isPro: updatedUser.isPro,
            plan: updatedUser.plan,
            trialStartDate: updatedUser.trialStartDate,
            trialEndDate: updatedUser.trialEndDate,
            phase: updatedUser.phase,
            noContactDays: updatedUser.noContactDays,
            streak: updatedUser.streak,
            recoveryProgress: updatedUser.recoveryProgress,
            hasSeenTutorial: updatedUser.hasSeenTutorial,
            profileImage: updatedUser.profileImage,
            breakupDate: updatedUser.breakupDate,
            noContactStartDate: updatedUser.noContactStartDate,
            relapseCount: updatedUser.relapseCount,
            relapseHistory: updatedUser.relapseHistory,
            noContactActive: updatedUser.noContactActive,
            token: req.headers.authorization.split(' ')[1], // Return existing token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
router.delete('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
