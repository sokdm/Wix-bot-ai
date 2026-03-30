module.exports = {
  name: 'add',
  aliases: ['invite', 'addmember'],
  description: 'Add member to group',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide phone number.\n\nExample: .add 1234567890' 
      });
    }
    
    const number = args[0].replace(/[^0-9]/g, '');
    const userJid = `${number}@s.whatsapp.net`;
    
    try {
      await sock.groupParticipantsUpdate(jid, [userJid], 'add');
      await sock.sendMessage(jid, { 
        text: `✅ Added +${number} to the group!` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { 
        text: '❌ Failed to add user. They may have privacy settings enabled.' 
      });
    }
  }
};
