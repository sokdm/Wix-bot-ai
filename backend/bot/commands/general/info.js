module.exports = {
  name: 'info',
  aliases: ['about', 'botinfo'],
  description: 'Bot information',
  cooldown: 5,
  execute: async ({ sock, jid }) => {
    const infoText = `🤖 *Wix WhatsApp AI Bot*

*Version:* 1.0.0
*Creator:* Wisdom 👨‍💻
*Platform:* Node.js + Baileys
*AI Engine:* DeepSeek API

*Features:*
• 50+ Commands
• AI Auto-Reply
• Group Management
• Media Processing
• Fun & Utilities

*Powered by:* DeepSeek AI
*Built for:* Termux & Low-resource environments

© 2024 Wix WhatsApp AI Bot`;
    
    await sock.sendMessage(jid, { text: infoText });
  }
};
