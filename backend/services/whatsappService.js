const { 
  default: makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs-extra');
const EventEmitter = require('events');

const Session = require('../models/Session');
const User = require('../models/User');
const Log = require('../models/Log');
const logger = require('../utils/logger');
const CommandHandler = require('../bot/handler');
const aiService = require('../utils/aiService');

class WhatsAppService extends EventEmitter {
  constructor() {
    super();
    this.sessions = new Map();
    this.commandHandler = new CommandHandler();
    this.sessionsDir = path.join(__dirname, '../bot/sessions');
    
    fs.ensureDirSync(this.sessionsDir);
  }

  formatPairingCode(code) {
    if (!code || code.length !== 8) return code;
    return code.slice(0, 3) + '-' + code.slice(3, 6) + '-' + code.slice(6, 8);
  }

  async initializeSession(sessionId, phoneNumber, userId) {
    try {
      const sessionPath = path.join(this.sessionsDir, sessionId);
      await fs.ensureDir(sessionPath);

      const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
      const { version } = await fetchLatestBaileysVersion();

      logger.info('Initializing session for: +' + phoneNumber);

      // IMPORTANT: For pairing code to work, we need specific browser settings
      const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        // Use Chrome on Linux for pairing code support - this is crucial
        browser: ['Chrome (Linux)', '', ''],
        markOnlineOnConnect: true,
        syncFullHistory: false,
        shouldIgnoreJid: jid => jid && jid.includes('broadcast'),
        getMessage: async () => undefined,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: true,
        fireInitQueries: true,
        downloadHistory: false,
        // Generate high quality link previews
        linkPreviewImageThumbnailWidth: 1980,
        generateHighQualityLinkPreview: true
      });

      let pairingCode = null;
      let codeReceived = false;
      
      // Create a promise that resolves when we get the pairing code
      const codePromise = new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (pairingCode) {
            clearInterval(checkInterval);
            clearTimeout(timeout);
            resolve(pairingCode);
          }
        }, 500);
        
        const timeout = setTimeout(() => {
          clearInterval(checkInterval);
          if (!pairingCode) {
            reject(new Error('Pairing code timeout'));
          }
        }, 90000); // 90 seconds timeout
      });

      this.sessions.set(sessionId, {
        socket: sock,
        userId,
        phoneNumber,
        saveCreds,
        pairingCode: null,
        isReady: false
      });

      // Handle connection updates
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        logger.info('Connection update: ' + connection + ', qr: ' + !!qr);

        // When we get QR code, immediately request pairing code
        if (qr && !codeReceived && !pairingCode) {
          codeReceived = true;
          
          try {
            // Wait for socket to stabilize
            await new Promise(r => setTimeout(r, 1000));
            
            logger.info('Requesting pairing code for: ' + phoneNumber);
            
            // Clean phone number - remove all non-digits
            const cleanPhone = phoneNumber.toString().replace(/\D/g, '');
            
            logger.info('Clean phone for pairing: ' + cleanPhone);
            
            // Request pairing code from WhatsApp
            // This is the critical part - we need to call this immediately when QR is received
            const code = await sock.requestPairingCode(cleanPhone);
            
            if (code && code.length > 0) {
              // Clean the code - uppercase and remove any special chars
              pairingCode = code.toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
              
              // Ensure it's 8 characters
              if (pairingCode.length === 8) {
                const session = this.sessions.get(sessionId);
                if (session) session.pairingCode = pairingCode;
                
                const displayCode = this.formatPairingCode(pairingCode);
                logger.info('✅ Pairing code generated: ' + pairingCode + ' (Display: ' + displayCode + ')');
              } else {
                logger.error('Invalid code length received: ' + pairingCode.length);
                pairingCode = null;
              }
            } else {
              logger.error('No pairing code received from WhatsApp');
            }
          } catch (err) {
            logger.error('❌ Pairing code request failed: ' + err.message);
            logger.error(err.stack);
          }
        }

        if (connection === 'open') {
          logger.info('✅ Session ' + sessionId + ' connected successfully');
          await this.handleConnectionOpen(sessionId, sock);
        }

        if (connection === 'close') {
          const statusCode = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output ? lastDisconnect.error.output.statusCode : null;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut && 
                                  statusCode !== DisconnectReason.badSession &&
                                  statusCode !== 401;
          
          logger.info('Session ' + sessionId + ' closed. Status: ' + statusCode + ', Reconnect: ' + shouldReconnect);
          
          if (shouldReconnect && !codeReceived) {
            logger.info('Reconnecting session ' + sessionId + ' in 5 seconds...');
            setTimeout(() => this.initializeSession(sessionId, phoneNumber, userId), 5000);
          } else {
            await this.cleanupSession(sessionId);
          }
        }
      });

      sock.ev.on('creds.update', saveCreds);

      // Wait for pairing code
      try {
        const result = await codePromise;
        return result;
      } catch (err) {
        logger.error('Failed to get pairing code: ' + err.message);
        await this.closeSession(sessionId);
        return null;
      }

    } catch (err) {
      logger.error('Initialize session error: ' + err.message);
      logger.error(err.stack);
      return null;
    }
  }

  async handleConnectionOpen(sessionId, sock) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.isReady = true;
    
    await Session.findOneAndUpdate(
      { sessionId },
      { isActive: true, lastPing: new Date() }
    );

    await User.findByIdAndUpdate(session.userId, { isConnected: true });

    const welcomeMessage = '👋 Welcome! Your bot is now active.\n\n🤖 Powered by Wix WhatsApp AI Bot\n👨‍💻 Creator: Wisdom\n\nType .menu to see available commands.';

    try {
      const jid = session.phoneNumber + '@s.whatsapp.net';
      await sock.sendMessage(jid, { text: welcomeMessage });
      
      await Log.create({
        userId: session.userId,
        sessionId,
        type: 'connection',
        content: 'WhatsApp connected successfully'
      });
    } catch (err) {
      logger.error('Failed to send welcome message: ' + err.message);
    }

    sock.ev.on('messages.upsert', async (m) => {
      if (m.type === 'notify') {
        await this.handleMessage(sessionId, m);
      }
    });

    sock.ev.on('group-participants.update', async (update) => {
      await this.handleGroupUpdate(sessionId, update);
    });
  }

  async handleMessage(sessionId, m) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isReady) return;

    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    const sender = msg.key.participant || msg.key.remoteJid;
    
    let messageContent = '';
    if (msg.message.conversation) {
      messageContent = msg.message.conversation;
    } else if (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) {
      messageContent = msg.message.extendedTextMessage.text;
    } else if (msg.message.imageMessage && msg.message.imageMessage.caption) {
      messageContent = msg.message.imageMessage.caption;
    } else if (msg.message.videoMessage && msg.message.videoMessage.caption) {
      messageContent = msg.message.videoMessage.caption;
    }

    if (!messageContent) return;

    await Log.create({
      userId: session.userId,
      sessionId,
      type: 'message',
      content: messageContent.substring(0, 200),
      metadata: { jid, sender, isGroup }
    });

    await Session.findOneAndUpdate(
      { sessionId },
      { $inc: { messagesCount: 1 }, lastPing: new Date() }
    );

    const prefix = process.env.PREFIX || '.';
    if (messageContent.startsWith(prefix)) {
      await this.commandHandler.handle(msg, session.socket, sessionId, session.userId);
      await Session.findOneAndUpdate(
        { sessionId },
        { $inc: { commandsUsed: 1 } }
      );
      return;
    }

    if (!isGroup) {
      const user = await User.findById(session.userId);
      if (user && user.autoReply) {
        const autoReplyMsg = await aiService.generateAutoReply(user.email.split('@')[0]);
        await session.socket.sendMessage(jid, { 
          text: '🤖 *Auto-Reply*\n\n' + autoReplyMsg + '\n\n_User is currently unavailable._'
        });
      }
    }
  }

  async handleGroupUpdate(sessionId, update) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (update.action === 'add') {
      const welcomeMessage = '👋 Welcome to the group!\n\nI\'m *Wix WhatsApp AI Bot* 🤖\nType *.menu* to see what I can do!';
      
      try {
        await session.socket.sendMessage(update.id, { text: welcomeMessage });
      } catch (err) {
        logger.error('Welcome message error: ' + err.message);
      }
    }
  }

  async closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      try {
        await session.socket.logout();
      } catch (err) {
        logger.error('Logout error: ' + err.message);
      }
      this.sessions.delete(sessionId);
    }

    const sessionPath = path.join(this.sessionsDir, sessionId);
    try {
      await fs.remove(sessionPath);
    } catch (err) {
      logger.error('Session cleanup error: ' + err.message);
    }
  }

  async cleanupSession(sessionId) {
    await Session.findOneAndUpdate(
      { sessionId },
      { isActive: false }
    );
    
    const session = this.sessions.get(sessionId);
    if (session) {
      await User.findByIdAndUpdate(session.userId, { isConnected: false, sessionId: null });
    }
    
    this.sessions.delete(sessionId);
  }

  isSessionActive(sessionId) {
    const session = this.sessions.get(sessionId);
    return session && session.isReady;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }
}

module.exports = new WhatsAppService();
