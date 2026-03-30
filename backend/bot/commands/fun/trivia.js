const trivia = [
  { q: "What is the largest planet in our solar system?", a: "Jupiter" },
  { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" },
  { q: "What is the capital of Japan?", a: "Tokyo" },
  { q: "How many continents are there on Earth?", a: "7" },
  { q: "What is the smallest prime number?", a: "2" },
  { q: "In which year did World War II end?", a: "1945" },
  { q: "What is the chemical symbol for gold?", a: "Au" },
  { q: "How many bones are in the adult human body?", a: "206" },
  { q: "What is the fastest land animal?", a: "Cheetah" },
  { q: "Who wrote 'Romeo and Juliet'?", a: "William Shakespeare" }
];

module.exports = {
  name: 'trivia',
  aliases: ['quiz', 'question'],
  description: 'Get a trivia question',
  cooldown: 10,
  execute: async ({ sock, jid }) => {
    const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];
    await sock.sendMessage(jid, { 
      text: `🎯 *Trivia Time!*\n\n${randomTrivia.q}\n\n_Answer: ${randomTrivia.a}_` 
    });
  }
};
