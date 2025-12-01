const mongoose = require('mongoose');

const successStorySchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: String },
    occupation: { type: String },
    gender: { type: String, enum: ['male', 'female'], required: true },
    role: { type: String },
    relationshipDuration: { type: String },
    timeSinceBreakup: { type: String },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedBy: { type: String }, // Optional: name or ID of submitter
}, {
    timestamps: true
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
