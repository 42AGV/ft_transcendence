import io from 'socket.io-client';
const socket = io({ path: '/api/v1/socket.io', autoConnect: false });
export default socket;
