import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageInput, Messages } from './components';
import { Header, IconVariant } from '../../shared/components';
import socket from '../../shared/socket';
import './ChatRoom.css';
import { useNavigation } from '../../shared/hooks/UseNavigation';

function ChatRoom() {
  const { roomId } = useParams();
  const { goBack } = useNavigation();

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
    }

    return () => {
      if (roomId) {
        socket.emit('leaveRoom', roomId);
      }
    };
  }, [roomId]);

  if (!roomId) {
    return null;
  }

  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
          {roomId}
        </Header>
      </div>
      <div className="chat-room-messages">
        <Messages from={roomId} />
      </div>
      <div className="chat-room-message-input">
        <MessageInput to={roomId} />
      </div>
    </div>
  );
}

export default ChatRoom;
