const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isPro: user.isPro,
            plan: user.plan,
            trialStartDate: user.trialStartDate,
            trialEndDate: user.trialEndDate,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isPro: user.isPro,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Google auth
// @route   POST /api/auth/google
// @desc    Google auth
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        // Verify token with Google
        const axios = require('axios');
        const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { email, name, sub: googleId, picture } = googleResponse.data;

        // Optimize: Use findOneAndUpdate to handle both create and update in one operation
        // This bypasses the 'save' hook (password hashing) which is unnecessary here
        const user = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    name,
                    email,
                    googleId,
                    profileImage: picture,
                },
                $setOnInsert: {
                    isAdmin: false,
                    isPro: false,
                    password: '' // No password for Google users
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isPro: user.isPro,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Auth Error:', error.response?.data || error.message);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

module.exports = router;
