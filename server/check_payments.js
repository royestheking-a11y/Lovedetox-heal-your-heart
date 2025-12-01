const mongoose = require('mongoose');
const Payment = require('./models/Payment');
const User = require('./models/User');
require('dotenv').config();

const checkPayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const payments = await Payment.find({});
        console.log(`Found ${payments.length} payments:`);
        console.log(JSON.stringify(payments, null, 2));

        if (payments.length > 0) {
            const populatedPayments = await Payment.find({}).populate('userId', 'email');
            console.log('Populated Payments sample:', JSON.stringify(populatedPayments[0], null, 2));
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkPayments();
