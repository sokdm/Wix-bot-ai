module.exports = {
  name: 'base64',
  description: 'Encode/decode base64',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (args.length < 2) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage:\n.base64 encode <text>\n.base64 decode <base64>' 
      });
    }
    
    const action = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    
    try {
      if (action === 'encode') {
        const encoded = Buffer.from(text).toString('base64');
        await sock.sendMessage(jid, { 
          text: `🔐 *Base64 Encoded*\n\n${encoded}` 
        });
      } else if (action === 'decode') {
        const decoded = Buffer.from(text, 'base64').toString('utf8');
        await sock.sendMessage(jid, { 
          text: `🔓 *Base64 Decoded*\n\n${decoded}` 
        });
      } else {
        await sock.sendMessage(jid, { text: '❌ Use "encode" or "decode"' });
      }
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Invalid base64 string.' });
    }
  }
};
