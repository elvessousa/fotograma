const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SITE_URL, SENDGRID_KEY } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_KEY,
    },
  })
);

// -----------------------------------
// Signup
// -----------------------------------
router.post('/signup', (req, res) => {
  const { name, email, password, avatar } = req.body;

  // Error if some data is not available
  if (!email || !password || !name) {
    return res.status(422).json({
      error: 'Please add all fields.',
    });
  }

  // Save user
  User.findOne({ email: email }).then((savedUser) => {
    // Don't save if user already exists
    if (savedUser) {
      return res.status(422).json({
        error: 'User already exists.',
      });
    }

    // Hash the passwords
    bcrypt
      .hash(password, 12)
      .then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          avatar,
        });

        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: 'elves.sousa@gmail.com',
              subject: 'Welcome to Fotograma!',
              html: '<h1>Welcome to Fotograma</h1>',
            });
            res.json({
              message: 'Saved successfully.',
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  res.json({ message: 'Success!' });
});

// -----------------------------------
// Forgot password
// -----------------------------------
router.post('/reset', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }

    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'No such user.' });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: 'elves.sousa@gmail.com',
          subject: 'Password reset',
          html: `
            <h1>Password reset.</h1>
            <p>It seems you've forgotten your password.</p>
            <p>No problem! Just click the link below to reset it.</p>
            <p>
            <a href="${SITE_URL}/reset/${token}">Click here to reset your password.</a>
            </p>
          `,
        });
        res.json({ message: 'Check your email for further instructions.' });
      });
    });
  });
});

// -----------------------------------
// Save new password to DB
// -----------------------------------
router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.status(422).json({ error: 'Session expired! Try again' });
    }
    bcrypt
      .hash(newPassword, 12)
      .then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: '' });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// -----------------------------------
// Signin
// -----------------------------------
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Error if some data is not available
  if (!email || !password) {
    return res.status(422).json({
      error: 'Please add all fields.',
    });
  }

  User.findOne({ email: email }).then((savedUser) => {
    // Error if user does not exist
    if (!savedUser) {
      return res.status(422).json({
        error: 'Invalid email or password.',
      });
    }

    // Decrypt used password
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        // Add token if login
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, avatar } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, avatar },
          });
        } else {
          return res.status(422).json({ error: 'Invalid email or password.' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
