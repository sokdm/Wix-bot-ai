const axios = require('axios');

module.exports = {
  name: 'weather',
  description: 'Get weather information',
  cooldown: 10,
  execute: async ({ sock, jid, args }) => {
    if (!args.length) {
      return await sock.sendMessage(jid, { 
        text: '❌ Please provide a city name.\n\nExample: .weather London' 
      });
    }
    
    const city = args.join(' ');
    
    try {
      // Using wttr.in API (no key required)
      const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
        timeout: 10000
      });
      
      const data = response.data;
      const current = data.current_condition[0];
      const location = data.nearest_area[0];
      
      const weatherText = `🌤️ *Weather in ${location.areaName[0].value}, ${location.country[0].value}*

🌡️ Temperature: ${current.temp_C}°C / ${current.temp_F}°F
💧 Humidity: ${current.humidity}%
🌬️ Wind: ${current.windspeedKmph} km/h
☁️ Condition: ${current.weatherDesc[0].value}
👁️ Visibility: ${current.visibility} km

_Last updated: ${current.localObsDateTime}_`;
      
      await sock.sendMessage(jid, { text: weatherText });
    } catch (err) {
      await sock.sendMessage(jid, { text: '❌ Failed to fetch weather data. Please check the city name.' });
    }
  }
};
