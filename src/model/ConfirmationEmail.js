const { configDotenv } = require('dotenv');
const nodemailer = require('nodemailer');
configDotenv()

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your Gmail email address
      pass: process.env.SMTP_PASSWORD, // Your Gmail password or an app-specific password
    },
    connectionTimeout: 10 * 1000, // 10 seconds
    greetingTimeout: 10 * 1000, // 10 seconds
    socketTimeout: 10 * 1000, // 10 seconds
  });

async function sendVerificationEmail(userEmail, verificationToken) {
  const mailOptions = {
    from: 'Kahlova',
    to: userEmail,
    subject: 'Email Verification',
    html: `<p>Please click <a href="https://latihan-expressa.vercel.app/verify?token=${verificationToken}">here</a> to verify your email address jancuk.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}


module.exports ={sendVerificationEmail}
