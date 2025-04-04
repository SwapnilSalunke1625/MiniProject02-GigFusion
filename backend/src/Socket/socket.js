import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173'];

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    // console.log(`User connected: ${userId}`);

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on('disconnect', () => {
        if (userId && userId !== "undefined") {
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
        // console.log(`User disconnected: ${userId}`);
    });
});

export { app, io, server };