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
                { title: "Heavy Rain", category: "nature", url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", isPremium: false, duration: "10:00", imageUrl: "" },
                { title: "Ocean Waves", category: "anxiety", url: "https://actions.google.com/sounds/v1/water/waves_crashing.ogg", isPremium: false, duration: "15:00", imageUrl: "" }
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