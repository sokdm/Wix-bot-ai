#!/bin/bash

echo "🎨 Setting up Wix WhatsApp Bot Frontend..."

cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file
echo "⚙️ Creating environment file..."
cat > .env << 'ENVFILE'
VITE_API_URL=http://localhost:3000/api
ENVFILE

echo "✅ Frontend setup complete!"
echo ""
echo "To start the frontend:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173"
