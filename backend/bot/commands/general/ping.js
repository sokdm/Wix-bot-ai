module.exports = {
  name: 'ping',
  aliases: ['pong', 'speed'],
  description: 'Check bot response time',
  cooldown: 3,
  execute: async ({ sock, jid }) => {
    const start = Date.now();
    await sock.sendMessage(jid, { text: '🏓 Pong!' });
    const end = Date.now();
    const latency = end - start;
    
    await sock.sendMessage(jid, { 
      text: `🏓 *Pong!*\n\nResponse time: ${latency}ms\nBot is running smoothly! ⚡` 
    });
  }
};
