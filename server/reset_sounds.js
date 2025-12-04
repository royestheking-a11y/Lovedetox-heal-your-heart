const mongoose = require('mongoose');
require('dotenv').config();

const resetSounds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://lovedetoxorg_db_user:VkdK98MB5X45TfyB@lovedetox.ihwfmw7.mongodb.net/test?appName=lovedetox');
        console.log('Connected to DB');

        // Define schema temporarily to access collection
        const soundSchema = new mongoose.Schema({}, { strict: false });
        const SoundTrack = mongoose.model('SoundTrack', soundSchema);

        const result = await SoundTrack.deleteMany({});
        console.log(`Deleted ${result.deletedCount} existing tracks.`);

        console.log('Database cleared. Restart the server to re-seed.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetSounds();
