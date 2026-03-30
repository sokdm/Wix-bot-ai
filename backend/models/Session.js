const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  pairingCode: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastPing: {
    type: Date,
    default: Date.now
  },
  messagesCount: {
    type: Number,
    default: 0
  },
  commandsUsed: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);
