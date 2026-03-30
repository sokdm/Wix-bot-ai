module.exports = {
  name: 'groupinfo',
  aliases: ['ginfo', 'group'],
  description: 'Show group information',
  cooldown: 10,
  groupOnly: true,
  execute: async ({ sock, jid }) => {
    const groupMetadata = await sock.groupMetadata(jid);
    const participants = groupMetadata.participants;
    const admins = participants.filter(p => p.admin).map(p => p.id);
    
    const infoText = `📊 *Group Information*

*Name:* ${groupMetadata.subject}
*Description:* ${groupMetadata.desc || 'No description'}
*Members:* ${participants.length}
*Admins:* ${admins.length}
*Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}

*Owner:* @${groupMetadata.owner?.split('@')[0] || 'Unknown'}`;

    await sock.sendMessage(jid, { 
      text: infoText,
      mentions: groupMetadata.owner ? [groupMetadata.owner] : []
    });
  }
};
