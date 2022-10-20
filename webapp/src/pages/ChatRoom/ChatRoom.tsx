import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatRoomMessageInput, ChatRoomMessages } from './components';
import { Header, IconVariant } from '../../shared/components';
import socket from '../../shared/socket';
import './ChatRoom.css';
import { useNavigation } from '../../shared/hooks/UseNavigation';

function ChatRoom() {
  const { chatRoomId } = useParams();
  const { goBack } = useNavigation();

  useEffect(() => {
    if (chatRoomId) {
      socket.emit('joinChatRoom', chatRoomId);
    }

    return () => {
      if (chatRoomId) {
        socket.emit('leaveChatRoom', chatRoomId);
      }
    };
  }, [chatRoomId]);

  if (!chatRoomId) {
    return null;
  }

  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
          {chatRoomId}
        </Header>
      </div>
      <div className="chat-room-messages">
        <ChatRoomMessages from={chatRoomId} />
      </div>
      <div className="chat-room-message-input">
        <ChatRoomMessageInput to={chatRoomId} />
      </div>
    </div>
  );
}

export default ChatRoom;
