module.exports = {
  name: 'setprefix',
  description: 'Change command prefix',
  cooldown: 10,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a new prefix.\n\nExample: .setprefix !' 
      });
    }
    
    const newPrefix = args[0];
    
    if (newPrefix.length > 3) {
      return await sock.sendMessage(jid, { 
        text: '❌ Prefix must be 1-3 characters.' 
      });
    }
    
    process.env.PREFIX = newPrefix;
    
    await sock.sendMessage(jid, { 
      text: `✅ Prefix changed to: ${newPrefix}\n\nExample: ${newPrefix}menu` 
    });
  }
};
