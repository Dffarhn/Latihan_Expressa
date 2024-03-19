const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'd.raihan2004', // Your Gmail email address
      pass: 'rpayrriiumwdqeow', // Your Gmail password or an app-specific password
    },
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
