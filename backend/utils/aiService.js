const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  }

  async generateResponse(prompt, context = '') {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a helpful WhatsApp bot assistant. Be concise, friendly, and human-like. ${context}`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return "I'm having trouble thinking right now. Please try again later! 🤖";
    }
  }

  async generateAutoReply(userName) {
    const prompts = [
      `Generate a friendly auto-reply message for ${userName} who is currently unavailable. Mention they will respond when free.`,
      `Create a casual away message for WhatsApp. The user ${userName} is busy and will reply later.`,
      `Write a short, friendly unavailable message for ${userName} on WhatsApp.`
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return await this.generateResponse(randomPrompt, 'Keep it under 100 characters, friendly tone.');
  }

  async summarizeText(text) {
    const prompt = `Summarize this text in 2-3 sentences: ${text}`;
    return await this.generateResponse(prompt);
  }

  async rewriteMessage(text, style = 'professional') {
    const prompt = `Rewrite this message in a ${style} style: ${text}`;
    return await this.generateResponse(prompt);
  }
}

module.exports = new AIService();
