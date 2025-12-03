const mongoose = require('mongoose');
const URI = 'mongodb+srv://lovedetoxorg_db_user:VkdK98MB5X45TfyB@lovedetox.ihwfmw7.mongodb.net/?appName=lovedetox';

async function forceSeed() {
    try {
        console.log('Connecting...');
        await mongoose.connect(URI);
        const db = mongoose.connection.useDb('test');
        console.log('Switched to test db');

        const soundTrackSchema = new mongoose.Schema({
            title: String, url: String, category: String, isPremium: Boolean, duration: String, imageUrl: String
        }, { timestamps: true, collection: 'soundtracks' });

        const SoundTrack = db.model('SoundTrack', soundTrackSchema);
        const count = await SoundTrack.countDocuments();
        console.log('Current count:', count);

        if (count === 0) {
            console.log('Seeding...');
            await SoundTrack.insertMany([
                { title: "Heavy Rain", category: "nature", url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", isPremium: false, duration: "10:00", imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80" },
                { title: "Ocean Waves", category: "anxiety", url: "https://actions.google.com/sounds/v1/water/waves_crashing.ogg", isPremium: false, duration: "15:00", imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80" },
                { title: "Morning Forest", category: "nature", url: "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg", isPremium: true, duration: "08:00", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80" },
                { title: "Calm White Noise", category: "focus", url: "https://actions.google.com/sounds/v1/ambiences/humming_fan.ogg", isPremium: false, duration: "30:00", imageUrl: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&q=80" },
                { title: "Night Ambience", category: "sleep", url: "https://actions.google.com/sounds/v1/nature/crickets_chirping.ogg", isPremium: true, duration: "20:00", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
                { title: "Gentle Stream", category: "relax", url: "https://actions.google.com/sounds/v1/water/stream_water.ogg", isPremium: false, duration: "12:00", imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80" }
            ]);
            console.log('Seeded successfully.');
        } else {
            console.log('Collection already exists and has data.');
        }

        const collections = await db.db.listCollections().toArray();
        console.log('ALL COLLECTIONS:', collections.map(c => c.name).join(', '));

    } catch (e) { console.error(e); } finally { await mongoose.disconnect(); }
}
forceSeed();
