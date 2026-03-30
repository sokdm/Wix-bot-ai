module.exports = {
  name: 'flip',
  aliases: ['coin', 'coinflip'],
  description: 'Flip a coin',
  cooldown: 3,
  execute: async ({ sock, jid }) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '👤' : '🦅';
    
    await sock.sendMessage(jid, { 
      text: `🪙 *Flipping coin...*\n\n${emoji} *${result}*` 
    });
  }
};
