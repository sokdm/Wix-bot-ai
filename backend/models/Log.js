const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['command', 'message', 'error', 'connection', 'admin'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);
