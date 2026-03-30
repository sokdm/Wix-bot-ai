const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'ask',
  description: 'Ask AI a question',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please ask a question.\n\nExample: .ask What is the capital of France?' 
      });
    }
    
    const question = args.join(' ');
    await sock.sendMessage(jid, { text: '🔍 Searching for answer...' });
    
    const response = await aiService.generateResponse(question, 'Answer concisely and accurately.');
    await sock.sendMessage(jid, { text: `💡 *Answer:*\n\n${response}` });
  }
};
