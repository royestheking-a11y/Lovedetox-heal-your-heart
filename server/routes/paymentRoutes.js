const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new payment record
// @route   POST /api/payments
// @access  Private
router.post('/', protect, async (req, res) => {
    const { amount, plan, status } = req.body;

    const payment = new Payment({
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        amount,
        plan,
        status: status || 'completed'
    });

    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
});

// @desc    Get all payments (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    const payments = await Payment.find({}).populate('userId', 'email').sort({ createdAt: -1 });

    // Map payments to include email if missing (for backward compatibility)
    const formattedPayments = payments.map(payment => ({
        ...payment._doc,
        userEmail: payment.userEmail || (payment.userId ? payment.userId.email : 'Unknown')
    }));

    res.json(formattedPayments);
});

module.exports = router;
