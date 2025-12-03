const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    // Note: For Gmail, you need to use an App Password if 2FA is on.
    // If no env vars are set, this will fail gracefully or log error.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
            pass: process.env.EMAIL_PASS  // e.g., your-app-password
        }
    });

    // Define email options
    const mailOptions = {
        from: `LoveDetox Team <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
