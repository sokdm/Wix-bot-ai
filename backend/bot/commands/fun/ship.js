module.exports = {
  name: 'ship',
  description: 'Ship two users together',
  cooldown: 10,
  execute: async ({ sock, jid, args, msg }) => {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    let user1, user2;
    
    if (mentioned.length >= 2) {
      user1 = mentioned[0];
      user2 = mentioned[1];
    } else if (mentioned.length === 1 && args[1]) {
      user1 = mentioned[0];
      user2 = args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
      return await sock.sendMessage(jid, { 
        text: '❌ Please mention two users to ship.\n\nExample: .ship @user1 @user2' 
      });
    }
    
    const compatibility = Math.floor(Math.random() * 100) + 1;
    const hearts = '❤️'.repeat(Math.ceil(compatibility / 20)) + '🖤'.repeat(5 - Math.ceil(compatibility / 20));
    
    let message = `💕 *Love Calculator* 💕\n\n`;
    message += `@${user1.split('@')[0]} 💞 @${user2.split('@')[0]}\n\n`;
    message += `Compatibility: ${compatibility}%\n${hearts}\n\n`;
    
    if (compatibility >= 80) message += '🔥 Perfect match!';
    else if (compatibility >= 60) message += '💫 Great chemistry!';
    else if (compatibility >= 40) message += '🌟 Good friends!';
    else message += '💔 Maybe just friends...';
    
    await sock.sendMessage(jid, { 
      text: message,
      mentions: [user1, user2]
    });
  }
};
