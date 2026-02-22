const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Diagnostic Logging
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : null;

    console.log('🧪 DIAGNOSTIC: Email variables check:');
    console.log(`- EMAIL_USER exists: ${!!user} (${user ? user.slice(0, 3) + '...' + user.slice(-10) : 'MISSING'})`);
    console.log(`- EMAIL_PASS exists: ${!!pass} (Length: ${pass ? pass.length : 0})`);

    if (!user || !pass) {
        console.error('❌ CRITICAL: EMAIL_USER or EMAIL_PASS missing in environment!');
        return;
    }

    // 2. Transporter with full logging
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        },
        debug: true, // Show full SMTP traffic in logs
        logger: true // Log to console
    });

    const mailOptions = {
        from: `"Authentic Shop" <${user}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    console.log(`📧 Attempting to send email to: ${options.email}`);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ SUCCESS! Email sent. MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ FAIL: Nodemailer Error Name:', error.name);
        console.error('❌ FAIL: Nodemailer Error Message:', error.message);

        if (error.response) {
            console.error('❌ FAIL: SMTP Response:', error.response);
        }

        throw error;
    }
};

module.exports = sendEmail;
