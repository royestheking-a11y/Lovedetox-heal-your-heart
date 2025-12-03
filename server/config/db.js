const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        const uri = 'mongodb+srv://lovedetoxorg_db_user:VkdK98MB5X45TfyB@lovedetox.ihwfmw7.mongodb.net/test?appName=lovedetox';

        if (!uri) {
            throw new Error('Database connection string is missing.');
        }

        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
