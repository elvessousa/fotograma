const express = require('express');
const app = express();
// const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 7777;
const { MONGOURI } = require('./config/keys.js');

// app.use(cors());

// -----------------------------------
// Connection to database
// -----------------------------------
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on('connected', () => {
  console.log('Teum!');
});

mongoose.connection.on('error', (err) => {
  console.log('Error:', err);
});

// -----------------------------------
// Models
// -----------------------------------
require('./models/user');
require('./models/post');

app.use(express.json());

// -----------------------------------
// Routes
// -----------------------------------
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

// -----------------------------------
// Production environment
// -----------------------------------
if (process.env.NODE_ENV == 'production') {
  app.use(express.static('./frontend/build'));
  const path = require('path');

  // Serve from index
  app.get('*', (req, res) => {
    res.sendFile(path, resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// -----------------------------------
// Serve
// -----------------------------------
app.listen(PORT);
