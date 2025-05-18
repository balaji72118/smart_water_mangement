require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Twilio Credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(express.json());

// Local server link
const localLink = 'http://192.168.113.20:5500/indexfirebase.html';

// Endpoint to handle SMS sending
app.post('/send-leak-alert', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  const messageText = `🚨 Leak detected in your system! Please take action immediately. View system status here: ${localLink}`;

  client.messages
    .create({
      body: messageText,
      from: twilioNumber,
      to: phoneNumber
    })
    .then(message => {
      console.log('✅ SMS sent with SID:', message.sid);
      res.status(200).json({ success: true, sid: message.sid });
    })
    .catch(error => {
      console.error('❌ Twilio Error:', error.message);
      res.status(500).json({ success: false, error: error.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
