const mongoose = require('mongoose');

const globalTaskSchema = mongoose.Schema({
    title: { type: String, required: true },
    phase: { type: String, required: true },
    timeEstimate: { type: String, required: true },
    active: { type: Boolean, default: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('GlobalTask', globalTaskSchema);
