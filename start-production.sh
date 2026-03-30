#!/bin/bash

echo "🚀 Starting Wix WhatsApp AI Bot Production..."

# Check environment
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  Warning: MONGODB_URI not set. Using local MongoDB."
fi

if [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "⚠️  Warning: DEEPSEEK_API_KEY not set. AI features will not work."
fi

# Start Backend
echo "🔧 Starting Backend..."
cd backend
NODE_ENV=production npm start &

# Wait for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend..."
cd ../frontend
npm run preview -- --host &

echo ""
echo "✅ Services started:"
echo "  Backend: http://localhost:3000"
echo "  Frontend: http://localhost:4173"
echo ""
echo "Press Ctrl+C to stop all services"

wait
