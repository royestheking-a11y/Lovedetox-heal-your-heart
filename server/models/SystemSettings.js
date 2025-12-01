const mongoose = require('mongoose');

const systemSettingsSchema = mongoose.Schema({
    siteName: { type: String, default: 'LoveDetox' },
    supportEmail: { type: String, default: 'support@lovedetox.com' },
    freeMessageLimit: { type: Number, default: 10 },
    proPrice: { type: Number, default: 19 },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
