import io from 'socket.io-client';
const socket = io({ path: '/api/v1/socket.io' });
export default socket;
