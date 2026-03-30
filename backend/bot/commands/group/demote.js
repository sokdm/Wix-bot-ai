module.exports = {
  name: 'demote',
  aliases: ['removeadmin', 'unadmin'],
  description: 'Demote admin to member',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args, msg }) => {
    let userToDemote = args[0];
    
    if (!userToDemote && msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      userToDemote = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    
    if (!userToDemote) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please mention a user to demote.\n\nExample: .demote @user' 
      });
    }
    
    try {
      await sock.groupParticipantsUpdate(jid, [userToDemote], 'demote');
      await sock.sendMessage(jid, { 
        text: `⬇️ @${userToDemote.split('@')[0]} is no longer an admin.`,
        mentions: [userToDemote]
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to demote user.' });
    }
  }
};
