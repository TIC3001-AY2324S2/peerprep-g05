import dotenv from "dotenv";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./index.js";

let codepadValue = {
    "changes": [
      {
        "range": {
          "startLineNumber": 1,
          "startColumn": 1,
          "endLineNumber": 1,
          "endColumn": 1
        },
        "rangeLength": 0,
        "text": 'test!',
        "rangeOffset": 0,
        "forceMoveMarkers": false
      }
    ],
    "eol": '\r\n',
    "isEolChange": false,
    "versionId": 2,
    "isUndoing": false,
    "isRedoing": false,
    "isFlush": false
  }

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
    console.log(`User ${socket.id} connected`);

    socket.on('joinSession', (sessionHash) => {
        hash = sessionHash;
        socket.join(sessionHash);
        console.log(`User ${socket.id} joined session ${sessionHash}`);

        const clients = io.sockets.adapter.rooms.get(sessionHash);
        console.log(`Number of connected clients in session ${sessionHash}: ${clients.size}`);
        socket.broadcast.to(sessionHash).emit('code', codepadValue); // send codepad value to new user
        const connectedMsg = "Your partner has connected";
        console.log(`connectedMsg: ${connectedMsg}`);
        io.to(hash).emit('connected1', connectedMsg);
    });

    socket.on('code', (sessionHash, codeData) => {
        console.log(`Updating session code from user ${socket.id}`);
        console.log(`sessionHash: ${sessionHash}`);
        codepadValue = codeData; // store codepad value in memory
        console.log(`<<codeData: ${JSON.stringify(codeData, null, 2)}`);
        socket.broadcast.to(sessionHash).emit('code', codeData);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        const disconnectedMsg = "Your partner has disconnected";
        io.to(hash).emit('disconnect1', disconnectedMsg);
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
