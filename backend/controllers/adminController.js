const User = require('../models/User');
const Session = require('../models/Session');
const Log = require('../models/Log');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');
const WhatsAppService = require('../services/whatsappService');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSessions = await Session.countDocuments({ isActive: true });
    const totalMessages = await Log.countDocuments({ type: 'message' });
    const totalCommands = await Log.countDocuments({ type: 'command' });

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentSessions = await Session.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(10);

    return success(res, {
      stats: { totalUsers, activeSessions, totalMessages, totalCommands },
      recentUsers,
      recentSessions
    });
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    return success(res, users);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    
    return success(res, sessions);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.stopSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return error(res, 'Session not found');
    }

    await WhatsAppService.closeSession(sessionId);
    session.isActive = false;
    await session.save();

    await User.findByIdAndUpdate(session.userId, { isConnected: false, sessionId: null });

    logger.info(`Admin stopped session: ${sessionId}`);
    return success(res, null, 'Session stopped successfully');
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(100);
    
    return success(res, logs);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return error(res, 'User not found');
    }

    // Stop any active session
    if (user.sessionId) {
      await WhatsAppService.closeSession(user.sessionId);
      await Session.deleteOne({ sessionId: user.sessionId });
    }

    await Log.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    logger.info(`Admin deleted user: ${userId}`);
    return success(res, null, 'User deleted successfully');
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};
