#!/bin/bash

echo "🚀 Setting up Wix WhatsApp AI Bot..."

# Update and install dependencies
echo "📦 Installing system dependencies..."
pkg update -y
pkg install -y nodejs mongodb ffmpeg git

# Create directories
echo "📁 Creating project structure..."
mkdir -p wix-whatsapp-bot/backend
cd wix-whatsapp-bot/backend

# Initialize npm
echo "📦 Initializing npm..."
npm init -y

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install express mongoose jsonwebtoken bcryptjs cors dotenv axios qrcode qrcode-terminal node-cache express-rate-limit helmet pino pino-pretty fluent-ffmpeg mime-types form-data fs-extra path moment node-cron @whiskeysockets/baileys

# Create .env file
echo "⚙️ Creating environment file..."
cat > .env << 'ENVFILE'
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wix_whatsapp_bot
JWT_SECRET=wix_whatsapp_super_secret_key_2024
JWT_EXPIRE=7d
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
ADMIN_EMAIL=admin@wixbot.com
ADMIN_PASSWORD=admin123
BOT_NAME=Wix WhatsApp AI Bot
CREATOR_NAME=Wisdom
PREFIX=.
ENVFILE

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual API keys"
echo "2. Start MongoDB: mongod --dbpath ~/data/db &"
echo "3. Start the server: npm start"
echo ""
echo "📱 For frontend setup, run setup-frontend.sh"
