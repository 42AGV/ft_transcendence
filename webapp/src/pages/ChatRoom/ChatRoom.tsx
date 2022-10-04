import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import Messages from './Messages';
import MessageInput from './MessageInput';

import './ChatRoom.css';

function ChatRoom() {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <div className="chat-room">
      <header className="chat-room-header">Chat Room</header>
      {socket ? (
        <div className="chat-room-container">
          <Messages socket={socket} />
          <MessageInput socket={socket} />
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
}

export default ChatRoom;
