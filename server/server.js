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

const seedData = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@lovedetox.com' });
        let adminId;

        if (!adminExists) {
            const adminUser = await User.create({
                name: 'Admin',
                email: 'admin@lovedetox.com',
                password: 'lovedetox009', // Will be hashed by pre-save hook
                isAdmin: true,
                isPro: true
            });
            adminId = adminUser._id;
            console.log('Admin user created');
        } else {
            adminId = adminExists._id;
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

seedData();

const app = express();

// Allow all origins for development to avoid CORS issues
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

const PORT = process.env.PORT || 5001;
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app;
