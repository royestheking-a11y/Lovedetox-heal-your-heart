const mongoose = require('mongoose');

const journalSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    content: { type: String, required: true },
    mood: { type: String },
    date: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Journal', journalSchema);
