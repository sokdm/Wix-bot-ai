const morseCode = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/'
};

const reverseMorse = Object.fromEntries(
  Object.entries(morseCode).map(([k, v]) => [v, k])
);

module.exports = {
  name: 'morse',
  description: 'Convert text to/from morse code',
  cooldown: 5,
  execute: async ({ sock, jid, args }) => {
    if (args.length < 2) {
      return await sock.sendMessage(jid, { 
        text: '❌ Usage:\n.morse encode <text>\n.morse decode <morse>' 
      });
    }
    
    const action = args[0].toLowerCase();
    const text = args.slice(1).join(' ').toUpperCase();
    
    try {
      if (action === 'encode') {
        const encoded = text.split('').map(char => morseCode[char] || char).join(' ');
        await sock.sendMessage(jid, { 
          text: `📻 *Morse Code*\n\n${encoded}` 
        });
      } else if (action === 'decode') {
        const decoded = text.split(' ').map(code => reverseMorse[code] || code).join('');
        await sock.sendMessage(jid, { 
          text: `📻 *Decoded*\n\n${decoded}` 
        });
      } else {
        await sock.sendMessage(jid, { text: '❌ Use "encode" or "decode"' });
      }
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Error converting morse code.' });
    }
  }
};
