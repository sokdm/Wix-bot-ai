module.exports = {
  name: 'block',
  description: 'Block a user',
  cooldown: 10,
  execute: async ({ sock, jid, args, msg }) => {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentioned?.[0];
    
    if (!target && args.length) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }
    
    if (!target) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please mention a user to block.' 
      });
    }
    
    try {
      await sock.updateBlockStatus(target, 'block');
      await sock.sendMessage(jid, { 
        text: `🚫 Blocked @${target.split('@')[0]}`,
        mentions: [target]
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to block user.' });
    }
  }
};
