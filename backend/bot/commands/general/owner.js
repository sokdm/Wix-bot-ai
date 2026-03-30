module.exports = {
  name: 'owner',
  aliases: ['creator', 'dev', 'developer'],
  description: 'Contact bot creator',
  cooldown: 10,
  execute: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { 
      text: `👨‍💻 *Creator Information*

*Name:* Wisdom
*Role:* Senior AI Systems Architect
*Project:* Wix WhatsApp AI Bot

Thank you for using my bot! 🙏

For support or inquiries, contact the admin.` 
    });
  }
};
