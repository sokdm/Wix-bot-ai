module.exports = {
  name: 'uptime',
  description: 'Show bot uptime',
  cooldown: 5,
  execute: async ({ sock, jid }) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;
    
    await sock.sendMessage(jid, { 
      text: `⏱️ *Bot Uptime*\n\n${uptimeStr}\n\nRunning smoothly since startup! 🚀` 
    });
  }
};
