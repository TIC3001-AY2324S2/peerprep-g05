import dotenv from "dotenv";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

// Read .env from root parent folder if docker is not used
if (process.env.IS_DOCKER != "true") {
    dotenv.config({ path: '../../.env' });
}

const port = process.env.COLLABORATION_SVC_PORT || 3009;
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: ["http://127.0.0.1:5500"] // to add frontend URL e.g [..., "http://localhost:3001"]
    }
});

httpServer.listen(port, () => {
  console.log("Listening on port", port);
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
        io.to(sessionHash).emit('code', codeData);
    });
});