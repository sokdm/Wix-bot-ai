const Session = require('../models/Session');
const User = require('../models/User');
const Log = require('../models/Log');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');
const WhatsAppService = require('../services/whatsappService');

// Format pairing code with dashes for display
function formatPairingCodeDisplay(code) {
  if (!code || code.length !== 8) return code;
  // Format as: XXX-XXX-XX
  return `${code.slice(0, 3)}-${code.slice(3, 6)}-${code.slice(6, 8)}`;
}

// Helper function to format phone number correctly for WhatsApp
function formatPhoneNumber(countryCode, phoneNumber) {
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  let cleanCountryCode = countryCode.replace(/[^0-9]/g, '');
  
  // Remove leading zero from phone if present
  if (cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1);
  }
  
  const fullNumber = cleanCountryCode + cleanPhone;
  
  logger.info(`Formatted phone: +${fullNumber} (country: ${cleanCountryCode}, phone: ${cleanPhone})`);
  
  return {
    fullNumber,
    countryCode: cleanCountryCode,
    phoneNumber: cleanPhone,
    display: `+${cleanCountryCode} ${cleanPhone}`
  };
}

exports.connect = async (req, res) => {
  try {
    const { phoneNumber, countryCode } = req.body;
    const userId = req.user.id;

    if (!phoneNumber || !countryCode) {
      return error(res, 'Phone number and country code required');
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 7) {
      return error(res, 'Phone number too short');
    }

    // Check if user already has active session
    const existingSession = await Session.findOne({ userId, isActive: true });
    if (existingSession) {
      return error(res, 'You already have an active WhatsApp connection. Disconnect first.');
    }

    const formatted = formatPhoneNumber(countryCode, phoneNumber);
    
    logger.info(`Creating session for user ${userId}, phone: ${formatted.display}`);

    const sessionId = `session_${userId}_${Date.now()}`;
    
    const session = new Session({
      userId,
      sessionId,
      phoneNumber: formatted.fullNumber,
      pairingCode: null,
      isActive: false
    });
    await session.save();

    await User.findByIdAndUpdate(userId, {
      phoneNumber: formatted.fullNumber,
      countryCode: formatted.countryCode,
      sessionId
    });

    const pairingCode = await WhatsAppService.initializeSession(sessionId, formatted.fullNumber, userId);

    if (!pairingCode) {
      await Session.deleteOne({ _id: session._id });
      return error(res, 'Failed to generate pairing code. Please try again.');
    }

    session.pairingCode = pairingCode;
    await session.save();

    const displayCode = formatPairingCodeDisplay(pairingCode);
    
    logger.info(`✅ Pairing code generated for user ${userId}: ${pairingCode} (${displayCode})`);

    return success(res, {
      pairingCode: pairingCode, // Raw code for copy
      displayCode: displayCode, // Formatted with dashes
      sessionId,
      phoneNumber: formatted.display,
      instructions: [
        '1. Open WhatsApp on your phone',
        '2. Go to Settings → Linked Devices',
        '3. Tap "Link with phone number"',
        '4. Enter this code exactly as shown:',
        '',
        displayCode,
        '',
        'Or enter without dashes: ' + pairingCode
      ]
    }, 'Pairing code generated! Enter it in WhatsApp now.');

  } catch (err) {
    logger.error('Connect error:', err);
    return error(res, 'Failed to generate pairing code', 500);
  }
};

exports.getStatus = async (req, res) => {
  try {
    const session = await Session.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    
    if (!session) {
      return success(res, { connected: false });
    }

    const isActive = WhatsAppService.isSessionActive(session.sessionId);

    return success(res, {
      connected: isActive,
      sessionId: session.sessionId,
      phoneNumber: session.phoneNumber,
      messagesCount: session.messagesCount || 0,
      lastPing: session.lastPing
    });
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.disconnect = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (user?.sessionId) {
      await WhatsAppService.closeSession(user.sessionId);
      await Session.findOneAndUpdate(
        { sessionId: user.sessionId },
        { isActive: false }
      );
      await User.findByIdAndUpdate(userId, { isConnected: false, sessionId: null });
    }

    return success(res, null, 'Disconnected successfully');
  } catch (err) {
    logger.error('Disconnect error:', err);
    return error(res, 'Server error', 500);
  }
};

exports.toggleAutoReply = async (req, res) => {
  try {
    const { enabled } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { autoReply: enabled },
      { new: true }
    );

    return success(res, { autoReply: user.autoReply }, `Auto-reply ${enabled ? 'enabled' : 'disabled'}`);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    return success(res, logs);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};
