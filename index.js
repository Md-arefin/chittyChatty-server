import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuIdv4 } from 'uuid';

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("Invalid User!"));
    }

    socket.username = username;
    socket.userId = uuIdv4();
    next();
});

io.on("connection",(socket) => {
    // socket events

    // all connected users
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            userId: socket.userId,
            username: socket.username,
        });
    }

    // all user event
    socket.emit("users", users);

    // connected user details
    socket.emit("session", {
        username: socket.username,
        userId: socket.userId
    });

    // new user event
    socket.broadcast.emit("user connected", {
        username: socket.username,
        userId: socket.userId
    });

    // new message
    socket.on("new message", (message) => {
        const newMessage = {
            username: socket.username,
            userId: socket.userId,
            message,
        };
    
        socket.emit("new message", newMessage); // Emit to the sender
        socket.broadcast.emit("new message", newMessage); // Broadcast to others
    });
    
});

console.log("ChittyChatty Listening to port @ 5000");

httpServer.listen(process.env.PORT || 5000);
