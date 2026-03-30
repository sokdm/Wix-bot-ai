module.exports = {
  name: 'unblock',
  description: 'Unblock a user',
  cooldown: 10,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a number to unblock.\n\nExample: .unblock 1234567890' 
      });
    }
    
    const target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    try {
      await sock.updateBlockStatus(target, 'unblock');
      await sock.sendMessage(jid, { 
        text: `✅ Unblocked @${target.split('@')[0]}`,
        mentions: [target]
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to unblock user.' });
    }
  }
};
