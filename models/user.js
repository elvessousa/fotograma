const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/fotograma/image/upload/v1589063125/default-photo_amc9di.png',
  },
  followers: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
});

mongoose.model('User', userSchema);
