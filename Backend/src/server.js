const express = require('express');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Watch Party & Live Chat WebSocket logic
const rooms = new Map();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'JOIN_WATCH_PARTY') {
            const roomCode = data.roomCode;
            if (!rooms.has(roomCode)) rooms.set(roomCode, new Set());
            rooms.get(roomCode).add(ws);
            ws.roomCode = roomCode;
        }

        if (data.type === 'SYNC_PLAYER') {
            // Broadcast playback state to everyone else in the room
            const room = rooms.get(ws.roomCode);
            if (room) {
                room.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'SYNC_PLAYER', time: data.time, state: data.state }));
                    }
                });
            }
        }
    });

    ws.on('close', () => {
        if (ws.roomCode && rooms.has(ws.roomCode)) {
            rooms.get(ws.roomCode).delete(ws);
        }
    });
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// Add this near the top of server.js
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function startServer() {
    try {
        await client.connect();
        console.log('Database connected successfully');
        
        // Make the db instance available to all your routes
        app.locals.db = client.db('dtube');

        // Wrap your existing server.listen call inside this success block
        server.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed', error);
    }
}

startServer();