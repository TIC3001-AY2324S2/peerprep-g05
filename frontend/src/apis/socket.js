import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.DOCKER_COLLABORATION_SVC_URL || 'http://localhost:3004';

export const socket = io(URL);