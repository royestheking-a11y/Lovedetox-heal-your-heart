const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    isPro: { type: Boolean, default: false },
    profileImage: { type: String },
    phase: { type: String, default: 'Detox Phase: No-Contact' },
    noContactDays: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    recoveryProgress: { type: Number, default: 0 },
    googleId: { type: String },
}, {
    timestamps: true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
