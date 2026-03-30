const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'chat',
  description: 'Have a conversation with AI',
  cooldown: 3,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide text to chat.\n\nExample: .chat Tell me a story' 
      });
    }
    
    const text = args.join(' ');
    const response = await aiService.generateResponse(text, 'Be conversational and friendly.');
    await sock.sendMessage(jid, { text: `💬 ${response}` });
  }
};
