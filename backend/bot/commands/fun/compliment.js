const compliments = [
  "You're more fun than a ball pit filled with candy! 🍬",
  "You're like a ray of sunshine on a rainy day. ☀️",
  "If you were a vegetable, you'd be a cute-cumber! 🥒",
  "You're the CSS to my HTML. 🎨",
  "You're more helpful than a search engine. 🔍",
  "If you were a bug, you'd be a feature! 🐛",
  "You're the semicolon to my code; complete and essential. 💻",
  "You're cooler than the other side of the pillow. 🛏️",
  "You're like a perfectly optimized algorithm. ⚡",
  "You're the WiFi signal I was looking for. 📶"
];

module.exports = {
  name: 'compliment',
  aliases: ['compliment', 'praise'],
  description: 'Compliment someone',
  cooldown: 5,
  execute: async ({ sock, jid, args, msg }) => {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentioned?.[0];
    
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    
    if (target) {
      await sock.sendMessage(jid, { 
        text: `🌟 *Compliment for @${target.split('@')[0]}*\n\n${compliment}`,
        mentions: [target]
      });
    } else {
      await sock.sendMessage(jid, { 
        text: `🌟 *Compliment*\n\n${compliment}` 
      });
    }
  }
};
