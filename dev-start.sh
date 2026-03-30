#!/bin/bash

echo "🚀 Starting Wix WhatsApp Bot Development..."

# Kill existing processes
pkill -f "node server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null

sleep 1

# Start Backend
echo "🔧 Starting Backend on http://localhost:3000"
cd ~/wix-whatsapp-bot/backend
npm start &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start Frontend
echo "🎨 Starting Frontend on http://localhost:5173"
cd ~/wix-whatsapp-bot/frontend
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "✅ Both services started!"
echo "  📱 Frontend: http://localhost:5173"
echo "  ⚙️  Backend:  http://localhost:3000"
echo ""
echo "Press Enter to stop both services"
read

kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "🛑 Services stopped"
