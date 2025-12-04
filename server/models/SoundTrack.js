const mongoose = require('mongoose');

const soundTrackSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['sleep', 'focus', 'anxiety', 'nature', 'relax', 'rain', 'water']
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    duration: {
        type: String, // e.g., "10:00"
        default: "Unknown"
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SoundTrack', soundTrackSchema);
