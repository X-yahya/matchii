const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
console.log("[Email Config] Using credentials:", {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "***" + process.env.EMAIL_PASS.slice(-3) : "undefined"
});


// Create transporter with proper authentication
const transporter = nodemailer.createTransport({
  service: 'gmail', // Must be lowercase
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Add for local development
  }
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your OTP Code</h2>
          <p>Use the following OTP to verify your email address:</p>
          <h1 style="font-size: 36px; color: #2563eb;">${otp}</h1>
          <p style="margin-top: 30px; color: #6b7280;">
            This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = {
 
  sendOtpEmail
};