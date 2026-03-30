const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'ai',
  aliases: ['gpt', 'bot', 'deepseek'],
  description: 'Chat with AI',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide text to chat with AI.\n\nExample: .ai Hello, how are you?' 
      });
    }
    
    const prompt = args.join(' ');
    await sock.sendMessage(jid, { text: '🤖 Thinking...' });
    
    const response = await aiService.generateResponse(prompt);
    await sock.sendMessage(jid, { text: `🤖 *AI Response:*\n\n${response}` });
  }
};
