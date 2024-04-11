import dotenv from "dotenv";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./index.js";

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
    console.log(`User ${socket.id} connected`);

    socket.on('joinSession', (sessionHash) => {
        socket.join(sessionHash);
        console.log(`User ${socket.id} joined session ${sessionHash}`);

        const clients = io.sockets.adapter.rooms.get(sessionHash);
        console.log(`Number of connected clients in session ${sessionHash}: ${clients.size}`);
    });

    socket.on('code', (sessionHash, codeData) => {
        console.log(`Updating session code from user ${socket.id}`);
        console.log(`sessionHash: ${sessionHash}`);
        socket.broadcast.to(sessionHash).emit('code', codeData);
    });
});

httpServer.listen(frontendPort, () => {
  console.log("Socket listening on port", frontendPort);
});

// //user connects, socket created for user
// io.on('connection', (socket) => {
//     console.log(`User ${socket.id} connected`);

//     socket.on('joinSession', (sessionHash) => {
//         socket.join(sessionHash);
//         console.log(`User ${socket.id} joined session ${sessionHash}`);

//         const clients = io.sockets.adapter.rooms.get(sessionHash);
//         console.log(`Number of connected clients in session ${sessionHash}: ${clients.size}`);
//     });

//     socket.on('code', (sessionHash, codeData) => {
//         console.log(`Updating session code from user ${socket.id}`);
//         console.log(`sessionHash: ${sessionHash}`);
//         io.to(sessionHash).emit('code', codeData);
//     });
// });
