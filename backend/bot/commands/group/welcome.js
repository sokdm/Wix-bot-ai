const NodeCache = require('node-cache');
const welcomeCache = new NodeCache({ stdTTL: 0 });

module.exports = {
  name: 'welcome',
  description: 'Toggle welcome messages',
  cooldown: 5,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    const action = args[0]?.toLowerCase();
    
    if (!['on', 'off'].includes(action)) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage: .welcome on/off' 
      });
    }
    
    const groupId = jid;
    const isEnabled = action === 'on';
    
    welcomeCache.set(groupId, isEnabled);
    
    await sock.sendMessage(jid, { 
      text: `👋 Welcome messages ${isEnabled ? 'enabled' : 'disabled'}!` 
    });
  }
};
