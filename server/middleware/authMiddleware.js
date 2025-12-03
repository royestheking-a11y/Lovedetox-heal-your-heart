const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Check for expiration (Trial or Monthly)
            const now = new Date();
            let expired = false;

            if (req.user.plan === 'PRO_TRIAL' && req.user.trialEndDate && now > req.user.trialEndDate) {
                expired = true;
            } else if (req.user.plan === 'PRO_MONTHLY' && req.user.subscriptionEndDate && now > req.user.subscriptionEndDate) {
                expired = true;
            }

            if (expired) {
                console.log(`User ${req.user.email} subscription expired. Downgrading to FREE.`);
                req.user.isPro = false;
                req.user.plan = 'FREE';
                req.user.trialEndDate = undefined;
                req.user.subscriptionEndDate = undefined;
                await req.user.save();
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
