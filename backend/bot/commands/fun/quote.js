const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" }
];

module.exports = {
  name: 'quote',
  aliases: ['quotes', 'inspire'],
  description: 'Get an inspirational quote',
  cooldown: 5,
  execute: async ({ sock, jid }) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await sock.sendMessage(jid, { 
      text: `💭 *Quote of the Day*\n\n"${randomQuote.text}"\n\n— ${randomQuote.author}` 
    });
  }
};
