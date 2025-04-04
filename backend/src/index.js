import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from './app.js';
import { server } from './Socket/socket.js';
dotenv.config();

connectDB()
    .then(() => {
        app.get("/", (req, res) => {
            res.send('<h1>Server is running</h1>');
        });

        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });