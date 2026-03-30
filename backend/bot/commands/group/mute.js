module.exports = {
  name: 'mute',
  aliases: ['close', 'lock'],
  description: 'Mute group (only admins can send messages)',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid }) => {
    try {
      await sock.groupSettingUpdate(jid, 'announcement');
      await sock.sendMessage(jid, { 
        text: '🔇 Group muted! Only admins can send messages now.' 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to mute group.' });
    }
  }
};
