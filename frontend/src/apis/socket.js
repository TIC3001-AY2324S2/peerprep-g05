import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_DOCKER_COLLABORATION_SVC_SOCKET_URL || 'http://localhost:3009';

let socket;

function initializeSocket() {
    socket = io(URL);
    // You can add any additional setup code here
}

export function getSocket() {
    if (!socket) {
        initializeSocket();
    }
    return socket;
}