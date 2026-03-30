module.exports = {
  name: 'unmute',
  aliases: ['open', 'unlock'],
  description: 'Unmute group (everyone can send messages)',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid }) => {
    try {
      await sock.groupSettingUpdate(jid, 'not_announcement');
      await sock.sendMessage(jid, { 
        text: '🔊 Group unmuted! Everyone can send messages now.' 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to unmute group.' });
    }
  }
};
