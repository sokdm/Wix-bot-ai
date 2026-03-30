module.exports = {
  name: 'alive',
  aliases: ['status', 'running'],
  description: 'Check if bot is active',
  cooldown: 5,
  execute: async ({ sock, jid }) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const aliveMsg = `🤖 *Wix WhatsApp AI Bot is Online!*

✅ Status: Active
⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
📅 Date: ${new Date().toLocaleString()}
👨‍💻 Creator: Wisdom

Bot is ready to serve you! 🚀`;
    
    await sock.sendMessage(jid, { text: aliveMsg });
  }
};
