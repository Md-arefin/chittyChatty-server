import http from 'http';
import { Server } from 'socket.io';

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", async (socket) =>{
    // socket events
});

console.log("ChittyChatty Listening to port @ 5000");

httpServer.listen(process.env.PORT || 5000);
