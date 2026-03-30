const responses = [
  "It is certain. ✨",
  "It is decidedly so. ✨",
  "Without a doubt. ✨",
  "Yes definitely. ✨",
  "You may rely on it. ✨",
  "As I see it, yes. ✨",
  "Most likely. ✨",
  "Outlook good. ✨",
  "Yes. ✨",
  "Signs point to yes. ✨",
  "Reply hazy, try again. 🌫️",
  "Ask again later. 🌫️",
  "Better not tell you now. 🌫️",
  "Cannot predict now. 🌫️",
  "Concentrate and ask again. 🌫️",
  "Don't count on it. ❌",
  "My reply is no. ❌",
  "My sources say no. ❌",
  "Outlook not so good. ❌",
  "Very doubtful. ❌"
];

module.exports = {
  name: '8ball',
  aliases: ['magic8ball', 'ask8ball'],
  description: 'Ask the magic 8-ball',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please ask a yes/no question.\n\nExample: .8ball Will I be rich?' 
      });
    }
    
    const question = args.join(' ');
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    await sock.sendMessage(jid, { 
      text: `🎱 *Magic 8-Ball*\n\nQ: ${question}\n\nA: ${response}` 
    });
  }
};
