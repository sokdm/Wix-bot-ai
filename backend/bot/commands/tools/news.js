const axios = require('axios');

module.exports = {
  name: 'news',
  description: 'Get latest news headlines',
  cooldown: 30,
  execute: async ({ sock, jid }) => {
    try {
      // Using newsdata.io or similar free API
      // For demo, using a mock response
      const headlines = [
        "🌍 Technology: AI continues to transform industries worldwide",
        "💼 Business: Global markets show positive trends this quarter",
        "🔬 Science: New breakthrough in renewable energy announced",
        "🏥 Health: Researchers discover potential new treatment",
        "🚀 Space: New mission to explore distant planets planned"
      ];
      
      const newsText = `📰 *Latest Headlines*\n\n${headlines.join('\n\n')}\n\n_Note: Connect to a news API for real-time updates_`;
      
      await sock.sendMessage(jid, { text: newsText });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to fetch news.' });
    }
  }
};
