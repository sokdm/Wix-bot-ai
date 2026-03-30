const CommandLoader = require('./loader');
const aiService = require('../utils/aiService');
const logger = require('../utils/logger');
const User = require('../models/User');

class CommandHandler {
  constructor() {
    this.loader = new CommandLoader();
    this.commands = this.loader.loadCommands();
    this.cooldowns = new Map();
    this.prefix = process.env.PREFIX || '.';
  }

  async handle(msg, sock, sessionId, userId) {
    try {
      const messageContent = msg.message.conversation || 
                            msg.message.extendedTextMessage?.text || '';
      
      const args = messageContent.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      
      if (!commandName) return;

      const command = this.loader.getCommand(commandName);
      if (!command) {
        // Try AI response for unknown commands
        const aiResponse = await aiService.generateResponse(
          `User tried command: ${commandName}. Explain it's not found and suggest using .menu.`,
          'Be helpful and suggest the menu command.'
        );
        await sock.sendMessage(msg.key.remoteJid, { text: aiResponse });
        return;
      }

      // Check cooldown
      const cooldownKey = `${userId}_${command.name}`;
      if (this.cooldowns.has(cooldownKey)) {
        const expiration = this.cooldowns.get(cooldownKey);
        if (Date.now() < expiration) {
          const remaining = Math.ceil((expiration - Date.now()) / 1000);
          await sock.sendMessage(msg.key.remoteJid, { 
            text: `⏳ Please wait ${remaining} seconds before using this command again.` 
          });
          return;
        }
      }

      // Set cooldown
      if (command.cooldown) {
        this.cooldowns.set(cooldownKey, Date.now() + (command.cooldown * 1000));
      }

      // Check permissions
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (command.groupOnly && !isGroup) {
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ This command only works in groups!' });
        return;
      }

      if (command.adminOnly && isGroup) {
        const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
        const isAdmin = groupMetadata.participants.find(p => p.id === msg.key.participant)?.admin;
        if (!isAdmin) {
          await sock.sendMessage(msg.key.remoteJid, { text: '❌ Only admins can use this command!' });
          return;
        }
      }

      // Execute command
      const context = {
        msg,
        sock,
        args,
        sessionId,
        userId,
        isGroup,
        sender: msg.key.participant || msg.key.remoteJid,
        jid: msg.key.remoteJid,
        message: msg,
        aiService
      };

      await command.execute(context);

    } catch (err) {
      logger.error('Command handler error:', err);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: '❌ An error occurred while processing your command.' 
      });
    }
  }
}

module.exports = CommandHandler;
