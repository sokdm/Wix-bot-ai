module.exports = {
  name: 'uuid',
  aliases: ['guid', 'uuidgen'],
  description: 'Generate UUID/GUID',
  cooldown: 3,
  execute: async ({ sock, jid }) => {
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const uuid = generateUUID();
    
    await sock.sendMessage(jid, { 
      text: `🆔 *Generated UUID*\n\n\`${uuid}\`` 
    });
  }
};
