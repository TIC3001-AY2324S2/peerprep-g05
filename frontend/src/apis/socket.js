import {io} from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_DOCKER_COLLABORATION_SVC_SOCKET_URL || 'http://localhost:3009';

export const socket = io(URL);