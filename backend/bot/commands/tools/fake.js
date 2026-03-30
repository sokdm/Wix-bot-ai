const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];

module.exports = {
  name: 'fake',
  aliases: ['fakeuser', 'randomuser'],
  description: 'Generate fake user data',
  cooldown: 5,
  execute: async ({ sock, jid }) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const age = Math.floor(Math.random() * 40) + 20;
    const phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const fakeData = `👤 *Fake Identity*

*Name:* ${firstName} ${lastName}
*Age:* ${age}
*Email:* ${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}
*Phone:* ${phone}
*City:* ${city}
*Username:* ${firstName.toLowerCase()}${Math.floor(Math.random() * 999)}

⚠️ This is randomly generated data for testing purposes only.`;
    
    await sock.sendMessage(jid, { text: fakeData });
  }
};
