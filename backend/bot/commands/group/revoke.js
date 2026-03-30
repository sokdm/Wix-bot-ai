module.exports = {
  name: 'revoke',
  aliases: ['revokelink', 'resetlink'],
  description: 'Revoke and reset group invite link',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid }) => {
    try {
      await sock.groupRevokeInvite(jid);
      const newCode = await sock.groupInviteCode(jid);
      const newLink = `https://chat.whatsapp.com/${newCode}`;
      
      await sock.sendMessage(jid, { 
        text: `🔄 *Link Revoked!*\n\nNew invite link:\n${newLink}` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to revoke link.' });
    }
  }
};
