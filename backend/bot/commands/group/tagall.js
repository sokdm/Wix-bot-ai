module.exports = {
  name: 'tagall',
  aliases: ['tag', 'all', 'everyone'],
  description: 'Tag all group members',
  cooldown: 30,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    const groupMetadata = await sock.groupMetadata(jid);
    const participants = groupMetadata.participants;
    
    let message = args.length ? args.join(' ') + '\n\n' : '👥 *Attention Everyone!*\n\n';
    
    const mentions = participants.map(p => p.id);
    const tagList = participants.map(p => `• @${p.id.split('@')[0]}`).join('\n');
    
    message += tagList;
    
    await sock.sendMessage(jid, { 
      text: message,
      mentions: mentions
    });
  }
};
