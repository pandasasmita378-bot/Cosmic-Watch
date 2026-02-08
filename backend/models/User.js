const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{
    asteroidId: String,
    name: String,
    addedAt: { type: Date, default: Date.now }
  }],
  // NEW: Store joined communities
  joinedRooms: [{
    id: String,
    name: String
  }]
});

module.exports = mongoose.model('User', UserSchema);