const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Start 30-Day Pro Trial
// @route   POST /api/payments/start-trial
// @access  Private
router.post('/start-trial', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.plan !== 'FREE') {
            return res.status(400).json({ message: 'Trial already used or active subscription found' });
        }

        // Check if user ever had a trial (optional: strict check)
        // For now, we assume if plan is FREE, they can start trial if they haven't before.
        // But if they cancelled, they might be FREE again. 
        // Let's add a flag 'hasUsedTrial' to User model if needed, or just check if trialStartDate exists.
        if (user.trialStartDate) {
            return res.status(400).json({ message: 'You have already used your free trial.' });
        }

        user.plan = 'PRO_TRIAL';
        user.isPro = true;
        user.trialStartDate = new Date();
        user.trialEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await user.save();

        res.json({
            message: '30-Day Pro Trial Activated!',
            plan: user.plan,
            trialEndDate: user.trialEndDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Submit Manual Payment
// @route   POST /api/payments/submit
// @access  Private
router.post('/submit', protect, async (req, res) => {
    const { transactionId, method, amount, planType } = req.body; // planType: 'PRO_MONTHLY' or 'PRO_LIFETIME'

    const Payment = require('../models/Payment'); // Import Payment model

    // ... (inside route)
    try {
        console.log('Payment Submit Request:', req.body); // Log request body
        const user = await User.findById(req.user._id);

        if (!user) {
            console.error('User not found for payment submission');
            return res.status(404).json({ message: 'User not found' });
        }

        // Create Payment Document
        const payment = await Payment.create({
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            transactionId,
            method,
            amount,
            planType,
            status: 'pending',
            date: new Date()
        });

        // Also save to user history (optional, but good for redundancy)
        user.paymentHistory.push({
            transactionId,
            method,
            amount,
            type: 'subscription',
            planType,
            status: 'pending',
            date: new Date()
        });
        await user.save();

        res.json({ message: 'Payment submitted for review. Admin will approve shortly.' });
    } catch (error) {
        console.error('Payment Submission Error:', error); // Log full error
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});

// @desc    Request Refund/Cancellation
// @route   POST /api/payments/cancel
// @access  Private
router.post('/cancel', protect, async (req, res) => {
    const { refundNumber, method, reason } = req.body;

    try {
        const user = await User.findById(req.user._id);

        // Find the last approved subscription payment
        // In a real app, we'd link to specific transaction. Here we just create a refund request.

        const refundRequest = {
            transactionId: `REF-${Date.now()}`,
            method,
            amount: 0, // Admin will decide amount or fetch from history
            type: 'refund',
            status: 'pending',
            refundNumber,
            date: new Date()
        };

        user.paymentHistory.push(refundRequest);
        await user.save();

        res.json({ message: 'Cancellation request submitted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get All Payment Requests (Admin)
// @route   GET /api/payments/admin/requests
// @access  Private/Admin
router.get('/admin/requests', protect, admin, async (req, res) => {
    try {
        // Find users with pending payments
        const users = await User.find({ 'paymentHistory.status': 'pending' }).select('name email paymentHistory');

        let requests = [];
        users.forEach(user => {
            user.paymentHistory.forEach(payment => {
                if (payment.status === 'pending') {
                    requests.push({
                        userId: user._id,
                        userName: user.name,
                        userEmail: user.email,
                        ...payment.toObject()
                    });
                }
            });
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Approve Payment
// @route   POST /api/payments/admin/approve
// @access  Private/Admin
router.post('/admin/approve', protect, admin, async (req, res) => {
    const { userId, paymentId, planType } = req.body; // planType needed to set user plan

    try {
        const user = await User.findById(userId);
        const payment = user.paymentHistory.id(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = 'approved';

        if (payment.type === 'subscription') {
            user.isPro = true;
            user.plan = payment.planType || planType || 'PRO_MONTHLY'; // Use saved planType first
            // Reset trial dates if moving to paid
            user.trialStartDate = undefined;
            user.trialEndDate = undefined;
        }

        await user.save();

        // Sync with Payment collection
        const paymentDoc = await Payment.findOne({ transactionId: payment.transactionId });
        if (paymentDoc) {
            paymentDoc.status = 'completed';
            await paymentDoc.save();
        }

        res.json({ message: 'Payment approved and user upgraded.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Reject Payment
// @route   POST /api/payments/admin/reject
// @access  Private/Admin
router.post('/admin/reject', protect, admin, async (req, res) => {
    const { userId, paymentId } = req.body;

    try {
        const user = await User.findById(userId);
        const payment = user.paymentHistory.id(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = 'rejected';
        await user.save();

        // Sync with Payment collection
        const paymentDoc = await Payment.findOne({ transactionId: payment.transactionId });
        if (paymentDoc) {
            paymentDoc.status = 'failed';
            await paymentDoc.save();
        }

        res.json({ message: 'Payment rejected.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Confirm Refund
// @route   POST /api/payments/admin/refund
// @access  Private/Admin
router.post('/admin/refund', protect, admin, async (req, res) => {
    const { userId, paymentId } = req.body;

    try {
        const user = await User.findById(userId);
        const payment = user.paymentHistory.id(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment request not found' });
        }

        payment.status = 'refunded';

        // Downgrade user
        user.isPro = false;
        user.plan = 'FREE';

        await user.save();

        // Sync with Payment collection
        // For refunds, we might be refunding a specific transaction or a refund request
        // If it's a refund request, it might have a transactionId or refundNumber
        const identifier = payment.transactionId || payment.refundNumber;
        const paymentDoc = await Payment.findOne({ transactionId: identifier });
        if (paymentDoc) {
            paymentDoc.status = 'refunded';
            await paymentDoc.save();
        }

        res.json({ message: 'Refund confirmed and user downgraded.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
