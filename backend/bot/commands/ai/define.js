const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'define',
  aliases: ['meaning', 'dict', 'dictionary'],
  description: 'Get word definition',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a word to define.\n\nExample: .define serendipity' 
      });
    }
    
    const word = args[0];
    await sock.sendMessage(jid, { text: `📚 Looking up "${word}"...` });
    
    const prompt = `Define the word "${word}" and provide an example sentence.`;
    const definition = await aiService.generateResponse(prompt);
    
    await sock.sendMessage(jid, { 
      text: `📖 *${word}*\n\n${definition}` 
    });
  }
};
