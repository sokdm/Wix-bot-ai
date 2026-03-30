module.exports = {
  name: 'password',
  aliases: ['pwd', 'pass', 'genpass'],
  description: 'Generate secure password',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    const length = args[0] ? parseInt(args[0]) : 12;
    
    if (length < 4 || length > 50) {
      return await sock.sendMessage(jid, { 
        text: '❌ Password length must be between 4 and 50.' 
      });
    }
    
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    await sock.sendMessage(jid, { 
      text: `🔐 *Generated Password*\n\n\`${password}\`\n\nLength: ${length} characters\n\n⚠️ Save this password securely!` 
    });
  }
};
