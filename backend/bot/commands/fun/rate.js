module.exports = {
  name: 'rate',
  description: 'Rate something 1-10',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide something to rate.\n\nExample: .rate my coding skills' 
      });
    }
    
    const thing = args.join(' ');
    const rating = Math.floor(Math.random() * 10) + 1;
    const emoji = rating >= 8 ? '🔥' : rating >= 5 ? '👍' : '💩';
    
    await sock.sendMessage(jid, { 
      text: `📊 *Rating*\n\n"${thing}"\n\n${emoji} ${rating}/10` 
    });
  }
};
