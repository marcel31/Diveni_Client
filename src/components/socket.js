import { io } from 'socket.io-client';
import { SOCKET_URL } from '@env';

const URL = SOCKET_URL;

export const socket = io(URL, {
    timeout: 5000,
    rejectUnauthorized: false,
    autoConnect: false,
});
