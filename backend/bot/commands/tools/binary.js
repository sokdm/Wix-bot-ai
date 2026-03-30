module.exports = {
  name: 'binary',
  description: 'Convert text to/from binary',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (args.length < 2) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage:\n.binary encode <text>\n.binary decode <binary>' 
      });
    }
    
    const action = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    
    try {
      if (action === 'encode') {
        const binary = text.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join(' ');
        await sock.sendMessage(jid, { 
          text: `🔢 *Binary Encoded*\n\n${binary}` 
        });
      } else if (action === 'decode') {
        const decoded = text.split(' ').map(bin => 
          String.fromCharCode(parseInt(bin, 2))
        ).join('');
        await sock.sendMessage(jid, { 
          text: `🔢 *Binary Decoded*\n\n${decoded}` 
        });
      } else {
        await sock.sendMessage(jid, { text: '❌ Use "encode" or "decode"' });
      }
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Invalid binary string.' });
    }
  }
};
