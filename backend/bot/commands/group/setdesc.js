module.exports = {
  name: 'setdesc',
  aliases: ['setdescription', 'description'],
  description: 'Change group description',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a description.\n\nExample: .setdesc Welcome to our group!' 
      });
    }
    
    const newDesc = args.join(' ');
    
    try {
      await sock.groupUpdateDescription(jid, newDesc);
      await sock.sendMessage(jid, { 
        text: `✅ Group description updated!` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to update description.' });
    }
  }
};
