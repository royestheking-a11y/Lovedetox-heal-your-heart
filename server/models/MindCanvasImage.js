const mongoose = require('mongoose');

const mindCanvasImageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text_note: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    is_public: {
        type: Boolean,
        default: false
    },
    is_pro_generated: {
        type: Boolean,
        default: false
    },
    style: {
        type: String,
        default: 'default'
    }
});

module.exports = mongoose.model('MindCanvasImage', mindCanvasImageSchema);
