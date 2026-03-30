const QRCode = require('qrcode');

module.exports = {
  name: 'qr',
  aliases: ['qrcode', 'code'],
  description: 'Generate QR code',
  cooldown: 10,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide text to convert to QR code.\n\nExample: .qr https://google.com' 
      });
    }
    
    const text = args.join(' ');
    
    try {
      const qrBuffer = await QRCode.toBuffer(text, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      await sock.sendMessage(jid, { 
        image: qrBuffer,
        caption: `📱 QR Code for:\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to generate QR code.' });
    }
  }
};
