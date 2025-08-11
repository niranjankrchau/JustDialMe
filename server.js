// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const otp = generateOTP();

  try {
    await transporter.sendMail({
      from: 'YOUR_EMAIL@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });
    res.json({ message: 'OTP sent', otp });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.listen(3000, () => console.log('Server on port 3000'));
