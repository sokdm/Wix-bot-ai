module.exports = {
  name: 'meme',
  description: 'Get a random meme',
  cooldown: 10,
  execute: async ({ sock, jid }) => {
    const memes = [
      "When you finally fix a bug after 5 hours... and realize it was a missing semicolon 😭",
      "Me: *writes 10 lines of code*\nMe: *tests*\nComputer: 47 errors found\nMe: 🤯",
      "My code doesn't work, I don't know why.\nMy code works, I don't know why. 🤷‍♂️",
      "Client: 'Can you make the logo bigger?'\nDesigner: *eye twitch* 👁️",
      "When the WiFi goes down during a video call 📉📉📉",
      "Me explaining to my mom what I do for a living:\n'I make computer go beep boop' 🤖",
      "That moment when you delete production database 💀",
      "git commit -m 'fixed stuff'\ngit push origin main\n*prays* 🙏"
    ];
    
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    await sock.sendMessage(jid, { 
      text: `🎭 *Meme of the Moment*\n\n${randomMeme}` 
    });
  }
};
