const jokes = [
  "Why don't scientists trust atoms? Because they make up everything! 😄",
  "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
  "Why don't eggs tell jokes? They'd crack each other up! 🥚",
  "What do you call a fake noodle? An impasta! 🍝",
  "Why did the math book look sad? Because it had too many problems! 📚",
  "What do you call a bear with no teeth? A gummy bear! 🐻",
  "Why did the cookie go to the doctor? Because it was feeling crumbly! 🍪",
  "What do you call a sleeping dinosaur? A dino-snore! 🦕",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one! ⛳",
  "What do you call a can opener that doesn't work? A can't opener! 🥫"
];

module.exports = {
  name: 'joke',
  aliases: ['jokes', 'funny'],
  description: 'Get a random joke',
  cooldown: 5,
  execute: async ({ sock, jid }) => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await sock.sendMessage(jid, { 
      text: `😂 *Random Joke*\n\n${randomJoke}` 
    });
  }
};
