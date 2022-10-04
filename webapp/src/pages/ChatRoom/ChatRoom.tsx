import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { Loading, Text, TextColor, TextVariant } from '../../shared/components';

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
      <div className="chat-room-header">
        <Text variant={TextVariant.HEADING} color={TextColor.LIGHT}>
          Chat Room
        </Text>
      </div>
      {socket ? (
        <div className="chat-room-container">
          <Messages socket={socket} />
          <MessageInput socket={socket} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default ChatRoom;
