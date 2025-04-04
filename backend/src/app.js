console.log('App.js is loaded');
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { app } from './Socket/socket.js';
import mountRoutes from './routes/index.js';

// const app = express();

const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
};

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Mount all routes
mountRoutes(app);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    return res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    return res.status(404).json({
        status: 'fail',
        message: `Cannot find ${req.originalUrl} on this server!`
    });
});

export default app;