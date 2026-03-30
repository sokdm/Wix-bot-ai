const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'translate',
  aliases: ['tr', 'trans'],
  description: 'Translate text to English',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide text to translate.\n\nExample: .translate Hola mundo' 
      });
    }
    
    const text = args.join(' ');
    await sock.sendMessage(jid, { text: '🌐 Translating...' });
    
    const prompt = `Translate this to English: "${text}"`;
    const translation = await aiService.generateResponse(prompt, 'Only provide the translation, no extra text.');
    
    await sock.sendMessage(jid, { 
      text: `🌐 *Translation:*\n\n${translation}\n\n_Original: ${text}_` 
    });
  }
};
