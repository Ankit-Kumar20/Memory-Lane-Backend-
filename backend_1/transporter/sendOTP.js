import nodemailer from 'nodemailer'
import OTP from '../Auth/auth.js'
import EMAIL from '../Auth/auth.js'
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMIAL,       // replace with your email
      pass: process.env.APP_PASSWORD,  // use app-specific password if using Gmail
    },
  });
  
  // 3. Send OTP to user email
  async function sendOTPEmail(userEmail, otp) {

    const mailOptions = {
      from: '"Memory-Lane" ankitkumar070456@gmail.com',
      to: userEmail,
      subject: 'Your OTP Verification Code',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return otp; // You should store this OTP with expiry on your backend (e.g., in-memory, Redis, DB)
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  }
  
  // Example usage
  sendOTPEmail('user@example.com')
    .then((otp) => {
      console.log('OTP sent to user:', otp);
    })
    .catch(console.error); 