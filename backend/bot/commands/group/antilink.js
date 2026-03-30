const NodeCache = require('node-cache');
const antilinkCache = new NodeCache({ stdTTL: 0 });

module.exports = {
  name: 'antilink',
  description: 'Toggle anti-link protection',
  cooldown: 5,
  groupOnly: true,
  adminOnly: true,
  execute: async ({ sock, jid, args }) => {
    const action = args[0]?.toLowerCase();
    
    if (!['on', 'off'].includes(action)) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage: .antilink on/off' 
      });
    }
    
    const groupId = jid;
    const isEnabled = action === 'on';
    
    antilinkCache.set(groupId, isEnabled);
    
    await sock.sendMessage(jid, { 
      text: `🔗 Anti-link protection ${isEnabled ? 'enabled' : 'disabled'}!` 
    });
    
    // Set up message handler for this group if enabled
    if (isEnabled) {
      // This would be handled by the main message handler
      // For now, just acknowledge
    }
  }
};
