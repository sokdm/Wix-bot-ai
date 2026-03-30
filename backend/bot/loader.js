const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CommandLoader {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.categories = new Set();
  }

  loadCommands() {
    const commandsDir = path.join(__dirname, 'commands');
    const categories = fs.readdirSync(commandsDir).filter(f => fs.statSync(path.join(commandsDir, f)).isDirectory());

    for (const category of categories) {
      this.categories.add(category);
      const categoryPath = path.join(commandsDir, category);
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const command = require(path.join(categoryPath, file));
          if (command.name) {
            this.commands.set(command.name, { ...command, category });
            
            if (command.aliases) {
              for (const alias of command.aliases) {
                this.aliases.set(alias, command.name);
              }
            }
            
            logger.info(`Loaded command: ${command.name} [${category}]`);
          }
        } catch (err) {
          logger.error(`Failed to load command ${file}:`, err);
        }
      }
    }

    logger.info(`Total commands loaded: ${this.commands.size}`);
    return this.commands;
  }

  getCommand(name) {
    const actualName = this.aliases.get(name) || name;
    return this.commands.get(actualName);
  }

  getAllCommands() {
    return Array.from(this.commands.values());
  }

  getCommandsByCategory(category) {
    return this.getAllCommands().filter(cmd => cmd.category === category);
  }
}

module.exports = CommandLoader;
