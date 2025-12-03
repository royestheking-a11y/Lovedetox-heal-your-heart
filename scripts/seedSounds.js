const mongoose = require('mongoose');
const SoundTrack = require('../server/models/SoundTrack');

const MONGO_URI = 'mongodb+srv://lovedetoxorg_db_user:VkdK98MB5X45TfyB@lovedetox.ihwfmw7.mongodb.net/?appName=lovedetox';

const seedSounds = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const soundCount = await SoundTrack.countDocuments();
        console.log(`Current sound count: ${soundCount}`);

        if (soundCount === 0) {
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
            console.log('Successfully seeded SoundTrack collection!');
        } else {
            console.log('SoundTrack collection already has data.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedSounds();
