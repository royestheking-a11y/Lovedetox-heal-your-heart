const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    transactionId: { type: String, required: true },
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    plan: { type: String, default: 'Pro' },
    planType: { type: String }, // 'PRO_MONTHLY' or 'PRO_LIFETIME'
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
