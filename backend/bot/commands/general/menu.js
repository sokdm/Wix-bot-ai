module.exports = {
  name: 'menu',
  aliases: ['help', 'commands', 'cmd'],
  description: 'Show all available commands',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    const prefix = process.env.PREFIX || '.';
    
    const menuText = `🤖 *Wix WhatsApp AI Bot* 🤖
👨‍💻 Creator: Wisdom

*📋 General Commands:*
${prefix}menu - Show this menu
${prefix}ping - Check bot response time
${prefix}alive - Check if bot is running
${prefix}uptime - Show bot uptime
${prefix}info - Bot information
${prefix}owner - Contact creator

*🤖 AI Commands:*
${prefix}ai <text> - Chat with AI
${prefix}ask <question> - Ask AI anything
${prefix}chat <text> - Have a conversation
${prefix}summarize <text> - Summarize text
${prefix}rewrite <text> - Rewrite message

*👥 Group Commands:*
${prefix}tagall - Tag all members
${prefix}hidetag - Hidden tag all
${prefix}kick @user - Remove member
${prefix}add <number> - Add member
${prefix}promote @user - Make admin
${prefix}demote @user - Remove admin
${prefix}antilink on/off - Anti-link protection
${prefix}welcome on/off - Welcome messages
${prefix}groupinfo - Group information

*🎭 Media Commands:*
${prefix}sticker - Create sticker from image
${prefix}toimg - Convert sticker to image
${prefix}tomp3 - Convert video to audio
${prefix}vv - View once media
${prefix}save - Save media

*🎮 Fun Commands:*
${prefix}joke - Random joke
${prefix}meme - Random meme
${prefix}quote - Inspirational quote
${prefix}trivia - Trivia question
${prefix}roll - Roll dice
${prefix}flip - Flip coin
${prefix}8ball <question> - Magic 8-ball

*🛠️ Tools:*
${prefix}qr <text> - Generate QR code
${prefix}short <url> - Shorten URL
${prefix}calc <expression> - Calculator
${prefix}weather <city> - Weather info
${prefix}news - Latest news
${prefix}define <word> - Dictionary
${prefix}translate <text> - Translate text

*⚙️ Admin Commands:*
${prefix}autoreply on/off - Toggle auto-reply
${prefix}setprefix <prefix> - Change prefix

Type ${prefix}help <command> for detailed info.`;

    await sock.sendMessage(jid, { text: menuText });
  }
};
