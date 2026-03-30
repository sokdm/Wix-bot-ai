module.exports = {
  name: 'broadcast',
  aliases: ['bc', 'announce'],
  description: 'Send message to all chats',
  cooldown: 60,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a message to broadcast.' 
      });
    }
    
    const message = args.join(' ');
    const chats = await sock.groupFetchAllParticipating();
    const groupIds = Object.keys(chats);
    
    let sent = 0;
    for (const groupId of groupIds.slice(0, 10)) { // Limit to 10 groups
      try {
        await sock.sendMessage(groupId, { text: `📢 *Broadcast*\n\n${message}` });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${groupId}:`, err);
      }
    }
    
    await sock.sendMessage(jid, { 
      text: `✅ Broadcast sent to ${sent} groups.` 
    });
  }
};
