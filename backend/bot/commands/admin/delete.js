module.exports = {
  name: 'delete',
  aliases: ['del', 'd'],
  description: 'Delete bot message',
  cooldown: 3,
  execute: async ({ sock, jid, msg }) => {
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quoted) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please reply to a message to delete it.' 
      });
    }
    
    try {
      const key = {
        remoteJid: jid,
        fromMe: true,
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
        participant: msg.message.extendedTextMessage.contextInfo.participant
      };
      
      await sock.sendMessage(jid, { delete: key });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to delete message.' });
    }
  }
};
