import Messages from './Messages';
import MessageInput from './MessageInput';
import { Header, IconVariant } from '../../shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import { goBack } from '../../shared/callbacks';
import './ChatRoom.css';
import { useEffect } from 'react';
import socket from '../../shared/socket';

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

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
        <Header icon={IconVariant.ARROW_BACK} onClick={goBack(navigate)}>
          Chat Room
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
