const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// connectDB(); // Moved to entry point for better control

const User = require('./models/User');
const Task = require('./models/Task');
const Mood = require('./models/Mood');
const Journal = require('./models/Journal');
const SoundTrack = require('./models/SoundTrack');

const seedData = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@lovedetox.com' });
        let adminId;

        if (!adminExists) {
            const adminUser = await User.create({
                name: 'Admin',
                email: 'admin@lovedetox.com',
                password: 'lovedetox009',
                isAdmin: true,
                isPro: true
            });
            adminId = adminUser._id;
            console.log('Admin user created');
        } else {
            adminId = adminExists._id;
        }

        // Check if sounds exist
        const soundCount = await SoundTrack.countDocuments();

        if (soundCount === 0) {
            console.log('>>> SEEDING SOUND THERAPY DATA...');
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
            console.log('>>> SOUNDS SEEDED SUCCESSFULLY.');
        } else {
            console.log('Sound data already exists.');
        }


        // Seed Tasks
        const taskCount = await Task.countDocuments();
        if (taskCount === 0 && adminId) {
            await Task.create([
                { userId: adminId, title: 'Morning Meditation', description: '10 mins of mindfulness', timeEstimate: '10 min', date: new Date(), completed: false },
                { userId: adminId, title: 'Drink Water', description: 'Hydrate yourself', timeEstimate: '1 min', date: new Date(), completed: true }
            ]);
            console.log('Tasks seeded');
        }

        // Seed Moods
        const moodCount = await Mood.countDocuments();
        if (moodCount === 0 && adminId) {
            await Mood.create([
                { userId: adminId, emotion: 'Happy', intensity: 8, note: 'Feeling great!', date: new Date() },
                { userId: adminId, emotion: 'Calm', intensity: 6, note: 'Relaxed evening', date: new Date(Date.now() - 86400000) }
            ]);
            console.log('Moods seeded');
        }

        // Seed Journal
        const journalCount = await Journal.countDocuments();
        if (journalCount === 0 && adminId) {
            await Journal.create([
                { userId: adminId, title: 'First Entry', content: 'Starting my healing journey.', mood: 'Hopeful', date: new Date() }
            ]);
            console.log('Journal seeded');
        }

    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

// seedData(); // Moved to after DB connection

const app = express();

// Allow all origins for development
app.use(cors());

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.get('/', (req, res) => {
    res.send('LoveDetox API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/mind-canvas', require('./routes/mindCanvasRoutes'));
app.use('/api/sounds', require('./routes/soundRoutes'));

const PORT = process.env.PORT || 5001;
if (require.main === module) {
    connectDB().then(async () => {
        await seedData();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app;
