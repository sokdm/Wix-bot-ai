const axios = require('axios');

module.exports = {
  name: 'short',
  aliases: ['shorten', 'tinyurl'],
  description: 'Shorten a URL',
  cooldown: 10,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a URL to shorten.\n\nExample: .short https://example.com/very/long/url' 
      });
    }
    
    const url = args[0];
    
    try {
      // Using tinyurl API
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = response.data;
      
      await sock.sendMessage(jid, { 
        text: `🔗 *URL Shortened*\n\n*Original:* ${url}\n*Short:* ${shortUrl}` 
      });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to shorten URL. Make sure it\'s valid.' });
    }
  }
};
