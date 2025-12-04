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
                // --- NATURE & RAIN ---
                { title: "Heavy Rain", category: "rain", url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", isPremium: false, duration: "10:00" },
                { title: "Gentle Rain", category: "rain", url: "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg", isPremium: false, duration: "10:00" },
                { title: "Thunderstorm", category: "rain", url: "https://actions.google.com/sounds/v1/weather/thunderstorm.ogg", isPremium: true, duration: "10:00" },
                { title: "Rain on Window", category: "rain", url: "https://actions.google.com/sounds/v1/weather/rain_on_windows.ogg", isPremium: false, duration: "10:00" },
                { title: "Distant Thunder", category: "rain", url: "https://actions.google.com/sounds/v1/weather/rolling_thunder.ogg", isPremium: false, duration: "10:00" },

                // --- WATER & OCEAN ---
                { title: "Ocean Waves", category: "water", url: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg", isPremium: false, duration: "10:00" },
                { title: "River Flow", category: "water", url: "https://actions.google.com/sounds/v1/water/river_flow.ogg", isPremium: false, duration: "10:00" },
                { title: "Babbling Brook", category: "water", url: "https://actions.google.com/sounds/v1/water/stream_water.ogg", isPremium: true, duration: "10:00" },
                { title: "Waterfall", category: "water", url: "https://actions.google.com/sounds/v1/water/waterfall.ogg", isPremium: false, duration: "10:00" },
                { title: "Fountain", category: "water", url: "https://actions.google.com/sounds/v1/water/fountain.ogg", isPremium: false, duration: "10:00" },

                // --- FOREST & BIRDS ---
                { title: "Forest Morning", category: "nature", url: "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg", isPremium: false, duration: "10:00" },
                { title: "Birds Chirping", category: "nature", url: "https://actions.google.com/sounds/v1/animals/birds_chirping.ogg", isPremium: false, duration: "10:00" },
                { title: "Jungle Atmosphere", category: "nature", url: "https://actions.google.com/sounds/v1/ambiences/jungle_atmosphere.ogg", isPremium: true, duration: "10:00" },
                { title: "Crickets at Night", category: "nature", url: "https://actions.google.com/sounds/v1/animals/crickets.ogg", isPremium: false, duration: "10:00" },
                { title: "Wind in Trees", category: "nature", url: "https://actions.google.com/sounds/v1/weather/wind_blowing_through_trees.ogg", isPremium: false, duration: "10:00" },

                // --- FOCUS & AMBIENCE ---
                { title: "White Noise", category: "focus", url: "https://actions.google.com/sounds/v1/ambiences/white_noise.ogg", isPremium: false, duration: "10:00" },
                { title: "Coffee Shop", category: "focus", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", isPremium: true, duration: "10:00" },
                { title: "Library Silence", category: "focus", url: "https://actions.google.com/sounds/v1/ambiences/library_ambience.ogg", isPremium: false, duration: "10:00" },
                { title: "Clock Ticking", category: "focus", url: "https://actions.google.com/sounds/v1/household/clock_ticking.ogg", isPremium: false, duration: "10:00" },
                { title: "Keyboard Typing", category: "focus", url: "https://actions.google.com/sounds/v1/office/typing.ogg", isPremium: false, duration: "10:00" },

                // --- SLEEP & RELAX ---
                { title: "Campfire", category: "sleep", url: "https://actions.google.com/sounds/v1/ambiences/campfire.ogg", isPremium: false, duration: "10:00" },
                { title: "Night Ambience", category: "sleep", url: "https://actions.google.com/sounds/v1/ambiences/night_camp.ogg", isPremium: false, duration: "10:00" },
                { title: "Wind Chimes", category: "relax", url: "https://actions.google.com/sounds/v1/household/wind_chimes.ogg", isPremium: true, duration: "10:00" },
                { title: "Tibetan Bowl", category: "relax", url: "https://actions.google.com/sounds/v1/foley/glasses_clinking.ogg", isPremium: false, duration: "10:00" },
                { title: "Deep Space", category: "sleep", url: "https://actions.google.com/sounds/v1/science_fiction/space_ambience.ogg", isPremium: true, duration: "10:00" },

                // --- MORE VARIETY ---
                { title: "City Rain", category: "rain", url: "https://actions.google.com/sounds/v1/weather/rain_on_pavement.ogg", isPremium: false, duration: "10:00" },
                { title: "Stormy Sea", category: "water", url: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rocks.ogg", isPremium: true, duration: "10:00" },
                { title: "Meadow", category: "nature", url: "https://actions.google.com/sounds/v1/ambiences/meadow.ogg", isPremium: false, duration: "10:00" },
                { title: "Fan Noise", category: "sleep", url: "https://actions.google.com/sounds/v1/household/air_conditioner_hum.ogg", isPremium: false, duration: "10:00" },
                { title: "Train Ride", category: "focus", url: "https://actions.google.com/sounds/v1/transportation/train_moving.ogg", isPremium: false, duration: "10:00" },
                { title: "Airplane Cabin", category: "focus", url: "https://actions.google.com/sounds/v1/transportation/airplane_cabin.ogg", isPremium: true, duration: "10:00" },
                { title: "Underwater", category: "relax", url: "https://actions.google.com/sounds/v1/water/underwater.ogg", isPremium: false, duration: "10:00" },
                { title: "Cave Drops", category: "relax", url: "https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg", isPremium: false, duration: "10:00" },
                { title: "Fireplace", category: "sleep", url: "https://actions.google.com/sounds/v1/ambiences/fireplace.ogg", isPremium: false, duration: "10:00" },
                { title: "Pink Noise", category: "focus", url: "https://actions.google.com/sounds/v1/ambiences/pink_noise.ogg", isPremium: false, duration: "10:00" }
            ];

            // Double the list to reach ~60 items
            const expandedLibrary = [
                ...soundLibrary,
                ...soundLibrary.map(s => ({ ...s, title: s.title + " II" }))
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
