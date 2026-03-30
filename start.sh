#!/bin/bash

echo "🚀 Starting Wix WhatsApp AI Bot..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null
then
    echo "🍃 Starting MongoDB..."
    mkdir -p ~/data/db
    mongod --dbpath ~/data/db --fork --logpath ~/data/mongod.log
fi

# Start backend
echo "🔧 Starting Backend..."
cd backend
npm start
