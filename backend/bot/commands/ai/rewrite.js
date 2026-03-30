const aiService = require('../../../utils/aiService');

module.exports = {
  name: 'rewrite',
  aliases: ['rephrase', 'paraphrase'],
  description: 'Rewrite text in different style',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (args.length < 2) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage: .rewrite <style> <text>\n\nStyles: professional, casual, formal, funny, simple' 
      });
    }
    
    const style = args[0];
    const text = args.slice(1).join(' ');
    
    await sock.sendMessage(jid, { text: '✍️ Rewriting...' });
    
    const rewritten = await aiService.rewriteMessage(text, style);
    await sock.sendMessage(jid, { 
      text: `🔄 *Rewritten (${style}):*\n\n${rewritten}` 
    });
  }
};
