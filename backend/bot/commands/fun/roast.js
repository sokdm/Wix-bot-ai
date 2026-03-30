const roasts = [
  "You're like a cloud. When you disappear, it's a beautiful day. ☁️",
  "I'm not saying I hate you, but I would unplug your life support to charge my phone. 🔌",
  "You're the reason the gene pool needs a lifeguard. 🏊",
  "If I had a face like yours, I'd sue my parents. 👨‍⚖️",
  "You're not stupid; you just have bad luck thinking. 🧠",
  "I'd agree with you but then we'd both be wrong. 🤷‍♂️",
  "You're like a software update. Whenever I see you, I think 'Not now'. 📱",
  "If laughter is the best medicine, your face must be curing the world. 😷",
  "You're not dumb. You just have bad luck when it comes to thinking. 🎲",
  "I'd explain it to you, but I left my crayons at home. 🖍️"
];

module.exports = {
  name: 'roast',
  description: 'Roast someone',
  cooldown: 10,
  execute: async ({ sock, jid, args, msg }) => {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentioned?.[0];
    
    if (!target && args.length) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }
    
    if (!target) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please mention someone to roast.\n\nExample: .roast @user' 
      });
    }
    
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    
    await sock.sendMessage(jid, { 
      text: `🔥 *Roast Time*\n\n@${target.split('@')[0]}, ${roast}`,
      mentions: [target]
    });
  }
};
