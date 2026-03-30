module.exports = {
  name: 'hidetag',
  aliases: ['ht', 'hiddentag', 'notify'],
  description: 'Tag all members without showing list',
  cooldown: 30,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    const groupMetadata = await sock.groupMetadata(jid);
    const participants = groupMetadata.participants;
    
    const message = args.length ? args.join(' ') : '🔔 Notification!';
    const mentions = participants.map(p => p.id);
    
    await sock.sendMessage(jid, { 
      text: message,
      mentions: mentions
    });
  }
};
