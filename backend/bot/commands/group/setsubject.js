module.exports = {
  name: 'setsubject',
  aliases: ['setname', 'subject'],
  description: 'Change group name',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a new group name.\n\nExample: .setsubject My Awesome Group' 
      });
    }
    
    const newSubject = args.join(' ');
    
    try {
      await sock.groupUpdateSubject(jid, newSubject);
      await sock.sendMessage(jid, { 
        text: `✅ Group name changed to: ${newSubject}` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to change group name.' });
    }
  }
};
