module.exports = {
  name: 'kick',
  aliases: ['remove', 'ban'],
  description: 'Remove member from group',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args, msg }) => {
    let userToKick = args[0];
    
    if (!userToKick && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      userToKick = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    
    if (!userToKick) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please mention a user to kick.\n\nExample: .kick @user' 
      });
    }
    
    try {
      await sock.groupParticipantsUpdate(jid, [userToKick], 'remove');
      await sock.sendMessage(jid, { 
        text: `👢 User @${userToKick.split('@')[0]} has been kicked.`,
        mentions: [userToKick]
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to kick user. Make sure I am admin.' });
    }
  }
};
