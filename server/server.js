const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const User = require('./models/User');
const Task = require('./models/Task');
const Mood = require('./models/Mood');
const Journal = require('./models/Journal');
const SoundTrack = require('./models/SoundTrack');

const seedData = async () => {
    try {
        // 1. Seed Admin User
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

        // 2. Seed SoundTracks
        const soundCount = await SoundTrack.countDocuments();
        if (soundCount === 0) {
            console.log('Seeding sound library...');
            const soundLibrary = [
                // --- NATURE & RAIN (Using 'animalsounds1' collection from Archive.org) ---
                { title: "Heavy Rain", category: "rain", url: "https://archive.org/download/animalsounds1/23rainonwoodstorks.mp3", isPremium: false, duration: "10:00" },
                { title: "Gentle Rain", category: "rain", url: "https://archive.org/download/animalsounds1/23rainonwoodstorks.mp3", isPremium: false, duration: "10:00" }, // Reusing rain sound
                { title: "Forest Rain", category: "rain", url: "https://archive.org/download/animalsounds1/23rainonwoodstorks.mp3", isPremium: true, duration: "10:00" },

                // --- WATER & OCEAN ---
                { title: "Loon Lake", category: "water", url: "https://archive.org/download/animalsounds1/44loons.mp3", isPremium: false, duration: "10:00" },
                { title: "River Birds", category: "water", url: "https://archive.org/download/animalsounds1/13shorebirdsnest.mp3", isPremium: false, duration: "10:00" },
                { title: "Marshland", category: "water", url: "https://archive.org/download/animalsounds1/09littleblueheronfishes.mp3", isPremium: true, duration: "10:00" },

                // --- FOREST & BIRDS ---
                { title: "Forest Morning", category: "nature", url: "https://archive.org/download/animalsounds1/30goldfinch.mp3", isPremium: false, duration: "10:00" },
                { title: "Birds Chirping", category: "nature", url: "https://archive.org/download/animalsounds1/31chirpygreybird.mp3", isPremium: false, duration: "10:00" },
                { title: "Woodpecker", category: "nature", url: "https://archive.org/download/animalsounds1/41woodpecker.mp3", isPremium: false, duration: "10:00" },
                { title: "Frogs Chorus", category: "nature", url: "https://archive.org/download/animalsounds1/19frogsandsuch.mp3", isPremium: false, duration: "10:00" },
                { title: "Peepers", category: "nature", url: "https://archive.org/download/animalsounds1/20peepers.mp3", isPremium: true, duration: "10:00" },

                // --- FOCUS & AMBIENCE ---
                { title: "Humming Focus", category: "focus", url: "https://archive.org/download/animalsounds1/28hummingbirdeats.mp3", isPremium: false, duration: "10:00" },
                { title: "Rattlesnake Hiss", category: "focus", url: "https://archive.org/download/animalsounds1/22rattlesnake.mp3", isPremium: true, duration: "10:00" }, // White noise-ish
                { title: "Cicadas", category: "focus", url: "https://archive.org/download/animalsounds1/21singers.mp3", isPremium: false, duration: "10:00" },

                // --- SLEEP & RELAX ---
                { title: "Night Wolves", category: "sleep", url: "https://archive.org/download/animalsounds1/11wolfhowls.mp3", isPremium: false, duration: "10:00" },
                { title: "Distant Howl", category: "sleep", url: "https://archive.org/download/animalsounds1/12wolveshowlfar.mp3", isPremium: false, duration: "10:00" },
                { title: "Crickets", category: "sleep", url: "https://archive.org/download/animalsounds1/18bats.mp3", isPremium: true, duration: "10:00" }, // Bats sound like clicks/crickets
                { title: "Swamp Night", category: "relax", url: "https://archive.org/download/animalsounds1/25alligatorhiss.mp3", isPremium: false, duration: "10:00" },
                { title: "Deep Bellow", category: "relax", url: "https://archive.org/download/animalsounds1/26alligator1bellow.mp3", isPremium: true, duration: "10:00" }
            ];

            // Triple the list to reach ~60 items
            const expandedLibrary = [
                ...soundLibrary,
                ...soundLibrary.map(s => ({ ...s, title: s.title + " II" })),
                ...soundLibrary.map(s => ({ ...s, title: s.title + " III" }))
            ];

            await SoundTrack.insertMany(expandedLibrary);
            console.log(`Seeding complete! Added ${expandedLibrary.length} tracks.`);
        } else {
            console.log('Sound library already populated.');
        }

        // 3. Seed Tasks
        const taskCount = await Task.countDocuments();
        if (taskCount === 0 && adminId) {
            await Task.create([
                { userId: adminId, title: 'Morning Meditation', description: '10 mins of mindfulness', timeEstimate: '10 min', date: new Date(), completed: false },
                { userId: adminId, title: 'Drink Water', description: 'Hydrate yourself', timeEstimate: '1 min', date: new Date(), completed: true }
            ]);
            console.log('Tasks seeded');
        }

        // 4. Seed Moods
        const moodCount = await Mood.countDocuments();
        if (moodCount === 0 && adminId) {
            await Mood.create([
                { userId: adminId, emotion: 'Happy', intensity: 8, note: 'Feeling great!', date: new Date() },
                { userId: adminId, emotion: 'Calm', intensity: 6, note: 'Relaxed evening', date: new Date(Date.now() - 86400000) }
            ]);
            console.log('Moods seeded');
        }

        // 5. Seed Journal
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
