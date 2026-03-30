module.exports = {
  name: 'promote',
  aliases: ['admin', 'makeadmin'],
  description: 'Promote member to admin',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args, msg }) => {
    let userToPromote = args[0];
    
    if (!userToPromote && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      userToPromote = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    
    if (!userToPromote) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please mention a user to promote.\n\nExample: .promote @user' 
      });
    }
    
    try {
      await sock.groupParticipantsUpdate(jid, [userToPromote], 'promote');
      await sock.sendMessage(jid, { 
        text: `⬆️ @${userToPromote.split('@')[0]} is now an admin!`,
        mentions: [userToPromote]
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to promote user.' });
    }
  }
};
