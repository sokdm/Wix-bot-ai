const User = require('../../../models/User');

module.exports = {
  name: 'autoreply',
  description: 'Toggle auto-reply feature',
  cooldown: 5,
  execute: async ({ sock, jid, args, userId }) => {
    const action = args[0]?.toLowerCase();
    
    if (!['on', 'off'].includes(action)) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage: .autoreply on/off' 
      });
    }
    
    const enabled = action === 'on';
    await User.findByIdAndUpdate(userId, { autoReply: enabled });
    
    await sock.sendMessage(jid, { 
      text: `🤖 Auto-reply has been turned *${action.toUpperCase()}*.\n\n${enabled ? 'I will now reply when you are unavailable.' : 'Auto-reply is now disabled.'}` 
    });
  }
};
