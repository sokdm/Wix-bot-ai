module.exports = {
  name: 'calc',
  aliases: ['calculate', 'math', 'calculator'],
  description: 'Calculate mathematical expression',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a mathematical expression.\n\nExample: .calc 10 + 5 * 2' 
      });
    }
    
    const expression = args.join(' ');
    
    try {
      // Safe evaluation - only allow numbers and operators
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      
      if (sanitized !== expression) {
        return await sock.sendMessage(jid, { 
          text: '❌ Invalid characters in expression. Only numbers and + - * / ( ) allowed.' 
        });
      }
      
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      
      await sock.sendMessage(jid, { 
        text: `🧮 *Calculator*\n\n${sanitized} = *${result}*` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Invalid mathematical expression.' });
    }
  }
};
