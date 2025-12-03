const mongoose = require('mongoose');
const SoundTrack = require('./models/SoundTrack');

const URI = 'mongodb+srv://lovedetoxorg_db_user:VkdK98MB5X45TfyB@lovedetox.ihwfmw7.mongodb.net/?appName=lovedetox';

async function diagnose() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(URI);
        console.log('Connected!');

        console.log('Checking SoundTrack collection...');
        const count = await SoundTrack.countDocuments();
        console.log(`Found ${count} sound tracks.`);

        if (count === 0) {
            console.log('Seeding default tracks...');
            const initialSounds = [
                {
                    title: 'Heavy Rain',
                    category: 'nature',
                    url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
                    isPremium: false,
                    duration: '10:00',
                    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80'
                },
                {
                    title: 'Ocean Waves',
                    category: 'anxiety',
                    url: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg',
                    isPremium: false,
                    duration: '15:00',
                    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80'
                },
                {
                    title: 'Morning Forest',
                    category: 'nature',
                    url: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg',
                    isPremium: true,
                    duration: '08:00',
                    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80'
                },
                {
                    title: 'Calm White Noise',
                    category: 'focus',
                    url: 'https://actions.google.com/sounds/v1/ambiences/humming_fan.ogg',
                    isPremium: false,
                    duration: '30:00',
                    imageUrl: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&q=80'
                },
                {
                    title: 'Night Ambience',
                    category: 'sleep',
                    url: 'https://actions.google.com/sounds/v1/nature/crickets_chirping.ogg',
                    isPremium: true,
                    duration: '20:00',
                    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'
                },
                {
                    title: 'Gentle Stream',
                    category: 'relax',
                    url: 'https://actions.google.com/sounds/v1/water/stream_water.ogg',
                    isPremium: false,
                    duration: '12:00',
                    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80'
                }
            ];
            await SoundTrack.insertMany(initialSounds);
            console.log('Seeding complete!');
        } else {
            console.log('Collection already has data.');
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

    } catch (error) {
        console.error('Diagnostic failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

diagnose();
