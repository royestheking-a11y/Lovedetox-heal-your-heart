const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    timeEstimate: { type: String },
    completed: { type: Boolean, default: false },
    date: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
