const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : null;

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
        }
    });

    const mailOptions = {
        from: `"Zaniza" <${user}>`,
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
