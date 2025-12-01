const mongoose = require('mongoose');

const moodSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emotion: { type: String, required: true },
    intensity: { type: Number, required: true },
    note: { type: String },
    date: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mood', moodSchema);
