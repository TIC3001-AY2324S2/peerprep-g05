import dotenv from "dotenv";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./index.js";

let codepadValue = {};

const socketToUsernameMap = {};

// Read .env from root parent folder if docker is not used
if (process.env.IS_DOCKER != "true") {
    dotenv.config({ path: '../../.env' });
}

const port = process.env.COLLABORATION_SVC_PORT || 3004;
const frontendPort = 3009; // replace when frontend is ready
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:3000"] // to add frontend URL e.g [...,
        // "http://localhost:3001"]
    }
});

app.listen(port, () => {
    console.log(`Collaboration service listening on port ${port}!`);
});

//user connects, socket created for user
io.on('connection', (socket) => {
    let hash;
    console.log(`Socket [${socket.id}] connected`);

    socket.on('joinSession', (sessionHash, name) => {
        hash = sessionHash;
        socket.join(sessionHash);
        socketToUsernameMap[socket.id] = name;
        console.log(`User [${socketToUsernameMap[socket.id]}] joined session [${sessionHash}]`);

        const clients = io.sockets.adapter.rooms.get(sessionHash);
        console.log(`Number of connected clients in session ${sessionHash}: ${clients.size}`);
        const connectedMsg = "Your partner has connected";
        console.log(`connectedMsg: ${connectedMsg}`);
        io.to(hash).emit('connected1', connectedMsg, clients.size, socket.id, codepadValue[sessionHash]); // send codepad value to new user
        io.to(socket.id).emit('loadStorage', codepadValue[sessionHash]);
    });

    socket.on('code', (sessionHash, codeData, codeValue) => {
        console.log(`Updating session [${sessionHash}] code from user ${socket.id}`);
        codepadValue[sessionHash] = codeValue;
        socket.broadcast.to(sessionHash).emit('code', codeData);
    });

    socket.on('disconnect', () => {
        console.log(`Socket [${socket.id}] - User [${socketToUsernameMap[socket.id]}] disconnected`);
        const disconnectedMsg = "Your partner has disconnected";
        io.to(hash).emit('disconnect1', disconnectedMsg, socket.id);
    });
});

httpServer.listen(frontendPort, () => {
  console.log("Socket listening on port", frontendPort);
});
