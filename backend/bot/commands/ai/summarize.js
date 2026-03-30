const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'summarize',
  aliases: ['summary', 'sum'],
  description: 'Summarize text',
  cooldown: 10,
  execute: async ({ sock, jid, args, msg }) => {
    let textToSummarize = args.join(' ');
    
    // If no args, check for quoted message
    if (!textToSummarize && msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
      textToSummarize = quoted.conversation || quoted.extendedTextMessage?.text || '';
    }
    
    if (!textToSummarize) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide text or reply to a message to summarize.' 
      });
    }
    
    await sock.sendMessage(jid, { text: '📝 Summarizing...' });
    
    const summary = await aiService.summarizeText(textToSummarize);
    await sock.sendMessage(jid, { 
      text: `📋 *Summary:*\n\n${summary}\n\n_Original length: ${textToSummarize.length} chars_` 
    });
  }
};
