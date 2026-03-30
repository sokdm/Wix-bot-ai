module.exports = {
  name: 'link',
  aliases: ['invitelink', 'grouplink'],
  description: 'Get group invite link',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid }) => {
    try {
      const code = await sock.groupInviteCode(jid);
      const link = `https://chat.whatsapp.com/${code}`;
      
      await sock.sendMessage(jid, { 
        text: `🔗 *Group Invite Link*\n\n${link}\n\nShare this link to invite others!` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to get invite link.' });
    }
  }
};
