require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectDB = require('./db/db');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');


// Establish DataBase Connection
connectDB();


// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


app.post('/submit', async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.redirect('/')
  }
  try {
    const token = uuidv4();

    // Create a magic link with a token
    const magicLink = `${process.env.BASE_URL}/login?token=${token}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: 'Magic Link Login',
      text: `Click the following link to log in: ${magicLink}`,
      html: `<p>Click the following link to log in: <a href="${magicLink}">${magicLink}</a></p>`,
    };

    await sgMail.send(msg);

    console.log('Magic link sent');
    res.send('Magic link sent! Check your email.');
  } catch (error) {
    console.error('Error sending magic link:', error);
    res.status(500).send('Error sending magic link.');
  }




});








const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port`));