module.exports = {
  name: 'roll',
  aliases: ['dice', 'rolldice'],
  description: 'Roll a dice',
  cooldown: 3,
  execute: async ({ sock, jid, args }) => {
    const sides = args[0] ? parseInt(args[0]) : 6;
    const result = Math.floor(Math.random() * sides) + 1;
    
    await sock.sendMessage(jid, { 
      text: `🎲 *Rolling ${sides}-sided dice...*\n\nResult: *${result}*` 
    });
  }
};
