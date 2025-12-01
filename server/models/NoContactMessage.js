const mongoose = require('mongoose');

const noContactMessageSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    exName: { type: String },
    message: { type: String, required: true },
    sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' }
}, {
    timestamps: true
});

module.exports = mongoose.model('NoContactMessage', noContactMessageSchema);
